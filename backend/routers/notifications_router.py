from fastapi import APIRouter, Depends
from typing import Optional, Dict, Any, List
from datetime import datetime
from backend.database import db_manager
from backend.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["In-App Notifications"])

DEFAULT_NOTIFICATIONS = [
    {
        "id": "notif-1",
        "type": "price_surge",
        "title": "Latur APMC Soybean Price Surge",
        "message": "Modal price rose by +₹90/qtl to ₹4,380/qtl today. High demand from local crushers.",
        "severity": "success",
        "isRead": False,
        "timestamp": "Today, 08:30 AM"
    },
    {
        "id": "notif-2",
        "type": "weather_warning",
        "title": "Dry Weather Transport Window",
        "message": "Zero rain expected over the next 4 days in Latur & Solapur districts. Optimal for loading and hauling.",
        "severity": "info",
        "isRead": False,
        "timestamp": "Yesterday, 04:15 PM"
    },
    {
        "id": "notif-3",
        "type": "harvest_deadline",
        "title": "Moisture Holding Alert",
        "message": "If holding harvested soybean for >10 days, inspect moisture levels to prevent grain discoloration.",
        "severity": "warning",
        "isRead": True,
        "timestamp": "2 days ago"
    }
]

@router.get("")
async def get_notifications(user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    user_id = user.get("id") if user else "demo-user-suresh"
    if db_manager.is_connected and db_manager.db is not None:
        cursor = db_manager.db.notifications.find({"userId": user_id}).sort("createdAt", -1)
        notifs = await cursor.to_list(length=20)
        if notifs:
            for n in notifs:
                n["id"] = str(n.get("_id") or n.get("id"))
            return {"success": True, "notifications": notifs}
    
    return {"success": True, "notifications": DEFAULT_NOTIFICATIONS}

@router.post("/{notif_id}/read")
async def mark_read(notif_id: str, user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    return {"success": True, "markedRead": notif_id}
