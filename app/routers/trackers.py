from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(prefix="/trackers", tags=["Trackers"])

@router.post("/", response_model=schemas.TrackerResponse, status_code=status.HTTP_201_CREATED)
def create_tracker(
    tracker: schemas.TrackerCreate,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    existing_tracker = db.query(models.Tracker).filter(
        models.Tracker.user_id == current_user.id,
        models.Tracker.date == tracker.date
    ).first()
    
    if existing_tracker:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tracker entry already exists for this date"
        )
    
    new_tracker = models.Tracker(
        user_id=current_user.id,
        **tracker.model_dump()
    )
    
    db.add(new_tracker)
    db.commit()
    db.refresh(new_tracker)
    
    return new_tracker

@router.get("/", response_model=List[schemas.TrackerResponse])
def get_trackers(
    skip: int = 0,
    limit: int = 30,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    trackers = db.query(models.Tracker).filter(
        models.Tracker.user_id == current_user.id
    ).order_by(models.Tracker.date.desc()).offset(skip).limit(limit).all()
    
    return trackers

@router.get("/{tracker_id}", response_model=schemas.TrackerResponse)
def get_tracker(
    tracker_id: int,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    tracker = db.query(models.Tracker).filter(
        models.Tracker.id == tracker_id,
        models.Tracker.user_id == current_user.id
    ).first()
    
    if not tracker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracker not found"
        )
    
    return tracker

@router.put("/{tracker_id}", response_model=schemas.TrackerResponse)
def update_tracker(
    tracker_id: int,
    tracker_update: schemas.TrackerCreate,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    tracker = db.query(models.Tracker).filter(
        models.Tracker.id == tracker_id,
        models.Tracker.user_id == current_user.id
    ).first()
    
    if not tracker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracker not found"
        )
    
    for key, value in tracker_update.model_dump().items():
        setattr(tracker, key, value)
    
    db.commit()
    db.refresh(tracker)
    
    return tracker

@router.delete("/{tracker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tracker(
    tracker_id: int,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    tracker = db.query(models.Tracker).filter(
        models.Tracker.id == tracker_id,
        models.Tracker.user_id == current_user.id
    ).first()
    
    if not tracker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracker not found"
        )
    
    db.delete(tracker)
    db.commit()
    
    return None
