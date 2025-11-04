from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, users, trackers, goals, analytics, ai_assistant

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Powered Health & Wellness Tracker",
    description="Track your physical and mental wellness with AI insights",
    version="1.0.0"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trackers.router)
app.include_router(goals.router)
app.include_router(analytics.router)
app.include_router(ai_assistant.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to AI-Powered Health & Wellness Tracker API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
