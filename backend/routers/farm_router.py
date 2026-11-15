from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from backend.database import db_manager
from backend.auth import get_current_user
from backend.services.recommendation_engine import calculate_agronomic_yield

router = APIRouter(prefix="/api/farms", tags=["Farms"])

class FarmModel(BaseModel):
    id: Optional[str] = None
    userId: Optional[str] = None
    name: str = "Patil Farm"
    crop: str = "soybean"
    commodity: Optional[str] = "soybean"
    state: str = "Maharashtra"
    district: str = "Latur"
    village: str = "Ausa"
    lat: float = 18.2333
    lng: float = 76.7167
    areaHectares: float = 3.5
    sowingDate: str = "2026-06-20"
    soilType: str = "black"
    irrigationType: str = "rainfed"
    inputCostPerHa: float = 18000.0
    fieldGeoJson: Optional[Dict[str, Any]] = None

DEFAULT_DEMO_FARM = {
    "id": "demo-farm-patil",
    "userId": "demo-user-suresh",
    "name": "Patil Farm",
    "crop": "soybean",
    "commodity": "soybean",
    "state": "Maharashtra",
    "district": "Latur",
    "village": "Ausa",
    "lat": 18.2333,
    "lng": 76.7167,
    "areaHectares": 3.5,
    "sowingDate": "2026-06-20",
    "expectedHarvestDate": "2026-10-25",
    "soilType": "black",
    "irrigationType": "rainfed",
    "inputCostPerHa": 18000.0,
    "expectedYieldQPerHa": 19.8,
    "totalHarvestQ": 69.3,
    "fieldGeoJson": {
        "type": "Polygon",
        "coordinates": [
            [
                [76.7145, 18.2312],
                [76.7189, 18.2312],
                [76.7189, 18.2354],
                [76.7145, 18.2354],
                [76.7145, 18.2312]
            ]
        ]
    }
}

@router.get("")
async def get_farm(user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    user_id = user.get("id") if user else "demo-user-suresh"
    
    if db_manager.is_connected and db_manager.db is not None:
        farm = await db_manager.db.farms.find_one({"userId": user_id})
        if farm:
            farm["id"] = str(farm.get("_id") or farm.get("id"))
            farm.pop("_id", None)
            return {"success": True, "farm": farm}
    else:
        for f in db_manager._memory_store["farms"]:
            if f.get("userId") == user_id:
                return {"success": True, "farm": f}

    # If this is an authenticated real farmer who doesn't have a farm yet, create their private farm
    if user and user_id != "demo-user-suresh":
        user_name = user.get("name", "Farmer")
        new_farm = dict(DEFAULT_DEMO_FARM)
        new_farm["id"] = f"farm-{user_id[:8]}"
        new_farm["userId"] = user_id
        new_farm["name"] = f"{user_name}'s Farm"
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.farms.insert_one(dict(new_farm))
            new_farm.pop("_id", None)
        else:
            db_manager._memory_store["farms"].append(new_farm)
        return {"success": True, "farm": new_farm}

    return {"success": True, "farm": DEFAULT_DEMO_FARM}

@router.post("/reset-demo")
async def reset_demo_farm():
    """Resets the demo sandbox back to baseline defaults without touching any real user accounts"""
    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.farms.delete_one({"userId": "demo-user-suresh"})
    return {"success": True, "farm": DEFAULT_DEMO_FARM}

@router.post("")
async def save_farm(farm: FarmModel, user: Optional[Dict[str, Any]] = Depends(get_current_user)):
    user_id = user.get("id") if user else "demo-user-suresh"
    farm_dict = farm.dict()
    farm_dict["userId"] = user_id
    if not farm_dict.get("id"):
        farm_dict["id"] = f"farm-{int(farm_dict.get('lat', 18) * 1000)}"

    # Dynamically compute agronomic yield and total harvest based on edits
    agronomy = calculate_agronomic_yield(
        commodity=farm_dict.get("crop", "soybean"),
        soil_type=farm_dict.get("soilType", "black"),
        irrigation_type=farm_dict.get("irrigationType", "rainfed")
    )
    yield_val = agronomy["calculatedYield"]
    total_q = round(farm_dict["areaHectares"] * yield_val, 2)
    
    farm_dict["expectedYieldQPerHa"] = yield_val
    farm_dict["totalHarvestQ"] = total_q

    if db_manager.is_connected and db_manager.db is not None:
        await db_manager.db.farms.update_one(
            {"userId": user_id},
            {"$set": farm_dict},
            upsert=True
        )
    else:
        found = False
        for idx, f in enumerate(db_manager._memory_store["farms"]):
            if f.get("userId") == user_id:
                db_manager._memory_store["farms"][idx] = farm_dict
                found = True
                break
        if not found:
            db_manager._memory_store["farms"].append(farm_dict)

    return {"success": True, "farm": farm_dict}
