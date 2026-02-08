"""Application configuration."""
import os
from typing import List


class Settings:
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@host:5432/dbname"
    )

    # JWT Configuration
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "your-secret-key-change-in-production-min-256-bits-recommended"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_HOURS: int = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

    # CORS Configuration
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000"
    ).split(",")

    # API Configuration
    API_PORT: int = int(os.getenv("API_PORT", "8000"))


settings = Settings()
