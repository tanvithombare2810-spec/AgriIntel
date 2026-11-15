from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from backend.config import settings
from backend.database import db_manager
from backend.routers import (
    auth_router,
    farm_router,
    market_router,
    weather_router,
    recommendations_router,
    notifications_router,
    ai_router
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kisanwise")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing KisanWise Backend Engine...")
    await db_manager.connect()
    yield
    await db_manager.close()
    logger.info("KisanWise Backend Stopped.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade agricultural decision support API with APMC Mandi and weather integrations.",
    lifespan=lifespan
)

# Open CORS for local and remote frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serverless resilience middleware: ensure MongoDB connection on cold starts
@app.middleware("http")
async def ensure_db_connection_middleware(request, call_next):
    if not db_manager.is_connected:
        await db_manager.connect()
    return await call_next(request)

# Root status for health & Vercel deployment probes
@app.get("/")
@app.get("/api")
async def root_status():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected" if db_manager.is_connected else "disconnected",
        "docs": "/docs"
    }

# Mount Routers
app.include_router(auth_router.router)
app.include_router(farm_router.router)
app.include_router(market_router.router)
app.include_router(weather_router.router)
app.include_router(recommendations_router.router)
app.include_router(notifications_router.router)
app.include_router(ai_router.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "database": "connected" if db_manager.is_connected else "memory_buffer",
        "timestamp": "2026-11-15T12:00:00+05:30"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
