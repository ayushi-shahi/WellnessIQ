from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db
import os
import redis
from openai import OpenAI

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

# --------------------------
# Redis setup (optional)
# --------------------------
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
try:
    redis_client = redis.from_url(redis_url, decode_responses=True)
except Exception:
    redis_client = None

# --------------------------
# OpenAI client setup
# --------------------------
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    os.environ["OPENAI_API_KEY"] = openai_api_key
    client = OpenAI(api_key=openai_api_key)
else:
    client = None

# --------------------------
# Generate AI Insights
# --------------------------
@router.post("/insight")
def generate_insight(
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    latest_trackers = (
        db.query(models.Tracker)
        .filter(models.Tracker.user_id == current_user.id)
        .order_by(models.Tracker.date.desc())
        .limit(7)
        .all()
    )

    if not latest_trackers:
        raise HTTPException(
            status_code=404,
            detail="No tracker data found. Please log your wellness data first."
        )

    latest = latest_trackers[0]

    if len(latest_trackers) > 1:
        avg_sleep = sum(t.sleep_hours or 0 for t in latest_trackers) / len(latest_trackers)
        avg_steps = sum(t.steps or 0 for t in latest_trackers) / len(latest_trackers)
        avg_stress = sum(t.stress_level or 0 for t in latest_trackers) / len(latest_trackers)

        insights = []

        if (latest.sleep_hours or 0) < avg_sleep - 1:
            insights.append(f"You're sleeping less than your weekly average ({avg_sleep:.1f} hours). Try winding down earlier.")

        if (latest.steps or 0) < avg_steps * 0.7:
            insights.append(f"Your step count is lower than usual. Consider a light walk to boost activity.")

        if (latest.stress_level or 0) > avg_stress + 2 and (latest.steps or 0) < avg_steps:
            insights.append("Your stress is correlating with fewer steps — consider a light walk to reduce stress.")

        if (latest.mood_score or 0) < 5 and (latest.sleep_hours or 0) < 7:
            insights.append("Low mood may be related to insufficient sleep. Aim for 7-9 hours tonight.")

        insight_text = " ".join(insights) if insights else "You're maintaining consistent wellness habits. Keep it up!"
    else:
        insight_text = "Start logging daily to receive personalized insights based on your trends."

    new_insight = models.AIInsight(
        user_id=current_user.id,
        insight_text=insight_text
    )
    db.add(new_insight)
    db.commit()
    db.refresh(new_insight)

    return {"insight": insight_text}


# --------------------------
# Chat with AI assistant
# --------------------------
@router.post("/assistant", response_model=schemas.ChatResponse)
def chat_with_assistant(
    chat: schemas.ChatMessage,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    cache_key = f"ai:chat:{current_user.id}:{hash(chat.message)}"

    # Check Redis cache
    if redis_client:
        try:
            cached_response = redis_client.get(cache_key)
            if cached_response:
                return {"response": cached_response, "cached": True}
        except Exception:
            pass

    # If OpenAI not configured
    if not client:
        return {
            "response": "AI assistant is not configured. Please add your OPENAI_API_KEY to enable this feature.",
            "cached": False
        }

    # Include recent health data for context
    latest_trackers = (
        db.query(models.Tracker)
        .filter(models.Tracker.user_id == current_user.id)
        .order_by(models.Tracker.date.desc())
        .limit(7)
        .all()
    )

    context = ""
    if latest_trackers:
        latest = latest_trackers[0]
        context = (
            f"\n\nUser's recent health data: "
            f"Sleep: {latest.sleep_hours or 'N/A'} hours, "
            f"Steps: {latest.steps or 'N/A'}, "
            f"Calories: {latest.calories or 'N/A'}, "
            f"Mood: {latest.mood_score or 'N/A'}/10, "
            f"Stress: {latest.stress_level or 'N/A'}/10."
        )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"You are a helpful health and wellness assistant. Provide personalized advice based on user's health data. Be supportive, motivating, and evidence-based.{context}"
                },
                {"role": "user", "content": chat.message}
            ],
            max_tokens=500,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content

        # Save AI insight
        new_insight = models.AIInsight(
            user_id=current_user.id,
            insight_text=f"Q: {chat.message}\nA: {ai_response}"
        )
        db.add(new_insight)
        db.commit()

        # Cache in Redis
        if redis_client:
            try:
                redis_client.setex(cache_key, 3600, ai_response)
            except Exception:
                pass

        return {"response": ai_response, "cached": False}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with AI assistant: {str(e)}"
        )


# --------------------------
# Get past AI insights
# --------------------------
@router.get("/insights", response_model=list[schemas.AIInsightResponse])
def get_insights(
    limit: int = 10,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    insights = (
        db.query(models.AIInsight)
        .filter(models.AIInsight.user_id == current_user.id)
        .order_by(models.AIInsight.generated_at.desc())
        .limit(limit)
        .all()
    )
    return insights
