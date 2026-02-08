from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session():
    """FastAPI dependency that provides an async SQLAlchemy session.

    Usage:
        session: AsyncSession = Depends(get_session)

    Yields:
        AsyncSession: an active database session bound to the async engine.

    Notes:
        - Uses an async generator so FastAPI can handle cleanup.
        - Rolls back on exceptions to avoid leaking failed transactions.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


# 🔥 THIS FUNCTION WAS MISSING — AB ADD HO GAYA
from sqlmodel import SQLModel

async def init_db():
    async with engine.begin() as conn:
        # import all models so SQLModel knows about them
        from src.models import task, user
        await conn.run_sync(SQLModel.metadata.create_all)
