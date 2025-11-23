from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, oauth2
from app.database import get_db
from app.config import GEMINI_API_KEY, REDIS_URL
import redis
from google import genai

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

# Redis Setup
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
except Exception:
    redis_client = None

# Gemini Flash 2.5 Model
if not GEMINI_API_KEY:
    raise Exception("GEMINI_API_KEY is missing")

genai_client = genai.Client(api_key=GEMINI_API_KEY)
AI_MODEL = "gemini-2.5-flash"

# AI Insight Generator
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

    insights = []
    if len(latest_trackers) > 1:
        avg_sleep = sum(t.sleep_hours or 0 for t in latest_trackers) / len(latest_trackers)
        avg_steps = sum(t.steps or 0 for t in latest_trackers) / len(latest_trackers)
        avg_stress = sum(t.stress_level or 0 for t in latest_trackers) / len(latest_trackers)

        if (latest.sleep_hours or 0) < avg_sleep - 1:
            insights.append(f"You're sleeping less than your weekly average ({avg_sleep:.1f} hrs). Try winding down earlier.")

        if (latest.steps or 0) < avg_steps * 0.7:
            insights.append("Your steps are lower than usual. Consider taking a light walk today.")

        if (latest.stress_level or 0) > avg_stress + 2:
            insights.append("Stress levels are higher than your average. Try some breathing exercises.")

        if (latest.mood_score or 0) < 5:
            insights.append("Your mood score seems low. Try a relaxing activity or talk to someone you trust.")

        insight_text = " ".join(insights) if insights else "You're maintaining consistent wellness habits!"
    else:
        insight_text = "Start logging daily to receive personalized insights."

    new_insight = models.AIInsight(
        user_id=current_user.id,
        insight_text=insight_text
    )
    db.add(new_insight)
    db.commit()
    db.refresh(new_insight)

    return {"insight": insight_text}

# CHAT WITH AI (Gemini Flash 2.5)
@router.post("/assistant", response_model=schemas.ChatResponse)
def chat_with_assistant(
    chat: schemas.ChatMessage,
    current_user: models.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db)
):
    cache_key = f"ai:chat:{current_user.id}:{hash(chat.message)}"

    if redis_client:
        cached = redis_client.get(cache_key)
        if cached:
            return {"response": cached, "cached": True}

    latest = (
        db.query(models.Tracker)
        .filter(models.Tracker.user_id == current_user.id)
        .order_by(models.Tracker.date.desc())
        .first()
    )

    context = ""
    if latest:
        context = (
            f"User's recent health data:\n"
            f"- Sleep: {latest.sleep_hours or 'N/A'} hrs\n"
            f"- Steps: {latest.steps or 'N/A'}\n"
            f"- Calories: {latest.calories or 'N/A'}\n"
            f"- Mood: {latest.mood_score or 'N/A'}/10\n"
            f"- Stress: {latest.stress_level or 'N/A'}/10\n"
        )

    try:
       
        response = genai_client.models.generate_content(
        model=AI_MODEL,
        contents=(
                    "You are a friendly and professional AI health assistant. "
                    "Always provide answers in a structured, readable plain text format. "
                    "Do not include any Markdown symbols like ** or #. "
                    "Do not write literal text such as 'Bold heading:' or 'Bold subheading:'. "
                    "Do not use bullet points or code blocks.\n\n"

                    "Structure the response like this:\n"
                    "1. Summary: One short paragraph (2-3 lines) summarizing the answer.\n"
                    "2. Key Details:\n"
                    "   Sleep: 1-3 sentences about sleep.\n"
                    "   Steps: 1-3 sentences about activity/steps.\n"
                    "   Mood: 1-3 sentences about mood.\n"
                    "   Stress: 1-3 sentences about stress.\n"
                    "   General Explanation: 1-3 sentences about overall health context.\n"
                    "3. Recommendation: Short, clear actionable advice.\n\n"

                    "Make headings visually distinct by capitalizing or writing on a separate line, "
                    "subheadings slightly indented or on their own line. Keep the tone supportive, positive, and easy to read.\n\n"

                    "User's recent wellness data:\n"
                    f"{context}\n\n"
                    f"User question: {chat.message}"
                )
            )

        ai_response = response.text

        new_insight = models.AIInsight(
            user_id=current_user.id,
            insight_text=f"Q: {chat.message}\nA: {ai_response}"
        )
        db.add(new_insight)
        db.commit()

        if redis_client:
            redis_client.setex(cache_key, 3600, ai_response)

        return {"response": ai_response, "cached": False}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with AI assistant: {str(e)}")


# Get Past AI Insights
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
