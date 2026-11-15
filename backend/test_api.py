import asyncio
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_all():
    print("1. Testing /api/health...")
    res = client.get("/api/health")
    assert res.status_code == 200, res.text
    print("   Health response:", res.json())

    print("2. Testing /api/auth/login with demo credentials...")
    res = client.post("/api/auth/login", json={"phoneOrEmail": "9876543210", "password": "demo"})
    assert res.status_code == 200, res.text
    token = res.json()["token"]
    print("   JWT Token obtained successfully.")

    headers = {"Authorization": f"Bearer {token}"}

    print("3. Testing /api/farms...")
    res = client.get("/api/farms", headers=headers)
    assert res.status_code == 200, res.text
    farm = res.json()["farm"]
    print(f"   Active Farm: {farm['name']}, {farm['district']} ({farm['crop']})")

    print("4. Testing /api/market (APMC Agmarknet prices)...")
    res = client.get("/api/market?commodity=soybean&lat=18.2333&lng=76.7167")
    assert res.status_code == 200, res.text
    mkt = res.json()["data"]
    print(f"   Top Mandi: {mkt['headlineMandi']} @ ₹{mkt['headlineModalPrice']}/qtl (Mandis tracked: {len(mkt['nearbyMandis'])})")

    print("5. Testing /api/weather (Open-Meteo Integration)...")
    res = client.get("/api/weather?lat=18.2333&lng=76.7167&days=7")
    assert res.status_code == 200, res.text
    weather = res.json()["data"]
    print(f"   Weather source: {weather['source']} (Forecast days: {len(weather['days'])})")

    print("6. Testing /api/recommendations (Sell Now vs Wait Decision Engine)...")
    res = client.post("/api/recommendations", json={
        "commodity": "soybean",
        "areaHectares": 3.5,
        "yieldQPerHa": 19.5,
        "lat": 18.2333,
        "lng": 76.7167,
        "inputCostTotal": 63000
    })
    assert res.status_code == 200, res.text
    rec = res.json()["data"]
    print(f"   Recommendation: {rec['recommendedWindow']} | Net Realization: ₹{rec['estimatedNetRealization']:,}")

    print("7. Testing /api/notifications...")
    res = client.get("/api/notifications", headers=headers)
    assert res.status_code == 200, res.text
    notifs = res.json()["notifications"]
    print(f"   Notifications count: {len(notifs)}")

    print("8. Testing /api/ai (Marathi/Hindi/English Advisor)...")
    res = client.post("/api/ai", json={
        "query": "सोयाबीनचा आजचा दर काय आहे आणि कधी विकू?",
        "language": "mr",
        "farmContext": {"crop": "Soybean", "mandi": "Latur", "currentPrice": 4380}
    })
    assert res.status_code == 200, res.text
    ai_data = res.json()["data"]
    print("   AI Marathi Reply preview:\n", ai_data["reply"][:150] + "...")

    print("\n✅ ALL 8 BACKEND INTEGRATION TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_all()
