from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserRegister(UserBase):
    password: str
    college: Optional[str] = "East West Institute of Technology"
    usn_roll_no: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = 1

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    fullName: str

# Team Schemas
class TeamCreate(BaseModel):
    name: str
    track: str

class TeamResponse(BaseModel):
    id: str
    name: str
    track: str
    group_code: str
    leader_id: str
    is_locked: bool
    is_paid: bool
    project_title: Optional[str] = None
    project_description: Optional[str] = None
    github_url: Optional[str] = None
    presentation_url: Optional[str] = None
    prototype_url: Optional[str] = None
    submission_locked: bool

    class Config:
        from_attributes = True

# Grading & scoring schemas
class ScoreSubmit(BaseModel):
    innovation_score: int = Field(..., ge=0, le=10)
    technical_complexity_score: int = Field(..., ge=0, le=10)
    impact_relevance_score: int = Field(..., ge=0, le=10)
    presentation_score: int = Field(..., ge=0, le=10)
    comments: Optional[str] = None

# Support Ticket schemas
class TicketCreate(BaseModel):
    category: str
    description: str

class TicketResponse(BaseModel):
    id: str
    category: str
    description: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
