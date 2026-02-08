"""Task model definition."""
from datetime import datetime
from sqlmodel import Field, SQLModel
from typing import Optional


class Task(SQLModel, table=True):
    """Task table for todo items."""

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(SQLModel):
    """Schema for creating a task."""

    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)


class TaskUpdate(SQLModel):
    """Schema for updating a task."""

    title: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: Optional[bool] = Field(default=None)


class TaskResponse(SQLModel):
    """Schema for task response."""

    id: int
    user_id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
