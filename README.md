# Phase 2: Full-Stack Todo Web Application

A multi-user todo application built with Next.js, FastAPI, and PostgreSQL featuring JWT authentication and strict data isolation.

## Architecture

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with SQLModel, Python 3.11+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT-based with bcrypt password hashing

## Project Structure

```
├── backend/          # FastAPI backend application
│   ├── src/
│   │   ├── models/   # SQLModel database models
│   │   ├── services/ # Business logic layer
│   │   ├── api/      # FastAPI route handlers
│   │   └── core/     # Configuration, security, database
│   ├── tests/        # Backend tests
│   └── alembic/      # Database migrations
├── frontend/         # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/      # Utilities and API client
│   │   └── hooks/    # Custom React hooks
│   └── tests/        # Frontend tests
└── .env.example      # Environment configuration template
```

## Prerequisites

- Node.js 18.17.0+
- Python 3.11+
- PostgreSQL 15+ (or Docker)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e ".[dev]"

# Frontend setup
cd ../frontend
npm install
```

### 2. Database Setup

**Option A: Docker (Recommended)**
```bash
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

### 3. Configure Environment

Create `.env` file in the backend directory:
```bash
cp .env.example backend/.env
# Edit backend/.env with your configuration
```

Create `.env.local` file in the frontend directory:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
```

### 4. Run Database Migrations

```bash
cd backend
alembic upgrade head
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/health

## Development Workflow

### Running Tests

**Backend:**
```bash
cd backend
pytest tests/ -v
pytest tests/unit/          # Unit tests only
pytest tests/integration/   # Integration tests only
```

**Frontend:**
```bash
cd frontend
npm test                    # Jest unit tests
npm run test:e2e           # Playwright E2E tests
```

### Code Quality

**Backend:**
```bash
ruff check src/            # Linting
mypy src/                  # Type checking
```

**Frontend:**
```bash
npm run lint               # ESLint
npm run type-check         # TypeScript check
```

## Features

### Phase 2 (Current)

- ✅ User registration and authentication (JWT)
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Mark tasks as completed/incomplete
- ✅ Multi-user data isolation
- ✅ Responsive web UI
- ✅ Secure API endpoints

### Out of Scope

- Password reset functionality
- Email verification
- Social login (OAuth)
- Task categories, tags, or due dates
- Real-time collaboration
- Mobile native applications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT token

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get single task
- `PATCH /api/tasks/{id}` - Update task description or status
- `DELETE /api/tasks/{id}` - Delete task

## Security

- JWT tokens for stateless authentication
- Bcrypt password hashing (cost factor 12)
- Data isolation enforced at service layer
- Input validation via Pydantic models
- CORS configuration for frontend origin
- HTTPS required in production

## Contributing

This project follows Spec-Driven Development (SDD):
1. All features start with a specification
2. Architecture decisions are documented
3. Tasks are defined before implementation
4. Test-Driven Development (TDD) is mandatory

See `/specs/001-fullstack-todo-app/` for design documents.

## License

Proprietary - Hackathon Project
