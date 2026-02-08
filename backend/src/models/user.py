"""User model definition."""
from datetime import datetime
from sqlmodel import Field, SQLModel
from typing import Optional


class User(SQLModel, table=True):
    """User table for authentication and user data."""

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    """Schema for user registration."""

    email: str = Field(max_length=255)
    password: str = Field(min_length=6, max_length=255)


class UserLogin(SQLModel):
    """Schema for user login."""

    email: str = Field(max_length=255)
    password: str


class UserResponse(SQLModel):
    """Schema for user response."""

    id: int
    email: str
    created_at: datetime
