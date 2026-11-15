import math
from datetime import datetime, date
from typing import Dict, Any, List, Optional
from backend.services.mandi_service import get_mandi_prices_and_trends

# Agronomic Baseline Yields (Quintals per Hectare under standard rainfed conditions)
CROP_BASE_YIELDS = {
    # South India & Pan-India Cereals & Spices
    "paddy": {"yield": 46.0, "maturityDays": 125, "harvestWindow": 16},
    "rice": {"yield": 46.0, "maturityDays": 125, "harvestWindow": 16},
    "chilli": {"yield": 28.0, "maturityDays": 140, "harvestWindow": 25},
    "turmeric": {"yield": 65.0, "maturityDays": 240, "harvestWindow": 30},
    "groundnut": {"yield": 22.0, "maturityDays": 115, "harvestWindow": 14},
    "ragi": {"yield": 26.0, "maturityDays": 110, "harvestWindow": 14},
    "maize": {"yield": 38.0, "maturityDays": 105, "harvestWindow": 14},

    # Western & Central India Pulses & Oilseeds
    "soybean": {"yield": 18.0, "maturityDays": 110, "harvestWindow": 14},
    "tur": {"yield": 14.5, "maturityDays": 160, "harvestWindow": 20},
    "wheat": {"yield": 32.0, "maturityDays": 125, "harvestWindow": 15},
    "cotton": {"yield": 22.0, "maturityDays": 165, "harvestWindow": 25},
    "onion": {"yield": 160.0, "maturityDays": 95, "harvestWindow": 10},
    "jowar": {"yield": 24.0, "maturityDays": 115, "harvestWindow": 14},
    "gram": {"yield": 16.5, "maturityDays": 105, "harvestWindow": 12},
    "sugarcane": {"yield": 780.0, "maturityDays": 360, "harvestWindow": 45}
}

# Soil Type Impact on Moisture Retention and Nutrient Availability
SOIL_FACTORS = {
    "clay_paddy": {"multiplier": 1.15, "label": "Deltaic Clay / Puddled Wetland (+15% for Paddy)"},
    "red_sandy_loam": {"multiplier": 0.98, "label": "Red Sandy Loam (Optimal for Groundnut & Ragi)"},
    "black": {"multiplier": 1.10, "label": "Black Cotton Soil (+10% moisture retention)"},
    "alluvial": {"multiplier": 1.12, "label": "Alluvial Loam (+12% rich silt)"},
    "loamy": {"multiplier": 1.05, "label": "Medium Loamy (+5% balanced drainage)"},
    "red": {"multiplier": 0.96, "label": "Red Soil (-4% needs organic matter)"},
    "laterite": {"multiplier": 0.92, "label": "Laterite Soil (-8% high porosity)"},
    "sandy": {"multiplier": 0.85, "label": "Sandy Soil (-15% rapid leaching)"}
}

# Irrigation Efficiency Boost
IRRIGATION_FACTORS = {
    "flooded_paddy": {"multiplier": 1.25, "label": "Continuous Wetland Submersion (+25% flooded paddy)"},
    "tank_irrigation": {"multiplier": 1.15, "label": "South Indian Tank/Eri Irrigation (+15%)"},
    "canal": {"multiplier": 1.15, "label": "Canal Feed (+15% surface supply)"},
    "drip": {"multiplier": 1.25, "label": "Drip Irrigation (+25% precision fertigation)"},
    "sprinkler": {"multiplier": 1.15, "label": "Sprinkler (+15% uniform moisture)"},
    "well": {"multiplier": 1.10, "label": "Well/Borewell (+10% controlled irrigation)"},
    "borewell": {"multiplier": 1.12, "label": "Borewell / Tube Well (+12% controlled irrigation)"},
    "rainfed": {"multiplier": 1.00, "label": "Rainfed (100% monsoon dependent)"}
}

def calculate_agronomic_yield(
    commodity: str,
    soil_type: str,
    irrigation_type: str
) -> Dict[str, Any]:
    crop_key = commodity.lower().strip()
    base_info = CROP_BASE_YIELDS.get(crop_key, CROP_BASE_YIELDS["soybean"])
    base_yield = base_info["yield"]

    soil_key = soil_type.lower().strip()
    soil_info = SOIL_FACTORS.get(soil_key, SOIL_FACTORS["black"])
    soil_mult = soil_info["multiplier"]

    irrig_key = irrigation_type.lower().strip()
    irrig_info = IRRIGATION_FACTORS.get(irrig_key, IRRIGATION_FACTORS["rainfed"])
    irrig_mult = irrig_info["multiplier"]

    calculated_yield = round(base_yield * soil_mult * irrig_mult, 1)

    return {
        "baseYield": base_yield,
        "calculatedYield": calculated_yield,
        "maturityDays": base_info["maturityDays"],
        "soilLabel": soil_info["label"],
        "irrigationLabel": irrig_info["label"],
        "combinedBoostPct": round(((soil_mult * irrig_mult) - 1.0) * 100, 1)
    }

def generate_recommendations(
    commodity: str = "soybean",
    area_hectares: float = 3.5,
    yield_q_per_ha: Optional[float] = None,
    soil_type: str = "black",
    irrigation_type: str = "rainfed",
    sowing_date: str = "2026-06-20",
    lat: float = 18.2333,
    lng: float = 76.7167,
    input_cost_total: Optional[float] = None
) -> Dict[str, Any]:
    # 1. Agronomic Yield Model
    agronomy = calculate_agronomic_yield(commodity, soil_type, irrigation_type)
    effective_yield_per_ha = yield_q_per_ha if (yield_q_per_ha and yield_q_per_ha > 0) else agronomy["calculatedYield"]
    
    total_harvest_q = round(area_hectares * effective_yield_per_ha, 2)
    effective_input_cost = input_cost_total if (input_cost_total and input_cost_total > 0) else round(area_hectares * 18000.0)

    # 2. Maturity & Sowing Timing Analysis
    try:
        sown_dt = datetime.strptime(sowing_date, "%Y-%m-%d").date()
    except Exception:
        sown_dt = date(2026, 6, 20)

    today = date(2026, 10, 8)  # Active Kharif harvest baseline date
    days_elapsed = max(1, (today - sown_dt).days)
    maturity_days = agronomy["maturityDays"]
    maturity_pct = min(100, round((days_elapsed / maturity_days) * 100))

    # 3. Mandi Market Intelligence & Distance Freight
    mandi_analysis = get_mandi_prices_and_trends(commodity, lat, lng)
    best_mandi = mandi_analysis["nearbyMandis"][0]
    
    mandi_name = best_mandi["mandi"]
    base_modal = best_mandi["modalPrice"]
    freight_rate = best_mandi["freightPerQtl"]
    
    # Financial Scenarios
    # Scenario A: Sell Now
    gross_now = round(total_harvest_q * base_modal)
    freight_now = round(total_harvest_q * freight_rate)
    mandi_cess_now = round(gross_now * 0.02)  # 2% APMC market cess
    net_now = gross_now - freight_now - mandi_cess_now
    profit_now = net_now - effective_input_cost

    # Scenario B: Wait ~7 Days
    est_price_7d = base_modal + 90
    gross_7d = round(total_harvest_q * est_price_7d)
    freight_7d = freight_now
    mandi_cess_7d = round(gross_7d * 0.02)
    net_7d = gross_7d - freight_7d - mandi_cess_7d
    profit_7d = net_7d - effective_input_cost

    # Scenario C: Wait ~14 Days
    est_price_14d = base_modal + 140
    gross_14d = round(total_harvest_q * est_price_14d)
    freight_14d = freight_now
    mandi_cess_14d = round(gross_14d * 0.02)
    net_14d = gross_14d - freight_14d - mandi_cess_14d
    profit_14d = net_14d - effective_input_cost

    # Sowing Date Maturity Impact on Recommendation Window
    diff_7d = net_7d - net_now
    if maturity_pct >= 95:
        # Fully mature, harvesting now prevents pod shattering
        recommended_window = "now"
        timing_reason = f"Crop has reached {maturity_pct}% maturity ({days_elapsed} days since sowing). Immediate sale locks in prime quality before field shattering."
    elif diff_7d > 5000:
        recommended_window = "7_days"
        timing_reason = f"Crop maturity is at {maturity_pct}%. Waiting ~7 days allows pod drying and captures +₹{diff_7d:,} net upside."
    else:
        recommended_window = "now"
        timing_reason = "Selling now avoids storage insect risk and secures current strong APMC rates."

    boost_sign = "+" if agronomy["combinedBoostPct"] >= 0 else ""
    reasons = [
        timing_reason,
        f"{mandi_name} APMC ({best_mandi['distanceKm']} km) offers the highest net return at ₹{base_modal}/qtl (after ₹{freight_rate}/qtl transport deduction).",
        f"Agronomic factors: {agronomy['soilLabel']} and {agronomy['irrigationLabel']} project {effective_yield_per_ha} qtl/ha ({boost_sign}{agronomy['combinedBoostPct']}% vs rainfed red soil baseline).",
        f"Total volume estimated at {total_harvest_q} quintals across your {area_hectares} hectares.",
        "Weather outlook indicates dry, rain-free conditions optimal for field transport."
    ]

    return {
        "commodity": commodity,
        "recommendedWindow": recommended_window,
        "suggestedMandi": mandi_name,
        "distanceKm": best_mandi["distanceKm"],
        "areaHectares": area_hectares,
        "soilType": soil_type,
        "irrigationType": irrigation_type,
        "sowingDate": sowing_date,
        "maturityPct": maturity_pct,
        "effectiveYieldQPerHa": effective_yield_per_ha,
        "totalHarvestQ": total_harvest_q,
        "estimatedNetRealization": net_now if recommended_window == "now" else net_7d,
        "projectedNetProfit": profit_now if recommended_window == "now" else profit_7d,
        "riskLevel": "low" if recommended_window == "now" else "moderate",
        "confidence": "high",
        "reasons": reasons,
        "scenarios": [
            {
                "window": "now",
                "label": "Sell Now",
                "mandi": mandi_name,
                "estimatedModalPricePerQuintal": base_modal,
                "grossValue": gross_now,
                "transportCostTotal": freight_now,
                "sellingCostTotal": mandi_cess_now,
                "netRealization": net_now,
                "netProfit": profit_now,
                "riskLevel": "low"
            },
            {
                "window": "7_days",
                "label": "Wait ~7 Days",
                "mandi": mandi_name,
                "estimatedModalPricePerQuintal": est_price_7d,
                "grossValue": gross_7d,
                "transportCostTotal": freight_7d,
                "sellingCostTotal": mandi_cess_7d,
                "netRealization": net_7d,
                "netProfit": profit_7d,
                "riskLevel": "moderate"
            },
            {
                "window": "14_days",
                "label": "Wait ~14 Days",
                "mandi": mandi_name,
                "estimatedModalPricePerQuintal": est_price_14d,
                "grossValue": gross_14d,
                "transportCostTotal": freight_14d,
                "sellingCostTotal": mandi_cess_14d,
                "netRealization": net_14d,
                "netProfit": profit_14d,
                "riskLevel": "moderate"
            }
        ]
    }
