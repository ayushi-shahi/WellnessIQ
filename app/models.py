from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base
from sqlalchemy import Text

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    activity_level = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    trackers = relationship("Tracker", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    ai_insights = relationship("AIInsight", back_populates="user", cascade="all, delete-orphan")

class Tracker(Base):
    __tablename__ = "trackers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    steps = Column(Integer, nullable=True)
    calories = Column(Integer, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    mood_score = Column(Integer, nullable=True)
    stress_level = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="trackers")

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_type = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="goals")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    insight_text = Column(Text, nullable=False)  # <-- change here
    generated_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="ai_insights")
