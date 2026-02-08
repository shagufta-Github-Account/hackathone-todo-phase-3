"""Authentication API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.core.database import get_session
from src.core.security import hash_password, verify_password, create_access_token
from src.models.user import User, UserCreate, UserLogin, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    """
    Register a new user.

    Args:
        user_data: User registration data (email, password)
        session: Database session

    Returns:
        UserResponse: Created user data

    Raises:
        HTTPException: If user with email already exists
    """
    # Check if user already exists
    result = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    password_hash = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=password_hash)

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return new_user


@router.post("/login")
async def login(
    user_data: UserLogin,
    session: AsyncSession = Depends(get_session),
):
    """
    Authenticate user and return JWT token.

    Args:
        user_data: User login data (email, password)
        session: Database session

    Returns:
        dict: Access token and token type

    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    result = await session.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create and return access token
    access_token = create_access_token(user_id=user.id)

    return {"access_token": access_token, "token_type": "bearer"}
