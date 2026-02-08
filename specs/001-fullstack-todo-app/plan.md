# Implementation Plan: Full-Stack Todo Web Application

**Branch**: `001-fullstack-todo-app` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fullstack-todo-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a multi-user todo web application with user authentication (JWT), task CRUD operations, and strict data isolation. Users can register, log in, create/view/update/delete tasks, and mark tasks as completed. Frontend uses Next.js with TypeScript and Tailwind CSS; backend uses FastAPI with SQLModel; database is Neon PostgreSQL. All code generated via spec-driven development following clean architecture principles.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x (strict mode)
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 14+ (App Router), React 18+, Tailwind CSS 3+, TypeScript 5+
- Backend: FastAPI 0.109+, SQLModel 0.0.14+, Pydantic 2.x, python-jose (JWT), passlib (password hashing)
- Database: Neon Serverless PostgreSQL (via asyncpg driver)

**Storage**: Neon Serverless PostgreSQL (managed cloud database)

**Testing**:
- Frontend: Jest, React Testing Library, Playwright (E2E)
- Backend: pytest, pytest-asyncio, httpx (API testing)

**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Project Type**: Web application (monorepo with frontend + backend)

**Performance Goals**:
- Task creation response time <2 seconds (per SC-002)
- Support 100+ concurrent users (per SC-007)
- Account registration <1 minute (per SC-001)
- API response time <500ms p95

**Constraints**:
- Responsive UI: 320px mobile to 1920px desktop (per SC-004)
- Data isolation: Zero-trust model, every query filters by user_id
- Security: HTTPS only, JWT validation on every protected endpoint
- Type safety: No `any` types, full TypeScript strict mode + Python type hints

**Scale/Scope**:
- Initial deployment: 100 concurrent users
- Database: PostgreSQL constraints (no explicit task limit per user)
- JWT token expiration: 24 hours
- No offline mode (requires network connectivity)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Spec-Driven Development (NON-NEGOTIABLE)
- [x] Feature specification complete (`specs/001-fullstack-todo-app/spec.md`)
- [x] This implementation plan documents architecture decisions
- [x] Tasks will be defined in `tasks.md` before code generation
- [x] No manual coding; all code generated from approved specs

**Status**: PASS - Spec-driven workflow followed

### ✅ II. Test-First Development (NON-NEGOTIABLE)
- [x] Test cases will be defined in `tasks.md` before implementation
- [x] TDD cycle: Red (write failing tests) → Green (implement) → Refactor
- [x] Coverage required for all business logic and API endpoints
- [x] User approval required before code generation

**Status**: PASS - TDD workflow will be enforced in tasks phase

### ✅ III. Clean Architecture
- [x] Clear separation: Frontend (presentation) ↔ Backend API (interface) ↔ Services (business logic) ↔ Models (data)
- [x] Dependencies point inward: Frontend → API contracts ← Services → Models
- [x] Business logic (task validation, user auth) is framework-agnostic
- [x] API contracts define interfaces between layers

**Status**: PASS - Architecture follows clean architecture principles

### ✅ IV. Multi-User Data Isolation (NON-NEGOTIABLE)
- [x] Every database query filters by `user_id` (enforced in service layer)
- [x] Task model includes `user_id` foreign key
- [x] API endpoints validate JWT and extract user context
- [x] Authorization checks before all mutations (create/update/delete)
- [x] Zero-trust model: no assumption of user context

**Status**: PASS - Data isolation enforced at every layer

### ✅ V. Full-Stack Type Safety
- [x] Frontend: TypeScript strict mode, no `any` types
- [x] Backend: Python type hints with SQLModel/Pydantic validation
- [x] Shared API contracts (OpenAPI schema) prevent drift
- [x] Runtime validation via Pydantic models
- [x] Compile-time validation via TypeScript

**Status**: PASS - Type safety maintained across stack

### ✅ VI. JWT-Based Authentication
- [x] Stateless JWT access tokens issued on login
- [x] JWT validation on all protected endpoints
- [x] Token expiration (24 hours)
- [x] Secure token storage (httpOnly cookies or localStorage with security considerations)
- [x] Better Auth compatibility patterns

**Status**: PASS - JWT authentication as specified

### Technology Stack Compliance
- [x] Frontend: Next.js App Router + Tailwind CSS + TypeScript ✅
- [x] Backend: FastAPI + SQLModel + Python 3.11+ ✅
- [x] Database: Neon Serverless PostgreSQL ✅
- [x] Authentication: JWT tokens ✅

**Status**: PASS - All technology choices comply with constitution

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-todo-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api.openapi.yaml # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Monorepo structure for web application

backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel
│   │   └── task.py          # Task SQLModel
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py  # Authentication logic (register, login, verify)
│   │   └── task_service.py  # Task CRUD business logic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py          # Auth endpoints (/register, /login, /logout)
│   │   ├── tasks.py         # Task endpoints (CRUD)
│   │   └── dependencies.py  # JWT validation, user context injection
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Environment config (DB_URL, JWT_SECRET)
│   │   ├── security.py      # Password hashing, JWT utilities
│   │   └── database.py      # Database connection, session management
│   └── main.py              # FastAPI app initialization, CORS, middleware
├── tests/
│   ├── contract/            # API contract tests (OpenAPI compliance)
│   ├── integration/         # End-to-end API tests
│   └── unit/                # Service and utility tests
├── alembic/                 # Database migrations
│   └── versions/
├── pyproject.toml           # Python dependencies (Poetry or pip)
└── pytest.ini               # Pytest configuration

frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing/login page
│   │   ├── register/
│   │   │   └── page.tsx     # Registration page
│   │   ├── dashboard/
│   │   │   └── page.tsx     # Task dashboard (protected)
│   │   └── api/             # API routes (if needed for server actions)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── CreateTaskForm.tsx
│   │   │   └── EditTaskModal.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── api.ts           # API client (fetch wrapper)
│   │   ├── auth.ts          # Auth utilities (token storage, validation)
│   │   └── types.ts         # TypeScript types (User, Task, API responses)
│   └── hooks/
│       ├── useAuth.ts       # Authentication hook
│       └── useTasks.ts      # Task management hook
├── public/                  # Static assets
├── tests/
│   ├── e2e/                 # Playwright E2E tests
│   └── unit/                # Jest component tests
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript strict configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── next.config.js           # Next.js configuration (API proxy, env vars)

# Shared configuration
.env.example                 # Environment variables template
.env.local                   # Local environment (gitignored)
docker-compose.yml           # Optional: local PostgreSQL for development
README.md                    # Project documentation
```

**Structure Decision**:

We selected **Option 2: Web application** structure because:
1. Clear frontend/backend separation required by spec (FR-016, security considerations)
2. Independent deployment possible (frontend static site, backend serverless)
3. Different language ecosystems (TypeScript vs Python)
4. Separate test suites and tooling
5. CORS configuration required → implies separate origins

The monorepo approach keeps both codebases versioned together while maintaining clean separation. Backend handles all business logic and database access; frontend is purely presentational with API calls.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitutional requirements satisfied:
- Spec-driven development: ✅
- Test-first: ✅
- Clean architecture: ✅
- Data isolation: ✅
- Type safety: ✅
- JWT authentication: ✅
- Technology stack compliance: ✅

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend (TypeScript + Tailwind CSS)              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Auth Pages   │  │  Dashboard   │  │ Components   │    │ │
│  │  │ (Login/Reg)  │  │  (Tasks)     │  │ (TaskList)   │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │           │                │                  │            │ │
│  │           └────────────────┴──────────────────┘            │ │
│  │                            ↓                                │ │
│  │                  API Client (fetch + JWT)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS + CORS
                                │ JWT in Authorization header
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python + SQLModel)                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Layer (FastAPI Routes)                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Auth API     │  │  Tasks API   │  │ Dependencies │    │ │
│  │  │ /register    │  │  /tasks      │  │ (JWT verify) │    │ │
│  │  │ /login       │  │  /tasks/{id} │  │              │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │           │                │                  ↓            │ │
│  │           └────────────────┴──────────────────┘            │ │
│  │                            ↓                                │ │
│  │  Service Layer (Business Logic - Framework Agnostic)       │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │ AuthService  │  │ TaskService  │                       │ │
│  │  │ (hash, JWT)  │  │ (CRUD + ACL) │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  │           │                │                                │ │
│  │           └────────────────┴────────────────┐              │ │
│  │                            ↓                 ↓              │ │
│  │  Data Access Layer (SQLModel ORM)                          │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │ User Model   │  │  Task Model  │                       │ │
│  │  │ (email, pwd) │  │ (desc, user) │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │ asyncpg driver
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│            Neon Serverless PostgreSQL Database                   │
│  ┌────────────────────┐      ┌────────────────────┐            │
│  │  users table       │      │  tasks table       │            │
│  │  - id (PK)         │◄─────┤  - id (PK)         │            │
│  │  - email (unique)  │ 1:N  │  - user_id (FK)    │            │
│  │  - password_hash   │      │  - description     │            │
│  │  - created_at      │      │  - is_completed    │            │
│  └────────────────────┘      │  - created_at      │            │
│                               └────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Examples

**1. User Registration Flow:**
```
User → Frontend Form → POST /api/auth/register
                        ↓
            AuthService.register(email, password)
                        ↓
            - Validate email format & password strength
            - Hash password (bcrypt)
            - Create User model
            - Save to DB
                        ↓
            Return 201 Created + user data (no password)
                        ↓
            Frontend → Redirect to login
```

**2. User Login Flow:**
```
User → Frontend Form → POST /api/auth/login
                        ↓
            AuthService.login(email, password)
                        ↓
            - Lookup user by email
            - Verify password hash
            - Generate JWT token (user_id, exp)
            - Sign with JWT_SECRET
                        ↓
            Return 200 OK + {access_token, token_type: "bearer"}
                        ↓
            Frontend → Store token → Redirect to dashboard
```

**3. Create Task Flow (Authenticated):**
```
User → Frontend Form → POST /api/tasks
                       Authorization: Bearer <JWT>
                        ↓
            JWT Dependency: Verify token → Extract user_id
                        ↓
            TaskService.create(user_id, description)
                        ↓
            - Validate description (not empty)
            - Create Task model (user_id, description, is_completed=False)
            - Save to DB
                        ↓
            Return 201 Created + task data
                        ↓
            Frontend → Add task to UI list
```

**4. Get User Tasks Flow (Authenticated):**
```
User → Dashboard Load → GET /api/tasks
                        Authorization: Bearer <JWT>
                        ↓
            JWT Dependency: Verify token → Extract user_id
                        ↓
            TaskService.get_user_tasks(user_id)
                        ↓
            - Query: SELECT * FROM tasks WHERE user_id = ?
            - Return list of Task models
                        ↓
            Return 200 OK + [{task1}, {task2}, ...]
                        ↓
            Frontend → Render TaskList component
```

### Frontend Responsibilities

1. **Presentation Layer:**
   - Render UI components (forms, lists, modals)
   - Handle user interactions (clicks, form submissions)
   - Display loading states and error messages
   - Responsive layout (Tailwind CSS utilities)

2. **Client-Side State Management:**
   - Store JWT token (localStorage or httpOnly cookie)
   - Manage authentication state (logged in/out)
   - Cache task list in component state
   - Optimistic UI updates (add task before API confirmation)

3. **API Communication:**
   - Make HTTP requests to backend (fetch API)
   - Attach JWT to Authorization header
   - Handle API responses and errors
   - Parse JSON responses into TypeScript types

4. **Client-Side Validation:**
   - Form validation (email format, password strength, required fields)
   - Show validation errors before API call
   - Sanitize user input (XSS prevention)

5. **Routing & Navigation:**
   - Next.js App Router for page navigation
   - Protected routes (redirect to login if no token)
   - Handle authentication redirects

### Backend Responsibilities

1. **API Layer (FastAPI Routes):**
   - Define REST endpoints (auth, tasks)
   - Parse request bodies (Pydantic models)
   - Validate JWT tokens (dependencies)
   - Return standardized responses (status codes, JSON)

2. **Business Logic (Service Layer):**
   - **AuthService:**
     - Register: validate email, hash password, create user
     - Login: verify credentials, generate JWT
     - Password hashing (bcrypt via passlib)
     - JWT generation/validation (python-jose)
   - **TaskService:**
     - Create: validate description, enforce user ownership
     - Read: filter by user_id, return only user's tasks
     - Update: validate ownership, update description or status
     - Delete: validate ownership, remove from DB

3. **Data Access (SQLModel ORM):**
   - Define database models (User, Task)
   - Execute queries with user_id filters
   - Handle database sessions (async context managers)
   - Enforce foreign key relationships

4. **Security:**
   - Password hashing (bcrypt with salt)
   - JWT signing and verification
   - Authorization checks (user owns resource)
   - Input sanitization (Pydantic validation)
   - CORS configuration (allow frontend origin)

5. **Error Handling:**
   - Catch exceptions (database errors, validation failures)
   - Return appropriate HTTP status codes (400, 401, 403, 404, 500)
   - Log errors (without exposing sensitive data)
   - Provide user-friendly error messages

### Authentication Flow (JWT)

**Registration:**
1. User submits email + password → Frontend POST /api/auth/register
2. Backend validates email format and password strength
3. Backend hashes password with bcrypt (cost factor 12)
4. Backend saves User(email, password_hash, created_at) to DB
5. Backend returns 201 Created with user data (no password)
6. Frontend redirects to login page

**Login:**
1. User submits email + password → Frontend POST /api/auth/login
2. Backend looks up user by email
3. Backend verifies password against stored hash
4. Backend generates JWT:
   ```python
   payload = {
       "sub": user.id,  # Subject: user ID
       "exp": datetime.utcnow() + timedelta(hours=24)  # Expiration
   }
   token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
   ```
5. Backend returns 200 OK with `{access_token: "...", token_type: "bearer"}`
6. Frontend stores token in localStorage (or httpOnly cookie via backend)
7. Frontend redirects to dashboard

**Authenticated Requests:**
1. Frontend attaches JWT to every API call:
   ```javascript
   headers: {
       "Authorization": `Bearer ${token}`
   }
   ```
2. Backend dependency extracts token from Authorization header
3. Backend verifies JWT signature with JWT_SECRET
4. Backend checks expiration (reject if expired)
5. Backend extracts user_id from `sub` claim
6. Backend injects user_id into route handler
7. Route handler uses user_id for authorization checks

**Logout:**
1. Frontend deletes token from localStorage
2. Frontend redirects to login page
3. (Optional) Backend can maintain token blacklist for revocation

**Token Refresh (Out of Scope for Phase 2):**
- JWT expiration is 24 hours
- User must re-login after expiration
- Future: implement refresh tokens for seamless re-authentication

### Database Schema Overview

**users table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**tasks table:**
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);
```

**Key Design Decisions:**
- `user_id` foreign key with `ON DELETE CASCADE` (delete user → delete all their tasks)
- Indexes on `users.email` (for login lookups) and `tasks.user_id` (for filtered queries)
- Composite index on `(user_id, is_completed)` for filtering completed/incomplete tasks
- `updated_at` timestamp for tracking task modifications
- `description` as TEXT (no length limit, but frontend can enforce reasonable max)

## Technology Justification

### Frontend: Next.js + TypeScript + Tailwind CSS

**Why Next.js:**
- Constitution mandates Next.js with App Router
- Server-side rendering (SSR) for better SEO and initial load performance
- App Router provides file-based routing (intuitive structure)
- Built-in API routes (if needed for server actions)
- Excellent TypeScript support

**Why TypeScript:**
- Constitution mandates TypeScript strict mode
- Catch type errors at compile time (reduces runtime bugs)
- IntelliSense and autocomplete improve developer experience
- Enforces API contract adherence (frontend-backend type safety)

**Why Tailwind CSS:**
- Constitution mandates Tailwind CSS
- Utility-first approach enables rapid UI development
- Responsive design utilities (mobile-first breakpoints)
- No CSS naming conflicts (scoped by default)
- Tree-shaking removes unused styles (smaller bundle)

### Backend: FastAPI + SQLModel + Python 3.11+

**Why FastAPI:**
- Constitution mandates FastAPI
- High performance (async/await, ASGI server)
- Automatic OpenAPI documentation generation (supports API contracts)
- Pydantic integration for request/response validation
- Type hints enable editor support and runtime validation

**Why SQLModel:**
- Constitution mandates SQLModel
- Combines SQLAlchemy (ORM) + Pydantic (validation)
- Single model definition for DB and API (DRY principle)
- Type hints ensure type safety across data layer
- AsyncIO support for non-blocking database queries

**Why Python 3.11+:**
- Constitution mandates Python 3.11+
- Improved performance (10-60% faster than 3.10)
- Better error messages (enhanced tracebacks)
- Type hint improvements (PEP 673, 675, 681)
- asyncio performance enhancements

### Database: Neon Serverless PostgreSQL

**Why Neon:**
- Constitution mandates Neon Serverless PostgreSQL
- Serverless auto-scaling (pay for usage, not idle time)
- Instant database branching (dev/staging/prod isolation)
- Built-in connection pooling (handles concurrent connections)
- PostgreSQL compatibility (mature ecosystem)

**Why PostgreSQL:**
- ACID transactions (data integrity for user accounts and tasks)
- Foreign key constraints enforce referential integrity
- Mature, battle-tested, widely adopted
- Rich indexing support (B-tree, GiST, GIN)
- JSON support if future features need flexible schemas

### Authentication: JWT

**Why JWT:**
- Constitution mandates JWT-based authentication
- Stateless (no server-side session storage)
- Scalable (backend can be horizontally scaled without shared state)
- Cross-domain support (frontend and backend on different origins)
- Industry standard (python-jose, many frontend libraries)

**Why Not Session Cookies:**
- Session cookies require server-side storage (Redis/DB)
- Harder to scale horizontally
- Tighter coupling between frontend and backend

## Next Steps

This plan will proceed to:
1. **Phase 0**: Generate `research.md` (resolve any remaining technical questions)
2. **Phase 1**:
   - Generate `data-model.md` (detailed entity definitions)
   - Generate `contracts/api.openapi.yaml` (OpenAPI specification)
   - Generate `quickstart.md` (development setup instructions)
   - Update agent context with technology stack

After Phase 1 completion, run `/sp.tasks` to generate implementation tasks.
