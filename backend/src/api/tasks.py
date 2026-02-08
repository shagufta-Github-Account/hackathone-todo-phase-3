"""Tasks API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from src.core.database import get_session
from src.core.security import decode_access_token
from src.models.task import Task, TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


async def get_current_user_id(request: Request) -> int:
    """
    Helper to get current user ID from JWT token.

    Args:
        request: FastAPI request object with token in state

    Returns:
        int: User ID

    Raises:
        HTTPException: If token is invalid
    """
    token = getattr(request.state, "token", None)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Remove "Bearer " prefix if present
        if token.startswith("Bearer "):
            token = token[7:]
        return decode_access_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("", response_model=list[TaskResponse])
async def get_all_tasks(
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """
    Get all tasks for the current authenticated user.
    """
    user_id = await get_current_user_id(request)

    result = await session.execute(
        select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    )
    tasks = result.scalars().all()

    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Create a new task for the current authenticated user."""
    user_id = await get_current_user_id(request)

    new_task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description
    )

    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)

    return new_task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Update a task (title, description, or completed status)."""
    user_id = await get_current_user_id(request)

    result = await session.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task",
        )

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    await session.commit()
    await session.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    """Delete a task."""
    user_id = await get_current_user_id(request)

    result = await session.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task",
        )

    await session.execute(delete(Task).where(Task.id == task_id))
    await session.commit()
