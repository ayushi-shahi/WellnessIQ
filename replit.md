# AI-Powered Health & Wellness Tracker

## Project Overview
A full-stack health and wellness tracking application with AI-powered insights, built with FastAPI (backend) and React (frontend).

## Architecture

### Backend (FastAPI)
- **Location**: `/app`
- **Entry Point**: `app/main.py`
- **Port**: 8000
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic
- **Caching**: Redis for analytics and AI responses
- **Authentication**: JWT with role-based access control

### Frontend (React + Vite)
- **Location**: `/frontend`
- **Entry Point**: `frontend/src/main.jsx`
- **Port**: 5000 (Webview)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion

## Database Schema
- **Users**: User accounts with RBAC (admin/user)
- **Trackers**: Daily health metrics (sleep, steps, calories, mood, stress)
- **Goals**: User wellness goals with progress tracking
- **AI Insights**: Stored AI-generated recommendations

## Key Features
1. **Authentication**: JWT-based auth with admin/user roles
2. **Health Tracking**: Daily logging of wellness metrics
3. **AI Insights**: OpenAI-powered personalized recommendations
4. **Analytics**: Redis-cached trend analysis with charts
5. **Wellness Scoring**: ML-based scoring using scikit-learn
6. **Admin Panel**: View all users' aggregated analytics

## Environment Setup

### Required Secrets
- `DATABASE_URL`: PostgreSQL connection string (already configured)
- `OPENAI_API_KEY`: OpenAI API key for AI assistant (needs to be added)
- `SESSION_SECRET`: JWT secret key (already configured)

### Python Dependencies
All installed via `requirements.txt` including:
- FastAPI, Uvicorn
- SQLAlchemy, Alembic, psycopg2-binary
- python-jose, passlib (auth)
- OpenAI, scikit-learn, pandas, numpy
- Redis, fastapi-cache2
- email-validator

### Frontend Dependencies
All installed via `package.json` including:
- React, React Router, React DOM
- Vite (build tool)
- Tailwind CSS, Autoprefixer, PostCSS
- Recharts (charts)
- Framer Motion (animations)
- Axios (HTTP client)
- React Toastify (notifications)

## Workflows

### Frontend Workflow
- **Name**: frontend
- **Command**: `cd frontend && npm run dev`
- **Port**: 5000 (Webview)
- **Status**: Running

## Docker Deployment
Complete Docker Compose setup available:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 8000)
- Frontend (port 5000)

Run with: `docker-compose up --build`

## API Documentation
Interactive API docs available at: http://localhost:8000/docs

## Database Migrations
- Create migration: `alembic revision --autogenerate -m "message"`
- Apply migrations: `alembic upgrade head`
- Rollback: `alembic downgrade -1`

## Project Status
✅ Backend API fully implemented with all routes
✅ Frontend React app with all pages and components
✅ PostgreSQL database with migrations
✅ JWT authentication with RBAC
✅ Redis caching for performance
✅ AI assistant integration (requires OPENAI_API_KEY)
✅ ML wellness scoring algorithm
✅ Docker deployment configuration
✅ Comprehensive documentation

## Next Steps for Users
1. Add OPENAI_API_KEY to secrets for AI features
2. Register first user account
3. Optionally promote first user to admin role via database
4. Start logging daily wellness data
5. Explore AI insights and analytics

## Development Notes
- Frontend runs on port 5000 (required for Replit webview)
- Backend runs on port 8000
- Frontend proxies API calls to backend via Vite config
- CORS enabled for frontend-backend communication
- All LSP warnings are type-checking only, not runtime errors
- Email validation requires `email-validator` package (installed)

## File Structure
```
/app                    # Backend FastAPI application
  /routers             # API route handlers
/frontend              # React frontend application
  /src
    /components        # Reusable React components
    /pages            # Page-level components
    /utils            # API utilities and helpers
/alembic              # Database migrations
docker-compose.yml    # Docker orchestration
requirements.txt      # Python dependencies
README.md            # User-facing documentation
```

## Recent Changes
- Initial project setup complete
- All backend routes implemented
- All frontend pages created
- Database migrations applied
- Frontend workflow configured
- Docker Compose setup
- Comprehensive README added
