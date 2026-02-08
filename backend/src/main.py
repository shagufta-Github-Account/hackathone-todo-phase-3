"""FastAPI application entry point."""
from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.core.database import init_db
from src.api.auth import router as auth_router
from src.api.tasks import router as tasks_router
# FIX 1: Chat router ko import karein
# Agar file src/chat.py hai to ye likhein:
from src.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield

# Create FastAPI application
app = FastAPI(
    title="Todo Application API",
    description="RESTful API for Phase 2 Todo Application with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Phase 3 ke liye "http://localhost:3000" specific bhi kar sakte hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)
# FIX 2: Chat router ko yahan include karein
app.include_router(chat_router) 

@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}

@app.get("/", tags=["Root"])
async def root() -> dict[str, str]:
    return {
        "message": "Todo Application API",
        "docs": "/docs",
        "health": "/health"
    }

@app.middleware("http")
async def auth_token_extractor(request: Request, call_next):
    authorization = request.headers.get("Authorization")
    if authorization:
        request.state.token = authorization
    else:
        request.state.token = None

    response = await call_next(request)
    return response