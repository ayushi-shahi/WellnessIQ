# AI-Powered Health & Wellness Tracker

A comprehensive full-stack application for tracking physical and mental wellness with AI-powered insights and recommendations.

## Features

### Core Functionality
- **User Authentication**: JWT-based authentication with role-based access control (Admin/User)
- **Health Tracking**: Daily tracking of sleep, steps, calories, mood, and stress levels
- **Goal Management**: Set and monitor wellness goals with progress tracking
- **AI Insights**: Personalized health recommendations using Gemini 
- **Analytics Dashboard**: Interactive charts and visualizations with Recharts
- **Admin Panel**: View all users' aggregated health data and analytics

### Technical Features
- **Redis Caching**: Performance optimization for analytics and AI responses
- **ML Wellness Score**: Scikit-learn-based wellness scoring algorithm
- **Database Migrations**: Alembic for schema management
- **Docker Support**: Complete containerized deployment setup
- **PostgreSQL Database**: Robust data persistence

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT with OAuth2PasswordBearer
- **Caching**: Redis
- **AI**: Gemini API
- **ML**: Scikit-learn, Pandas, NumPy
- **Migrations**: Alembic

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Build Tool**: Vite

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd health-wellness-tracker
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env and add your DATABASE_URL, GEMINI_API_KEY, and SECRET_KEY
```

3. **Install backend dependencies**
```bash
pip install -r requirements.txt
```

4. **Run database migrations**
```bash
alembic upgrade head
```

5. **Start the backend**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

6. **Install frontend dependencies**
```bash
cd frontend
npm install
```

7. **Start the frontend**
```bash
npm run dev
```

8. **Access the application**
- Frontend: http://localhost:5000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Docker Deployment

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Backend API (port 8000)
- Frontend (port 5000)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/` - Get all users (Admin only)
- `GET /users/{id}` - Get user by ID (Admin only)

### Trackers
- `POST /trackers/` - Create tracker entry
- `GET /trackers/` - Get user's tracker entries
- `GET /trackers/{id}` - Get specific tracker entry
- `PUT /trackers/{id}` - Update tracker entry
- `DELETE /trackers/{id}` - Delete tracker entry

### Goals
- `POST /goals/` - Create goal
- `GET /goals/` - Get user's goals
- `GET /goals/{id}` - Get specific goal
- `PUT /goals/{id}` - Update goal
- `DELETE /goals/{id}` - Delete goal

### Analytics
- `GET /analytics/progress?days=30` - Get progress trends
- `GET /analytics/wellness-score` - Get wellness score and recommendations
- `GET /analytics/admin/all-users` - Get all users analytics (Admin only)

### AI Assistant
- `POST /ai/insight` - Generate AI insights
- `POST /ai/assistant` - Chat with AI assistant
- `GET /ai/insights?limit=10` - Get past insights

## Database Schema

### Users Table
- id, name, email, password_hash
- age, gender, height, weight, activity_level
- role (admin/user), created_at

### Trackers Table
- id, user_id, date
- steps, calories, sleep_hours
- mood_score, stress_level
- created_at

### Goals Table
- id, user_id, goal_type
- target_value, current_value
- deadline, created_at

### AI Insights Table
- id, user_id, insight_text
- generated_at

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/wellness_db
GEMINI_API_KEY=your-gemini-api-key
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REDIS_URL=redis://localhost:6379
```

## Project Structure

```
.
├── app/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── oauth2.py            # JWT authentication
│   ├── utils.py             # Utility functions
│   └── routers/
│       ├── auth.py          # Authentication routes
│       ├── users.py         # User management routes
│       ├── trackers.py      # Tracker routes
│       ├── goals.py         # Goal routes
│       ├── analytics.py     # Analytics routes
│       └── ai_assistant.py  # AI assistant routes
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # API utilities
│   │   └── styles/          # CSS styles
│   ├── package.json
│   └── vite.config.js
├── alembic/                 # Database migrations
├── docker-compose.yml       # Docker configuration
├── requirements.txt         # Python dependencies
└── README.md
```

## Features Roadmap

### Completed ✅
- User authentication with RBAC
- Daily health tracking
- Goal setting and tracking
- AI-powered insights
- Analytics dashboard
- Admin panel
- Redis caching
- Docker deployment

### Future Enhancements
- Mood prediction ML model
- Email/push notifications
- Data export (PDF/CSV)
- Dark theme toggle
- Mobile app
- Social features

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
