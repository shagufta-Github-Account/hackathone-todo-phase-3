# Quickstart Guide: Full-Stack Todo Web Application

**Feature**: Full-Stack Todo Web Application
**Date**: 2025-12-31
**Purpose**: Local development setup instructions

## Prerequisites

- **Node.js**: 18.17.0+ ([download](https://nodejs.org/))
- **Python**: 3.11+ ([download](https://www.python.org/downloads/))
- **PostgreSQL**: 15+ (or Docker for local DB)
- **Git**: Version control
- **Code Editor**: VS Code recommended

## Project Structure Overview

```
repo-root/
├── backend/          # FastAPI Python backend
├── frontend/         # Next.js TypeScript frontend
├── .env.example      # Environment variables template
└── README.md         # Project documentation
```

## Setup Instructions

### 1. Clone Repository & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd hackathone-2-phase-2

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 2. Database Setup

**Option A: Docker (Recommended)**

```bash
# Start PostgreSQL container
docker run --name todo-postgres \
  -e POSTGRES_USER=todoapp \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=todoapp_dev \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Local PostgreSQL**

```sql
CREATE DATABASE todoapp_dev;
CREATE USER todoapp WITH PASSWORD 'devpassword';
GRANT ALL PRIVILEGES ON DATABASE todoapp_dev TO todoapp;
```

### 3. Environment Configuration

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://todoapp:devpassword@localhost:5432/todoapp_dev
JWT_SECRET=your-secret-key-change-in-production-min-256-bits
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
CORS_ORIGINS=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Database Migrations

```bash
cd backend
alembic upgrade head
```

### 5. Run Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 6. Verify Installation

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/health

## Development Workflow

### Running Tests

**Backend**:
```bash
cd backend
pytest tests/ -v
pytest tests/unit/          # Unit tests only
pytest tests/integration/   # Integration tests only
```

**Frontend**:
```bash
cd frontend
npm test                    # Jest unit tests
npm run test:e2e           # Playwright E2E tests
```

### Code Quality

**Backend**:
```bash
ruff check src/            # Linting
mypy src/                  # Type checking
black src/                 # Code formatting
```

**Frontend**:
```bash
npm run lint               # ESLint
npm run type-check         # TypeScript check
npm run format             # Prettier
```

### Database Operations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Reset database
alembic downgrade base
alembic upgrade head
```

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Get Tasks

```bash
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <your-token>"
```

### Create Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"description":"Buy groceries"}'
```

## Troubleshooting

**Database connection error**:
- Verify PostgreSQL is running: `docker ps` or `pg_isready`
- Check `DATABASE_URL` in `.env`

**Frontend can't reach backend**:
- Verify backend is running on port 8000
- Check CORS configuration in `backend/src/main.py`
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

**JWT token errors**:
- Ensure `JWT_SECRET` is set in backend `.env`
- Check token expiration (24 hours default)
- Verify token format: `Bearer <token>`

**Port already in use**:
- Backend: Change `--port 8000` to different port
- Frontend: Change port in `package.json` dev script or set `PORT` env var

## Next Steps

After setup complete, proceed to implementation phase:
1. Run `/sp.tasks` to generate implementation tasks
2. Follow TDD workflow: Write tests → Implement → Refactor
3. Commit frequently with descriptive messages
