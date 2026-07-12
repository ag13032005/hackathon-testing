import uuid
from sqlalchemy import Column, String, Integer, Boolean, Float, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

# Helper to support UUID across SQLite and Postgres
def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(50), default="PARTICIPANT") # TECH_HEAD, HOD, JUDGE, COORDINATOR, PARTICIPANT
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("ParticipantProfile", back_populates="user", uselist=False)

class ParticipantProfile(Base):
    __tablename__ = "participant_profiles"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    college = Column(String(255), default="East West Institute of Technology")
    usn_roll_no = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)
    semester = Column(Integer, default=1)
    team_id = Column(String(36), ForeignKey("teams.id"), nullable=True)
    has_checked_in = Column(Boolean, default=False)
    check_in_time = Column(DateTime, nullable=True)
    qr_code_data = Column(String(255), nullable=True)
    certificate_generated = Column(Boolean, default=False)
    certificate_url = Column(String(512), nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")
    team = relationship("Team", back_populates="members")
    coupons = relationship("Coupon", back_populates="participant")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), unique=True, nullable=False)
    track = Column(String(100), nullable=False) # AI_AUTOMATION, HEALTHTECH_WELLNESS, etc.
    group_code = Column(String(20), unique=True, nullable=False)
    leader_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    is_locked = Column(Boolean, default=False)
    is_paid = Column(Boolean, default=False)
    payment_id = Column(String(255), nullable=True)
    payment_order_id = Column(String(255), nullable=True)
    project_title = Column(String(255), nullable=True)
    project_description = Column(Text, nullable=True)
    github_url = Column(String(512), nullable=True)
    presentation_url = Column(String(512), nullable=True)
    prototype_url = Column(String(512), nullable=True)
    submission_locked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    members = relationship("ParticipantProfile", back_populates="team")
    score_cards = relationship("ScoreCard", back_populates="team")

class TeamJoinRequest(Base):
    __tablename__ = "team_join_requests"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_id = Column(String(36), ForeignKey("teams.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="PENDING") # PENDING, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

class Coupon(Base):
    __tablename__ = "coupons"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    participant_id = Column(String(36), ForeignKey("participant_profiles.id"), nullable=False)
    coupon_type = Column(String(50), nullable=False) # BREAKFAST, LUNCH, DINNER
    status = Column(String(50), default="UNUSED") # UNUSED, REDEEMED, LOCKED
    redeemed_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    redeemed_at = Column(DateTime, nullable=True)

    # Relationships
    participant = relationship("ParticipantProfile", back_populates="coupons")

class ScoreCard(Base):
    __tablename__ = "score_cards"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_id = Column(String(36), ForeignKey("teams.id"), nullable=False)
    judge_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    round_number = Column(Integer, default=1)
    innovation_score = Column(Integer, default=0)
    technical_complexity_score = Column(Integer, default=0)
    impact_relevance_score = Column(Integer, default=0)
    presentation_score = Column(Integer, default=0)
    total_score = Column(Float, default=0.0)
    comments = Column(Text, nullable=True)
    is_locked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="score_cards")

class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    target_role = Column(String(50), default="ALL") # ALL, PARTICIPANT, JUDGE, COORDINATOR
    created_at = Column(DateTime, default=datetime.utcnow)

class SupportIssue(Base):
    __tablename__ = "support_issues"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    participant_id = Column(String(36), ForeignKey("participant_profiles.id"), nullable=True)
    coordinator_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False) # Wi-Fi, Power, Food, Hardware, Other
    description = Column(Text, nullable=False)
    status = Column(String(50), default="OPEN") # OPEN, IN_PROGRESS, RESOLVED
    resolved_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
