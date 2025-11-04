from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional, List
from app.models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None

class UserResponse(UserBase):
    id: int
    age: Optional[int]
    gender: Optional[str]
    height: Optional[float]
    weight: Optional[float]
    activity_level: Optional[str]
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

class TrackerBase(BaseModel):
    date: date
    steps: Optional[int] = None
    calories: Optional[int] = None
    sleep_hours: Optional[float] = None
    mood_score: Optional[int] = Field(None, ge=1, le=10)
    stress_level: Optional[int] = Field(None, ge=1, le=10)

class TrackerCreate(TrackerBase):
    pass

class TrackerResponse(TrackerBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    goal_type: str
    target_value: float
    deadline: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    current_value: Optional[float] = None
    target_value: Optional[float] = None
    deadline: Optional[date] = None

class GoalResponse(GoalBase):
    id: int
    user_id: int
    current_value: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class AIInsightResponse(BaseModel):
    id: int
    user_id: int
    insight_text: str
    generated_at: datetime
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    cached: bool = False

class WellnessScore(BaseModel):
    score: float
    recommendations: List[str]
