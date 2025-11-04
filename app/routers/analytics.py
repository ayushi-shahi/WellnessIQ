from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app import models, schemas, oauth2, utils
from app.database import get_db
import redis
import json
import os

router = APIRouter(prefix="/analytics", tags=["Analytics"])

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
try:
    redis_client = redis.from_url(redis_url, decode_responses=True)
except:
    redis_client = None

@router.get("/progress")
def get_progress(
    days: int = 30,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    cache_key = f"analytics:progress:{current_user.id}:{days}"
    
    if redis_client:
        try:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return {"data": json.loads(cached_data), "cached": True}
        except:
            pass
    
    start_date = datetime.utcnow().date() - timedelta(days=days)
    
    trackers = db.query(models.Tracker).filter(
        models.Tracker.user_id == current_user.id,
        models.Tracker.date >= start_date
    ).order_by(models.Tracker.date).all()
    
    progress_data = {
        "daily_data": [],
        "averages": {
            "sleep_hours": 0,
            "steps": 0,
            "calories": 0,
            "mood_score": 0,
            "stress_level": 0
        },
        "trends": {}
    }
    
    sleep_sum = steps_sum = calories_sum = mood_sum = stress_sum = 0
    count = len(trackers)
    
    for tracker in trackers:
        progress_data["daily_data"].append({
            "date": str(tracker.date),
            "sleep_hours": tracker.sleep_hours or 0,
            "steps": tracker.steps or 0,
            "calories": tracker.calories or 0,
            "mood_score": tracker.mood_score or 0,
            "stress_level": tracker.stress_level or 0
        })
        
        sleep_sum += tracker.sleep_hours or 0
        steps_sum += tracker.steps or 0
        calories_sum += tracker.calories or 0
        mood_sum += tracker.mood_score or 0
        stress_sum += tracker.stress_level or 0
    
    if count > 0:
        progress_data["averages"] = {
            "sleep_hours": round(sleep_sum / count, 2),
            "steps": round(steps_sum / count, 0),
            "calories": round(calories_sum / count, 0),
            "mood_score": round(mood_sum / count, 2),
            "stress_level": round(stress_sum / count, 2)
        }
    
    if redis_client:
        try:
            redis_client.setex(cache_key, 300, json.dumps(progress_data))
        except:
            pass
    
    return {"data": progress_data, "cached": False}

@router.get("/wellness-score")
def get_wellness_score(
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    latest_tracker = db.query(models.Tracker).filter(
        models.Tracker.user_id == current_user.id
    ).order_by(models.Tracker.date.desc()).first()
    
    if not latest_tracker:
        raise HTTPException(
            status_code=404,
            detail="No tracker data found. Please log your wellness data first."
        )
    
    score = utils.calculate_wellness_score(
        latest_tracker.sleep_hours or 7,
        latest_tracker.steps or 5000,
        latest_tracker.calories or 2000,
        latest_tracker.stress_level or 5
    )
    
    recommendations = utils.generate_recommendations(
        latest_tracker.sleep_hours or 7,
        latest_tracker.steps or 5000,
        latest_tracker.calories or 2000,
        latest_tracker.stress_level or 5,
        score
    )
    
    return {
        "score": round(score, 2),
        "recommendations": recommendations
    }

@router.get("/admin/all-users")
def get_all_users_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_admin_user)
):
    cache_key = "analytics:admin:all_users"
    
    if redis_client:
        try:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return {"data": json.loads(cached_data), "cached": True}
        except:
            pass
    
    users = db.query(models.User).all()
    analytics_data = []
    
    for user in users:
        trackers_count = db.query(models.Tracker).filter(
            models.Tracker.user_id == user.id
        ).count()
        
        latest_tracker = db.query(models.Tracker).filter(
            models.Tracker.user_id == user.id
        ).order_by(models.Tracker.date.desc()).first()
        
        avg_data = db.query(
            func.avg(models.Tracker.sleep_hours),
            func.avg(models.Tracker.steps),
            func.avg(models.Tracker.mood_score)
        ).filter(models.Tracker.user_id == user.id).first()
        
        analytics_data.append({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "total_entries": trackers_count,
            "last_logged": str(latest_tracker.date) if latest_tracker else None,
            "avg_sleep": round(avg_data[0], 2) if avg_data[0] else 0,
            "avg_steps": round(avg_data[1], 0) if avg_data[1] else 0,
            "avg_mood": round(avg_data[2], 2) if avg_data[2] else 0
        })
    
    if redis_client:
        try:
            redis_client.setex(cache_key, 300, json.dumps(analytics_data))
        except:
            pass
    
    return {"data": analytics_data, "cached": False}
