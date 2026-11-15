import logging
from typing import Optional, Dict, Any, List
import motor.motor_asyncio
from pymongo.errors import ServerSelectionTimeoutError
from backend.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
    db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None
    is_connected: bool = False
    
    # In-memory document fallback store for zero-friction local development
    _memory_store: Dict[str, List[Dict[str, Any]]] = {
        "users": [],
        "farms": [],
        "notifications": [],
        "mandi_cache": []
    }

    async def connect(self):
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
            # Robust timeout for cloud MongoDB Atlas cluster
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=7000
            )
            # Ping database
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info("Successfully connected to MongoDB cluster!")
        except Exception as e:
            logger.warning(f"Could not connect to MongoDB server ({e}). Operating in memory-buffered mode.")
            self.is_connected = False

    async def close(self):
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")

db_manager = DatabaseManager()

def get_db():
    return db_manager.db
