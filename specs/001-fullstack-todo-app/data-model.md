# Data Model: Full-Stack Todo Web Application

**Feature**: Full-Stack Todo Web Application
**Date**: 2025-12-31
**Purpose**: Define database schema, entity relationships, and validation rules

## Overview

This document defines the data model for the todo application. The model consists of two primary entities: **User** and **Task**, with a one-to-many relationship (one user owns many tasks).

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
│─────────────────────│
│ id (PK)             │◄──────────┐
│ email (UNIQUE)      │           │
│ password_hash       │           │ 1
│ created_at          │           │
└─────────────────────┘           │
                                  │
                                  │
                                  │ N
                       ┌──────────┴──────────┐
                       │       Task          │
                       │─────────────────────│
                       │ id (PK)             │
                       │ user_id (FK)        │
                       │ description         │
                       │ is_completed        │
                       │ created_at          │
                       │ updated_at          │
                       └─────────────────────┘
```

**Relationship**: User → Task (One-to-Many)
- One user can have zero or many tasks
- Each task belongs to exactly one user
- Foreign key: `tasks.user_id` → `users.id`
- Cascade delete: Deleting a user deletes all their tasks

## Entity: User

### Description

Represents a registered user account in the system. Users authenticate with email and password, and own a collection of tasks.

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO INCREMENT | Unique identifier for the user |
| `email` | String (255) | UNIQUE, NOT NULL | User's email address (login identifier) |
| `password_hash` | String (255) | NOT NULL | Bcrypt-hashed password (never store plaintext) |
| `created_at` | Timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp (UTC) |

### Validation Rules

**Email**:
- Must be valid email format (RFC 5322)
- Must be unique across all users
- Case-insensitive comparison (store lowercase)
- Maximum length: 255 characters
- Frontend validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Backend validation: Pydantic `EmailStr` type

**Password** (plaintext, before hashing):
- Minimum length: 8 characters
- Maximum length: 100 characters (before hashing)
- Frontend validation: Length check, optional strength indicator
- Backend validation: Length check before hashing
- Storage: Bcrypt hash (60 characters) with cost factor 12

**Password Hash**:
- Format: Bcrypt hash string (e.g., `$2b$12$...`)
- Length: 60 characters
- Never expose in API responses

### Indexes

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**Rationale**: Fast lookups during login (O(log n) instead of O(n))

### SQLModel Definition (Python)

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### TypeScript Definition (Frontend)

```typescript
export interface User {
  id: number;
  email: string;
  created_at: string; // ISO 8601 format
  // password_hash is never exposed to frontend
}

export interface UserRegisterRequest {
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  token_type: string; // "bearer"
}
```

### Business Rules

1. **Unique email**: Each email can only register one account
2. **Password security**: Passwords are hashed before storage, never logged or exposed
3. **Account deletion**: Deleting a user cascades to delete all their tasks
4. **No email changes**: Email is immutable after account creation (out of scope for this phase)
5. **No password reset**: Password reset functionality is out of scope

### State Transitions

Users have no explicit state field. Account lifecycle:
1. **Created**: User registers (email + password) → User row inserted
2. **Active**: User can log in and access their tasks
3. **Deleted**: (Out of scope) User account and all tasks removed

## Entity: Task

### Description

Represents a todo item owned by a user. Tasks have a description and completion status.

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | PRIMARY KEY, AUTO INCREMENT | Unique identifier for the task |
| `user_id` | Integer | FOREIGN KEY (users.id), NOT NULL, ON DELETE CASCADE | Owner of the task |
| `description` | Text | NOT NULL | Task description (no length limit in DB) |
| `is_completed` | Boolean | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | Timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task creation timestamp (UTC) |
| `updated_at` | Timestamp | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last modification timestamp (UTC) |

### Validation Rules

**user_id**:
- Must reference an existing user
- Cannot be NULL
- Enforced by foreign key constraint
- Cascade delete: Deleting user deletes all their tasks

**description**:
- Minimum length: 1 character (cannot be empty or whitespace-only)
- Maximum length: 500 characters (frontend enforcement)
- No length limit in database (TEXT type)
- Must be non-null
- Trimmed on frontend and backend (leading/trailing whitespace removed)
- Special characters allowed (unicode support)
- XSS prevention: React auto-escapes, Pydantic validates

**is_completed**:
- Boolean: `true` (completed) or `false` (incomplete/active)
- Default: `false` (new tasks are incomplete)
- Cannot be NULL

**Timestamps**:
- `created_at`: Set once on task creation, never changed
- `updated_at`: Updated automatically on any modification
- Both stored in UTC, displayed in user's timezone (frontend)

### Indexes

```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);
```

**Rationale**:
- `idx_tasks_user_id`: Fast filtering for "get all user's tasks" queries
- `idx_tasks_user_completed`: Composite index for "get user's completed/incomplete tasks" queries

### SQLModel Definition (Python)

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    description: str = Field(min_length=1, max_length=500)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### TypeScript Definition (Frontend)

```typescript
export interface Task {
  id: number;
  user_id: number;
  description: string;
  is_completed: boolean;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

export interface TaskCreateRequest {
  description: string;
}

export interface TaskUpdateRequest {
  description?: string;
  is_completed?: boolean;
}
```

### Business Rules

1. **User ownership**: Every task belongs to exactly one user
2. **Data isolation**: Users can only access their own tasks (enforced in service layer)
3. **Description required**: Tasks cannot have empty descriptions
4. **Default status**: New tasks are incomplete by default
5. **Soft delete not implemented**: Deleted tasks are permanently removed (no trash/archive)
6. **No task sharing**: Tasks cannot be assigned to or shared with other users
7. **No task ordering**: Tasks displayed in creation order (newest first)

### State Transitions

Tasks have a simple boolean state:

```
┌──────────────┐
│  Incomplete  │ (is_completed = false)
└──────┬───────┘
       │
       │ User marks task as completed
       ↓
┌──────────────┐
│  Completed   │ (is_completed = true)
└──────┬───────┘
       │
       │ User unmarks task (toggle)
       ↓
┌──────────────┐
│  Incomplete  │ (is_completed = false)
└──────────────┘
```

**Transitions**:
1. **Create**: User creates task → `is_completed = false`
2. **Complete**: User marks task → `is_completed = true`
3. **Uncomplete**: User unmarks task → `is_completed = false`
4. **Delete**: User deletes task → Task row removed

## Database Schema (SQL)

### Table Definitions

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

```sql
-- User email lookup (login)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Task queries by user
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Task queries by user + completion status
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed);
```

### Constraints

```sql
-- Foreign key constraint (enforce referential integrity)
ALTER TABLE tasks
    ADD CONSTRAINT fk_tasks_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

-- Check constraints (optional, Pydantic handles this)
ALTER TABLE users
    ADD CONSTRAINT check_email_format
    CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');

ALTER TABLE tasks
    ADD CONSTRAINT check_description_not_empty
    CHECK (LENGTH(TRIM(description)) > 0);
```

### Triggers (for updated_at)

PostgreSQL does not auto-update `updated_at` on row modification. Use trigger:

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on tasks table
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Data Access Patterns

### Common Queries

**User registration** (write):
```sql
INSERT INTO users (email, password_hash, created_at)
VALUES ($1, $2, CURRENT_TIMESTAMP)
RETURNING id, email, created_at;
```

**User login** (read):
```sql
SELECT id, email, password_hash, created_at
FROM users
WHERE email = $1;
```

**Get user's tasks** (read):
```sql
SELECT id, user_id, description, is_completed, created_at, updated_at
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC;
```

**Create task** (write):
```sql
INSERT INTO tasks (user_id, description, is_completed, created_at, updated_at)
VALUES ($1, $2, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING id, user_id, description, is_completed, created_at, updated_at;
```

**Update task** (write):
```sql
UPDATE tasks
SET description = $1, is_completed = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3 AND user_id = $4
RETURNING id, user_id, description, is_completed, created_at, updated_at;
```

**Delete task** (write):
```sql
DELETE FROM tasks
WHERE id = $1 AND user_id = $2
RETURNING id;
```

**Authorization check** (before update/delete):
```sql
SELECT id FROM tasks WHERE id = $1 AND user_id = $2;
-- If no rows returned, user does not own task (403 Forbidden)
```

### Performance Considerations

**Index usage**:
- `idx_users_email`: Used by login query (fast lookup)
- `idx_tasks_user_id`: Used by "get user's tasks" query (fast filtering)
- `idx_tasks_user_completed`: Used by "get completed/incomplete tasks" query (optional future feature)

**Query performance**:
- User login: O(log n) with email index
- Get tasks: O(k log n) where k = tasks per user, n = total tasks
- Create/update/delete task: O(log n) with primary key index

**Expected load** (per SC-007):
- 100 concurrent users
- Assume average 50 tasks per user → 5,000 total tasks
- Indexes keep queries fast even at 10x scale (50,000 tasks)

## Migration Strategy

### Alembic Migrations

Use Alembic for database schema versioning:

**Initial migration** (create tables):
```bash
alembic revision --autogenerate -m "Initial schema: users and tasks"
alembic upgrade head
```

**Migration file** (generated):
```python
def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_users_email', 'users', ['email'], unique=True)

    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('is_completed', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_user_completed', 'tasks', ['user_id', 'is_completed'])

def downgrade():
    op.drop_table('tasks')
    op.drop_table('users')
```

### Future Schema Changes

**Out of scope for Phase 2** (but documented for future reference):
- Add `tasks.due_date` (timestamp, nullable)
- Add `tasks.priority` (enum: low, medium, high)
- Add `tasks.category_id` (foreign key to new `categories` table)
- Add `user_sessions` table (track active JWT tokens for revocation)

## Data Isolation Enforcement

### Database Level

Foreign key constraint ensures every task belongs to a valid user:
```sql
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

### Application Level (Service Layer)

All queries MUST filter by `user_id`:

```python
# CORRECT: Filter by user_id
def get_user_tasks(db: Session, user_id: int) -> List[Task]:
    return db.query(Task).filter(Task.user_id == user_id).all()

# INCORRECT: Missing user_id filter (exposes all tasks!)
def get_all_tasks(db: Session) -> List[Task]:
    return db.query(Task).all()  # VIOLATES CONSTITUTION
```

Authorization checks before mutations:

```python
def update_task(db: Session, task_id: int, user_id: int, data: dict) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    if task.user_id != user_id:
        raise HTTPException(403, "Not authorized to modify this task")
    # ... update task
```

### API Level (Route Handlers)

JWT dependency injects user_id from token:

```python
from fastapi import Depends
from src.api.dependencies import get_current_user_id

@app.get("/api/tasks")
async def get_tasks(user_id: int = Depends(get_current_user_id)):
    return TaskService.get_user_tasks(db, user_id)
```

### Test Coverage

Data isolation MUST be verified by integration tests:

```python
def test_user_cannot_access_other_users_tasks(client, db):
    # Create two users
    user1 = create_user(db, "user1@example.com", "password123")
    user2 = create_user(db, "user2@example.com", "password456")

    # User 1 creates task
    task = create_task(db, user1.id, "User 1's task")

    # User 2 tries to access User 1's task
    token2 = login_and_get_token(client, "user2@example.com", "password456")
    response = client.get(f"/api/tasks/{task.id}", headers={"Authorization": f"Bearer {token2}"})

    # Should fail with 404 (or 403 if implementation reveals existence)
    assert response.status_code in [403, 404]
```

## Summary

**Entities**: 2 (User, Task)
**Relationships**: 1 (User → Task, one-to-many)
**Tables**: 2 (users, tasks)
**Indexes**: 3 (users.email, tasks.user_id, tasks.user_id+is_completed)
**Constraints**: 1 foreign key, 2 unique constraints, 2 optional check constraints
**Triggers**: 1 (update tasks.updated_at)

This data model satisfies all constitutional requirements:
- ✅ Data isolation: Foreign key + service-layer filtering
- ✅ Type safety: SQLModel with type hints
- ✅ Clean architecture: Models are innermost layer
- ✅ Security: Password hashing, no sensitive data exposure
