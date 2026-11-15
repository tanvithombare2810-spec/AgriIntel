from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import uuid
from datetime import datetime
from backend.database import db_manager
from backend.auth import get_password_hash, verify_password, create_access_token, require_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    phoneOrEmail: str = Field(..., min_length=5)
    password: str = Field(..., min_length=4)
    preferredLanguage: str = "mr"

class LoginRequest(BaseModel):
    phoneOrEmail: str
    password: str

@router.post("/register")
async def register(req: RegisterRequest):
    identifier = req.phoneOrEmail.strip().lower()
    
    # Check if user already exists
    if db_manager.is_connected and db_manager.db is not None:
        existing = await db_manager.db.users.find_one({"phoneOrEmail": identifier})
        if existing:
            raise HTTPException(status_code=400, detail="Account with this mobile number or email already exists")
    else:
        for u in db_manager._memory_store["users"]:
            if u["phoneOrEmail"] == identifier:
                raise HTTPException(status_code=400, detail="Account with this mobile number or email already exists")

    hashed_pw = get_password_hash(req.password)
    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "id": user_id,
        "name": req.name.strip(),
        "phoneOrEmail": identifier,
        "passwordHash": hashed_pw,
        "preferredLanguage": req.preferredLanguage,
        "createdAt": datetime.now().isoformat()
    }

    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.users.insert_one(user_doc)
    else:
        db_manager._memory_store["users"].append(user_doc)

    token = create_access_token({"sub": user_id, "name": req.name, "isDemo": False})
    return {
        "success": True,
        "token": token,
        "user": {
            "id": user_id,
            "name": req.name,
            "phoneOrEmail": identifier,
            "preferredLanguage": req.preferredLanguage,
            "isDemo": False
        }
    }

@router.post("/login")
async def login(req: LoginRequest):
    identifier = req.phoneOrEmail.strip().lower()
    
    user = None
    if db_manager.is_connected and db_manager.db is not None:
        user = await db_manager.db.users.find_one({"phoneOrEmail": identifier})
    else:
        for u in db_manager._memory_store["users"]:
            if u["phoneOrEmail"] == identifier:
                user = u
                break

    # If demo login or user not found with default credentials, provide demo profile
    if not user:
        if identifier in ["farmer@example.com", "9876543210", "demo", "suresh"]:
            demo_user = {
                "id": "demo-user-suresh",
                "name": "Suresh Patil",
                "phoneOrEmail": "demo@kisanwise.org",
                "preferredLanguage": "mr",
                "isDemo": True
            }
            token = create_access_token({"sub": demo_user["id"], "name": demo_user["name"], "isDemo": True})
            return {"success": True, "token": token, "user": demo_user}
        raise HTTPException(status_code=401, detail="Invalid phone number/email or password")

    if not verify_password(req.password, user.get("passwordHash", "")):
        raise HTTPException(status_code=401, detail="Invalid phone number/email or password")

    user_id = str(user.get("_id") or user.get("id"))
    token = create_access_token({"sub": user_id, "name": user.get("name"), "isDemo": False})
    return {
        "success": True,
        "token": token,
        "user": {
            "id": user_id,
            "name": user.get("name"),
            "phoneOrEmail": user.get("phoneOrEmail"),
            "preferredLanguage": user.get("preferredLanguage", "mr"),
            "isDemo": False
        }
    }

@router.post("/demo")
async def demo_session():
    """Explicit endpoint for starting an isolated demo sandbox session"""
    demo_user = {
        "id": "demo-user-suresh",
        "name": "Suresh Patil",
        "phoneOrEmail": "demo@kisanwise.org",
        "preferredLanguage": "mr",
        "isDemo": True
    }
    token = create_access_token({"sub": demo_user["id"], "name": demo_user["name"], "isDemo": True})
    return {"success": True, "token": token, "user": demo_user}

@router.get("/me")
async def get_profile(user: Dict[str, Any] = Depends(require_current_user)):
    return {
        "id": user.get("id") or str(user.get("_id")),
        "name": user.get("name"),
        "phoneOrEmail": user.get("phoneOrEmail"),
        "preferredLanguage": user.get("preferredLanguage", "mr")
    }
