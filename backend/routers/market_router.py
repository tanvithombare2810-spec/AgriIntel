from fastapi import APIRouter, Query
from typing import Optional
from backend.services.mandi_service import get_mandi_prices_and_trends

router = APIRouter(prefix="/api/market", tags=["Market & APMC"])

@router.get("")
async def get_market_data(
    commodity: str = Query("soybean"),
    lat: float = Query(18.2333),
    lng: float = Query(76.7167),
    state: str = Query("Maharashtra")
):
    data = get_mandi_prices_and_trends(
        commodity=commodity,
        farmer_lat=lat,
        farmer_lng=lng
    )
    return {"success": True, "data": data}
