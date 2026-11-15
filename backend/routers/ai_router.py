from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.services.ai_service import generate_ai_response

router = APIRouter(prefix="/api/ai", tags=["AI Advisor"])

class ChatRequest(BaseModel):
    query: str
    language: str = "en"
    farmContext: Optional[Dict[str, Any]] = None

@router.post("")
async def ask_ai(req: ChatRequest):
    result = await generate_ai_response(
        query=req.query,
        language=req.language,
        farm_context=req.farmContext
    )
    return {"success": True, "data": result}
