import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "KisanWise API"
    APP_VERSION: str = "2.0.0"
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "kisanwise")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "kisanwise-super-secret-key-2026-agriintel")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days session
    AGMARKNET_API_KEY: str = os.getenv("AGMARKNET_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

settings = Settings()
