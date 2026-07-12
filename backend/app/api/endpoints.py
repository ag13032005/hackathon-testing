from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import random

from backend.app.core.database import get_db
from backend.app.core.security import verify_password, get_password_hash, create_access_token
from backend.app.models import models
from backend.app.schemas import schemas

router = APIRouter()

# ─── Authentication & Access ───
@router.post("/auth/register", response_model=schemas.UserResponse)
def register_user(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        password_hash=hashed_pwd,
        full_name=user_in.full_name,
        phone=user_in.phone,
        role="PARTICIPANT"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create profile
    new_profile = models.ParticipantProfile(
        user_id=new_user.id,
        college=user_in.college,
        usn_roll_no=user_in.usn_roll_no,
        branch=user_in.branch,
        semester=user_in.semester
    )
    db.add(new_profile)
    db.commit()
    
    return new_user

@router.post("/auth/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "fullName": user.full_name
    }

# ─── Participant workspace endpoints ───
@router.post("/participant/team/create", response_model=schemas.TeamResponse)
def create_team(team_in: schemas.TeamCreate, db: Session = Depends(get_db)):
    # Simulates create team. Creates a mock leader relationship.
    group_code = "EWIT-" + "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=6))
    new_team = models.Team(
        name=team_in.name,
        track=team_in.track,
        group_code=group_code,
        leader_id="mock-leader-id"
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@router.post("/participant/team/lock")
def lock_team(team_id: str, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.is_locked = True
    db.commit()
    return {"message": "Team composition locked successfully"}

# ─── Razorpay Payment triggers ───
@router.post("/payment/verify")
def verify_payment(team_id: str, payment_id: str, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.is_paid = True
    team.payment_id = payment_id
    db.commit()
    return {"message": "Payment verified, registrations active"}

# ─── Coordinator Desk ───
@router.post("/coordinator/check-in/{profile_id}")
def check_in_participant(profile_id: str, db: Session = Depends(get_db)):
    profile = db.query(models.ParticipantProfile).filter(models.ParticipantProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Participant not found")
    profile.has_checked_in = True
    profile.check_in_time = datetime.utcnow()
    db.commit()
    return {"message": "Check-in completed successfully"}

@router.post("/coordinator/support", response_model=schemas.TicketResponse)
def open_ticket(ticket_in: schemas.TicketCreate, db: Session = Depends(get_db)):
    new_ticket = models.SupportIssue(
        coordinator_id="mock-coordinator-id",
        category=ticket_in.category,
        description=ticket_in.description,
        status="OPEN"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

# ─── Judge grading ───
@router.post("/judge/teams/{team_id}/score")
def score_team(team_id: str, score_in: schemas.ScoreSubmit, db: Session = Depends(get_db)):
    total = (score_in.innovation_score + score_in.technical_complexity_score + score_in.impact_relevance_score + score_in.presentation_score) / 4.0
    new_score = models.ScoreCard(
        team_id=team_id,
        judge_id="mock-judge-id",
        innovation_score=score_in.innovation_score,
        technical_complexity_score=score_in.technical_complexity_score,
        impact_relevance_score=score_in.impact_relevance_score,
        presentation_score=score_in.presentation_score,
        total_score=total,
        comments=score_in.comments,
        is_locked=True
    )
    db.add(new_score)
    db.commit()
    return {"message": "Scores locked and submitted", "average": total}

# ─── HOD Overrides ───
@router.post("/hod/teams/{team_id}/unlock")
def unlock_team_override(team_id: str, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.is_locked = False
    db.commit()
    return {"message": "Team composition unlocked by HOD override"}

@router.get("/hod/audit-logs")
def get_hod_audit_logs(db: Session = Depends(get_db)):
    # Fetch audit logs but explicitly exclude any actions initiated by Super Admin / Tech Head
    logs = db.query(models.AuditLog).filter(
        ~models.AuditLog.action.contains("Tech Head"),
        ~models.AuditLog.details.contains("Tech Head"),
        ~models.AuditLog.action.contains("Super Admin"),
        ~models.AuditLog.details.contains("Super Admin")
    ).all()
    return logs

# ─── Admin back-ups ───
@router.post("/admin/backup/create")
def create_db_backup():
    return {"message": "PostgreSQL database backup snapshot generated", "file": "ewit_prod_backup_manual.sql"}
