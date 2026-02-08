# Research: Full-Stack Todo Web Application

**Feature**: Full-Stack Todo Web Application
**Date**: 2025-12-31
**Purpose**: Document architecture decisions, technology choices, and implementation patterns

## Overview

This document consolidates research findings and justification for technical decisions made during implementation planning. All decisions are aligned with the project constitution and feature specification requirements.

## Technology Stack Research

### Frontend Framework: Next.js 14+ with App Router

**Decision**: Use Next.js 14+ with App Router

**Rationale**:
- **Constitutional requirement**: Mandated by project constitution
- **App Router benefits**:
  - React Server Components enable better performance
  - File-based routing simplifies project structure
  - Built-in loading and error states
  - Native support for data fetching patterns
- **SEO and performance**: Server-side rendering improves initial load time and search engine visibility
- **TypeScript integration**: First-class TypeScript support with strict mode compatibility
- **Developer experience**: Hot module replacement, fast refresh, excellent documentation

**Alternatives considered**:
- Create React App: Deprecated, lacks SSR capabilities
- Vite + React: Excellent build performance but lacks SSR and routing conventions
- Remix: Strong SSR but smaller ecosystem and less corporate backing

**Implementation notes**:
- Use App Router (`app/` directory) not Pages Router (`pages/`)
- Leverage Server Components for static content (landing page, layout)
- Use Client Components (`'use client'`) for interactive elements (forms, task list)
- Configure TypeScript strict mode in `tsconfig.json`

### Styling: Tailwind CSS 3+

**Decision**: Use Tailwind CSS 3+ for styling

**Rationale**:
- **Constitutional requirement**: Mandated by project constitution
- **Utility-first approach**: Rapid development without context switching between files
- **Responsive design**: Mobile-first breakpoints (sm, md, lg, xl) match spec requirement (320px-1920px)
- **Performance**: PurgeCSS removes unused styles in production
- **Consistency**: Design tokens enforce consistent spacing, colors, typography
- **No naming conflicts**: Utility classes eliminate CSS specificity issues

**Alternatives considered**:
- CSS Modules: More verbose, manual responsive design
- Styled Components: Runtime overhead, larger bundle size
- Plain CSS: Scalability issues, naming conflicts

**Implementation notes**:
- Configure Tailwind in `tailwind.config.ts`
- Use JIT mode for development (instant compilation)
- Define custom colors in config for brand consistency
- Use `@layer` directives for custom utilities if needed

### Backend Framework: FastAPI 0.109+

**Decision**: Use FastAPI 0.109+ for backend API

**Rationale**:
- **Constitutional requirement**: Mandated by project constitution
- **Performance**: ASGI framework with async/await support (handles concurrent requests efficiently)
- **Automatic OpenAPI docs**: Generates interactive API documentation at `/docs` and `/redoc`
- **Pydantic validation**: Request/response validation with type hints (runtime safety)
- **Type safety**: Excellent type hint support enables IDE autocomplete and static analysis
- **Modern Python**: Leverages Python 3.11+ features (performance, improved async)

**Alternatives considered**:
- Django REST Framework: Heavier, ORM coupling, less async support
- Flask: Requires manual wiring for validation, docs, async
- Express.js: Different language (JavaScript), less type safety

**Implementation notes**:
- Use `async def` for all route handlers (non-blocking)
- Define Pydantic models for request bodies and responses
- Use dependency injection for database sessions and auth
- Configure CORS middleware for frontend origin

### ORM: SQLModel 0.0.14+

**Decision**: Use SQLModel 0.0.14+ for database ORM

**Rationale**:
- **Constitutional requirement**: Mandated by project constitution
- **Unified models**: Single class definition for DB schema and API validation (DRY principle)
- **Type safety**: Combines SQLAlchemy (ORM) + Pydantic (validation) with full type hints
- **AsyncIO support**: Compatible with FastAPI's async patterns
- **Developer experience**: Less boilerplate than separate SQLAlchemy + Pydantic models

**Alternatives considered**:
- SQLAlchemy alone: Requires duplicate Pydantic models for API validation
- Tortoise ORM: Smaller ecosystem, less mature
- Raw SQL: No type safety, more boilerplate, migration complexity

**Implementation notes**:
- Define models inheriting from `SQLModel`
- Use `Field()` for column constraints and validation
- Leverage `Relationship()` for foreign keys
- Use async sessions (`AsyncSession`) for database operations

### Database: Neon Serverless PostgreSQL

**Decision**: Use Neon Serverless PostgreSQL

**Rationale**:
- **Constitutional requirement**: Mandated by project constitution
- **Serverless scaling**: Auto-scales based on load (cost-efficient, no manual provisioning)
- **Instant branching**: Create dev/staging/prod database branches from main (isolated testing)
- **Connection pooling**: Built-in pooling handles concurrent connections
- **PostgreSQL compatibility**: Full Postgres feature set (ACID, foreign keys, indexes, JSON)
- **Developer experience**: Web console, connection string management, metrics

**Alternatives considered**:
- Traditional PostgreSQL (AWS RDS, DigitalOcean): Manual scaling, higher maintenance
- MySQL: Less feature-rich (limited JSON support, weaker constraint enforcement)
- MongoDB: NoSQL doesn't fit relational data model (users → tasks)

**Implementation notes**:
- Use `asyncpg` driver for async connections
- Store `DATABASE_URL` in environment variables
- Create database branches for feature development
- Use Alembic for schema migrations

## Authentication Research

### JWT-Based Authentication

**Decision**: Use JWT (JSON Web Tokens) for stateless authentication

**Rationale**:
- **Constitutional requirement**: Mandated by project constitution
- **Stateless**: No server-side session storage (backend horizontally scalable)
- **Cross-origin support**: Frontend and backend can be on different domains
- **Standard protocol**: Industry-standard with mature libraries (`python-jose`, `jose` JS library)
- **Payload flexibility**: Can encode user_id, roles, expiration in token

**Alternatives considered**:
- Session cookies: Requires server-side storage (Redis/DB), harder to scale
- OAuth2: Over-engineered for simple email/password auth (out of scope per spec)

**Implementation patterns**:

**Token structure**:
```json
{
  "sub": "user_id_123",
  "exp": 1735689600,
  "iat": 1735603200
}
```

**Backend (Python)**:
```python
from jose import jwt
from datetime import datetime, timedelta

# Generate token
payload = {
    "sub": str(user.id),
    "exp": datetime.utcnow() + timedelta(hours=24)
}
token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# Verify token
payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
user_id = payload["sub"]
```

**Frontend (TypeScript)**:
```typescript
// Store token
localStorage.setItem('token', accessToken);

// Attach to requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Remove on logout
localStorage.removeItem('token');
```

**Security considerations**:
- Use strong `JWT_SECRET` (256+ bit entropy)
- Set reasonable expiration (24 hours per spec assumption)
- Use HTTPS only (prevent token interception)
- Validate token signature on every protected endpoint
- Consider httpOnly cookies for XSS protection (trade-off: more complex CORS)

### Password Hashing

**Decision**: Use bcrypt via `passlib` for password hashing

**Rationale**:
- **Spec requirement**: FR-002 requires secure password storage
- **Adaptive cost**: Configurable work factor (cost) can increase over time
- **Salt included**: Built-in salt prevents rainbow table attacks
- **Industry standard**: Widely adopted, battle-tested

**Alternatives considered**:
- Argon2: Newer, more resistant to hardware attacks (but less widely deployed)
- PBKDF2: Acceptable but slower than bcrypt at equivalent security
- scrypt: Good but less library support

**Implementation**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
hashed = pwd_context.hash(plain_password)

# Verify password
is_valid = pwd_context.verify(plain_password, hashed)
```

**Parameters**:
- Cost factor: 12 (good balance between security and performance)
- Automatic salt generation (handled by passlib)

## Architecture Patterns Research

### Clean Architecture Implementation

**Decision**: Implement clean architecture with clear layer separation

**Rationale**:
- **Constitutional requirement**: Constitution mandates clean architecture
- **Testability**: Business logic can be tested without framework dependencies
- **Maintainability**: Changes in one layer don't ripple to others
- **Flexibility**: Can swap frameworks or databases with minimal impact

**Layer structure**:

1. **Presentation Layer (Frontend)**:
   - Next.js components, pages, hooks
   - Depends on: API contracts (types, endpoints)
   - No knowledge of backend implementation

2. **API Layer (Backend routes)**:
   - FastAPI routes in `src/api/`
   - Depends on: Service layer
   - Responsibilities: HTTP handling, JWT validation, request/response serialization

3. **Service Layer (Business logic)**:
   - Services in `src/services/`
   - Depends on: Data models
   - Responsibilities: Validation, authorization, business rules
   - Framework-agnostic (pure Python functions)

4. **Data Layer (Models + Database)**:
   - SQLModel models in `src/models/`
   - Depends on: Nothing (innermost layer)
   - Responsibilities: Schema definition, database access

**Dependency flow**: Frontend → API → Services → Models → Database

**Key principles**:
- Outer layers depend on inner layers (never reverse)
- Business logic (services) has no FastAPI imports
- Models define contracts between layers

### Data Isolation Strategy

**Decision**: Enforce user_id filtering at service layer with zero-trust model

**Rationale**:
- **Constitutional requirement**: Constitution mandates strict data isolation (NON-NEGOTIABLE)
- **Defense in depth**: Multiple layers of protection
- **Zero-trust**: Never assume user context is valid

**Implementation layers**:

1. **Database schema**: Foreign key `user_id` on tasks table
   ```sql
   tasks.user_id REFERENCES users(id)
   ```

2. **Service layer**: All queries filter by user_id
   ```python
   def get_user_tasks(db: Session, user_id: int):
       return db.query(Task).filter(Task.user_id == user_id).all()
   ```

3. **API layer**: JWT dependency extracts and injects user_id
   ```python
   async def get_current_user(token: str = Depends(oauth2_scheme)):
       payload = jwt.decode(token, JWT_SECRET)
       user_id = payload["sub"]
       return user_id
   ```

4. **Authorization checks**: Validate ownership before mutations
   ```python
   def update_task(db: Session, task_id: int, user_id: int, data: dict):
       task = db.query(Task).filter(Task.id == task_id).first()
       if task.user_id != user_id:
           raise ForbiddenError("Not authorized")
       # ... update task
   ```

**Test coverage**:
- Unit tests: Verify service layer filters by user_id
- Integration tests: Attempt to access other users' tasks (should fail)
- E2E tests: Two users simultaneously, verify isolation

## API Design Research

### REST API Conventions

**Decision**: Follow RESTful principles with standard HTTP methods and status codes

**Rationale**:
- **Familiarity**: Industry-standard patterns reduce learning curve
- **Tooling**: Many tools support REST (OpenAPI generators, Postman, etc.)
- **Predictability**: Consistent conventions across all endpoints

**Endpoint patterns**:

```
POST   /api/auth/register      - Create new user account
POST   /api/auth/login         - Authenticate and receive token
POST   /api/auth/logout        - (Optional) Invalidate token

GET    /api/tasks              - Get all tasks for authenticated user
POST   /api/tasks              - Create new task
GET    /api/tasks/{id}         - Get single task (validate ownership)
PATCH  /api/tasks/{id}         - Update task (description or is_completed)
DELETE /api/tasks/{id}         - Delete task (validate ownership)
```

**HTTP status codes**:
- 200 OK: Successful GET/PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 400 Bad Request: Validation errors
- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Valid token but insufficient permissions
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Unexpected server error

**Response format**:
```json
// Success (200, 201)
{
  "id": 123,
  "description": "Buy groceries",
  "is_completed": false,
  "created_at": "2025-12-31T12:00:00Z"
}

// Error (400, 401, 403, 404)
{
  "detail": "Task not found"
}
```

### API Versioning

**Decision**: No explicit versioning for initial release (v1 implicit)

**Rationale**:
- **Spec scope**: Single phase, no breaking changes planned
- **Simplicity**: Avoid premature complexity
- **Future-proofing**: Can add `/api/v2/` prefix if breaking changes needed

**Migration path**:
- If breaking changes needed: introduce `/api/v2/` routes
- Maintain `/api/v1/` for backward compatibility
- Deprecate v1 after migration period

## Frontend Architecture Research

### State Management Strategy

**Decision**: Use React hooks (useState, useContext) for state management (no Redux)

**Rationale**:
- **Simplicity**: Application state is simple (auth state + task list)
- **Built-in**: No external dependencies
- **Performance**: Sufficient for small-medium apps

**State structure**:

**Authentication state**:
```typescript
const AuthContext = createContext({
  user: null,
  token: null,
  login: (token: string) => {},
  logout: () => {}
});
```

**Task state**:
```typescript
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**When to consider Redux**:
- Multiple unrelated features sharing state
- Complex state transitions
- Time-travel debugging required

### API Client Pattern

**Decision**: Create centralized API client with token injection

**Rationale**:
- **DRY**: Single place to configure base URL, headers, error handling
- **Type safety**: TypeScript interfaces for requests/responses
- **Consistency**: All API calls follow same pattern

**Implementation**:
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: RegisterData) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: LoginData) => apiRequest<{ access_token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
  },
  tasks: {
    getAll: () => apiRequest<Task[]>('/api/tasks'),
    create: (data: CreateTaskData) => apiRequest<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: UpdateTaskData) => apiRequest<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest<void>(`/api/tasks/${id}`, { method: 'DELETE' })
  }
};
```

## Testing Strategy Research

### Test Pyramid Approach

**Decision**: Follow test pyramid (many unit tests, fewer integration tests, few E2E tests)

**Rationale**:
- **Speed**: Unit tests run fast (quick feedback loop)
- **Reliability**: Unit tests are less flaky than E2E tests
- **Coverage**: Unit tests cover edge cases and error paths
- **Cost**: E2E tests are expensive to maintain

**Test distribution**:
- **Unit tests (70%)**: Services, utilities, individual components
- **Integration tests (20%)**: API endpoints, database interactions
- **E2E tests (10%)**: Critical user flows (register, login, create task)

**Backend testing**:
```python
# Unit test (service layer)
def test_create_task_validates_description():
    with pytest.raises(ValidationError):
        TaskService.create(user_id=1, description="")

# Integration test (API + DB)
def test_get_tasks_filters_by_user(client, db, auth_headers):
    response = client.get("/api/tasks", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert all(task["user_id"] == 1 for task in tasks)
```

**Frontend testing**:
```typescript
// Unit test (component)
test('TaskItem renders task description', () => {
  render(<TaskItem task={{ description: 'Test task' }} />);
  expect(screen.getByText('Test task')).toBeInTheDocument();
});

// E2E test (Playwright)
test('user can create and complete task', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.fill('input[name="description"]', 'New task');
  await page.click('button:has-text("Add Task")');
  await expect(page.locator('text=New task')).toBeVisible();
  await page.click('[data-task-id] input[type="checkbox"]');
  await expect(page.locator('text=New task')).toHaveClass(/completed/);
});
```

## Performance Considerations

### Database Indexing Strategy

**Decision**: Create indexes on frequently queried columns

**Rationale**:
- **Performance**: Indexes dramatically speed up lookups (O(log n) vs O(n))
- **Spec requirement**: SC-002 requires <2 second task creation, SC-007 requires 100+ concurrent users

**Index plan**:
```sql
-- User lookups by email (login)
CREATE INDEX idx_users_email ON users(email);

-- Task queries by user_id (all task operations)
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Task queries filtering by completion status
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);
```

**Index sizing**:
- `idx_users_email`: Unique, used on every login (high value)
- `idx_tasks_user_id`: Used on every task query (high value)
- `idx_tasks_user_completed`: Composite index for filtering completed/active tasks (medium value)

**Monitoring**:
- Track query performance with `EXPLAIN ANALYZE`
- Add indexes if queries exceed performance budgets

### Frontend Performance Patterns

**Decision**: Use React optimization patterns (memoization, code splitting)

**Rationale**:
- **Spec requirement**: SC-004 requires responsive UI (320px-1920px)
- **User experience**: Fast interactions, minimal re-renders

**Optimization techniques**:

1. **Code splitting**: Load pages on demand
   ```typescript
   // Automatically split by Next.js App Router
   // Each page.tsx becomes a separate chunk
   ```

2. **Memoization**: Prevent unnecessary re-renders
   ```typescript
   const TaskItem = React.memo(({ task, onComplete, onDelete }) => {
     // Component only re-renders if task prop changes
   });
   ```

3. **Lazy loading**: Defer non-critical components
   ```typescript
   const EditTaskModal = lazy(() => import('./EditTaskModal'));
   ```

4. **Optimistic updates**: Update UI before API confirmation
   ```typescript
   const handleComplete = (taskId) => {
     // Update UI immediately
     setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: true } : t));
     // API call in background
     api.tasks.update(taskId, { is_completed: true }).catch(() => {
       // Revert on error
       setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: false } : t));
     });
   };
   ```

## Security Research

### Input Validation & Sanitization

**Decision**: Validate on both frontend and backend; sanitize on backend

**Rationale**:
- **Defense in depth**: Frontend validation improves UX, backend validation is security-critical
- **Spec requirement**: FR-015 requires XSS and SQL injection prevention

**Validation layers**:

1. **Frontend (UX)**:
   ```typescript
   const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const validatePassword = (pwd: string) => pwd.length >= 8;
   ```

2. **Backend (Security)**:
   ```python
   class UserCreate(BaseModel):
       email: EmailStr  # Pydantic validates email format
       password: str = Field(min_length=8, max_length=100)

   class TaskCreate(BaseModel):
       description: str = Field(min_length=1, max_length=500)
   ```

3. **Database (Last resort)**:
   ```sql
   -- Constraints as final safety net
   ALTER TABLE users ADD CONSTRAINT check_email_format CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');
   ```

**XSS prevention**:
- React auto-escapes JSX content (safe by default)
- Avoid `dangerouslySetInnerHTML`
- Sanitize on backend if storing HTML (not needed for plain text tasks)

**SQL injection prevention**:
- Use SQLModel ORM (parameterized queries)
- Never concatenate user input into SQL strings

### CORS Configuration

**Decision**: Configure CORS to allow frontend origin only

**Rationale**:
- **Security**: Prevent unauthorized cross-origin requests
- **Spec requirement**: Separate frontend/backend requires CORS

**Backend CORS setup**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://todo-app.example.com"  # Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

**Security notes**:
- Never use `allow_origins=["*"]` with `allow_credentials=True`
- Update `allow_origins` for production domain
- Consider environment variable for flexibility

## Development Workflow Research

### Monorepo vs Multi-repo

**Decision**: Use monorepo with separate `frontend/` and `backend/` directories

**Rationale**:
- **Versioning**: Single source of truth for feature branches
- **Coordination**: Changes affecting both frontend/backend stay in sync
- **Simplicity**: One repository to clone, fewer PRs to manage

**Alternative considered**:
- Multi-repo: More complex branching, requires coordinated PRs

**Structure**:
```
repo-root/
├── frontend/      # Next.js app
├── backend/       # FastAPI app
├── .env.example   # Shared environment template
└── README.md      # Monorepo documentation
```

### Local Development Setup

**Decision**: Use docker-compose for local PostgreSQL, run frontend/backend natively

**Rationale**:
- **Database isolation**: Avoid polluting system PostgreSQL
- **Consistency**: All developers use same DB version
- **Performance**: Native Node.js and Python faster than Docker

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: todoapp
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: todoapp_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Development commands**:
```bash
# Start database
docker-compose up -d

# Run backend
cd backend
python -m uvicorn src.main:app --reload

# Run frontend
cd frontend
npm run dev
```

## Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| **Frontend Framework** | Next.js 14+ App Router | Constitution requirement, SSR, TypeScript support |
| **Frontend Styling** | Tailwind CSS 3+ | Constitution requirement, utility-first, responsive |
| **Backend Framework** | FastAPI 0.109+ | Constitution requirement, async, OpenAPI docs |
| **ORM** | SQLModel 0.0.14+ | Constitution requirement, unified models, type safety |
| **Database** | Neon PostgreSQL | Constitution requirement, serverless, branching |
| **Authentication** | JWT (HS256, 24h expiration) | Constitution requirement, stateless, scalable |
| **Password Hashing** | bcrypt (cost 12) | Spec requirement, adaptive, industry standard |
| **Architecture** | Clean Architecture (3 layers) | Constitution requirement, testability, maintainability |
| **Data Isolation** | Service-layer filtering + zero-trust | Constitution requirement, defense in depth |
| **API Design** | RESTful with standard status codes | Industry standard, predictable, tooling support |
| **State Management** | React hooks (no Redux) | Simple app, no complex state |
| **API Client** | Centralized fetch wrapper | DRY, type safety, consistency |
| **Testing** | Pytest + Jest + Playwright | Test pyramid, constitutional TDD requirement |
| **Indexing** | Email + user_id + composite | Performance requirements (SC-002, SC-007) |
| **Security** | Frontend + backend validation, Pydantic | Defense in depth, spec requirement (FR-015) |
| **CORS** | Allow frontend origin only | Security best practice |
| **Repo Structure** | Monorepo (frontend/ + backend/) | Versioning simplicity |
| **Local Dev** | Docker DB + native apps | Isolation + performance |

## Unresolved Questions

None. All technical decisions are finalized and justified.

## Next Steps

Proceed to Phase 1:
1. Generate `data-model.md` (entity definitions)
2. Generate `contracts/api.openapi.yaml` (API specification)
3. Generate `quickstart.md` (development setup guide)
4. Update agent context with technology stack
