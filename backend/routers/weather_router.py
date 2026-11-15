from fastapi import APIRouter, Query
from backend.services.weather_service import get_weather_forecast

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("")
async def get_weather(
    lat: float = Query(18.2333),
    lng: float = Query(76.7167),
    days: int = Query(7)
):
    result = await get_weather_forecast(lat=lat, lng=lng, days=days)
    return {"success": True, "data": result}
