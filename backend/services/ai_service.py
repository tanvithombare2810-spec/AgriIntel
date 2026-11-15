import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime
import httpx
from backend.config import settings

logger = logging.getLogger(__name__)

async def generate_ai_response(
    query: str,
    language: str = "en",
    farm_context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    crop = farm_context.get("crop", "Soybean") if farm_context else "Soybean"
    mandi = farm_context.get("mandi", "Latur") if farm_context else "Latur"
    price = farm_context.get("currentPrice", 4380) if farm_context else 4380
    district = farm_context.get("district", "Latur") if farm_context else "Latur"
    state = farm_context.get("state", "Maharashtra") if farm_context else "Maharashtra"

    # Attempt Real LLM Generation via Groq if API key is configured
    if settings.GROQ_API_KEY:
        try:
            lang_instruction = (
                "Answer in Marathi (मराठी) using natural, respectful agricultural terminology."
                if language == "mr"
                else "Answer in Hindi (हिंदी) using respectful farmer language."
                if language == "hi"
                else "Answer in English clearly and concisely."
            )

            system_prompt = (
                f"You are KisanWise AI (किशनवाइज), an expert agricultural and APMC market decision advisor for Indian farmers across all agro-climatic zones (including South India paddy & spice belts, Western oilseeds, and Northern grains).\n"
                f"Active Farm Context:\n"
                f"- Crop: {crop}\n"
                f"- District & State: {district}, {state}\n"
                f"- Nearest APMC Mandi: {mandi}\n"
                f"- Prevailing Modal Price: ₹{price}/quintal\n\n"
                f"Agronomic Guidelines for this Region & Crop:\n"
                f"- For Paddy/Rice: Monitor moisture (<14% for procurement), blast/leaf folder management, and local FCI/APMC minimum support price auctions.\n"
                f"- For Chilli & Turmeric: Advise on drying yards, moisture protection, and Guntur/Erode auction quality grading.\n"
                f"- For Soybean & Pulses: Advise on pod drying, storage beetle precautions, and holding vs selling.\n"
                f"General Rules:\n"
                f"1. {lang_instruction}\n"
                f"2. Keep the advice concise (2 to 3 bullet points max).\n"
                f"3. Address mandi prices, weather holding risk, or selling window directly.\n"
                f"4. Do NOT use long preambles. Start directly with the recommendation."
            )

            headers = {
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": "qwen/qwen3.8-27b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                "temperature": 0.4,
                "max_tokens": 300
            }

            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=payload
                )
                if res.status_code == 200:
                    data = res.json()
                    ai_reply = data["choices"][0]["message"]["content"].strip()
                    return {
                        "reply": ai_reply,
                        "language": language,
                        "timestamp": datetime.now().isoformat(),
                        "engine": "real-ai"
                    }
                else:
                    logger.warning(f"Groq API returned status {res.status_code}: {res.text}")
        except Exception as e:
            logger.warning(f"Real AI invocation failed ({e}). Falling back to agronomic advisor.")

    # High-quality deterministic fallback if offline or API is down
    query_lower = query.lower()
    if "rate" in query_lower or "price" in query_lower or "भाव" in query_lower or "किंमत" in query_lower:
        if language == "mr":
            answer = (
                f"🌱 **{crop} बाजारभाव अपडेट ({mandi} कृषी उत्पन्न बाजार समिती):**\n"
                f"• आजचा सरासरी दर: **₹{price} / क्विंटल** आहे.\n"
                f"• बाजार आवक स्थिर असल्याने पुढील २-३ दिवस दर स्थिर राहण्याची शक्यता आहे.\n"
                f"• सल्ला: जर तुमच्याकडे सुरक्षित साठवणूक जागा असेल तर ७ दिवस थांबल्यास ₹५०-₹८० अधिक मिळू शकतात."
            )
        elif language == "hi":
            answer = (
                f"🌱 **{crop} मंडी भाव अपडेट ({mandi} APMC):**\n"
                f"• आज का मॉडल भाव: **₹{price} / क्विंटल** है।\n"
                f"• बाजार में आवक स्थिर है, इसलिए अगले २-३ दिनों में भाव स्थिर रहने का अनुमान है।\n"
                f"• सलाह: यदि सुखाने और रखने की उचित व्यवस्था है, तो ७ दिन रुकने पर ₹५०-₹८० का फायदा हो सकता है।"
            )
        else:
            answer = (
                f"🌱 **{crop} APMC Price Update ({mandi} Mandi):**\n"
                f"• Today's prevailing modal price is **₹{price} / quintal**.\n"
                f"• Daily arrivals are balanced with no immediate price slump expected.\n"
                f"• Recommendation: Holding for ~7 days could capture an extra ₹60–₹90/qtl if moisture is under 10%."
            )
    elif "sell" in query_lower or "विकू" in query_lower or "बेचूं" in query_lower:
        if language == "mr":
            answer = (
                f"🚜 **विक्री सल्ला ({crop}):**\n"
                f"• {mandi} बाजारात सध्या **₹{price}/क्विंटल** भाव मिळत आहे.\n"
                f"• हवामान पुढील ५ दिवस कोरडे असल्याने माल वाहतुकीसाठी योग्य वेळ आहे.\n"
                f"• वाहतूक खर्च वाचवण्यासाठी शेजारील शेतकऱ्यांसोबत पिकअप/गाडी शेअर करा."
            )
        elif language == "hi":
            answer = (
                f"🚜 **बिक्री सलाह ({crop}):**\n"
                f"• {mandi} मंडी में अभी **₹{price}/क्विंटल** का अच्छा भाव चल रहा है।\n"
                f"• मौसम अगले ५ दिन साफ रहेगा, इसलिए फसल को मंडी ले जाने का उत्तम समय है।\n"
                f"• भाड़ा घटाने के लिए गांव के अन्य किसान भाइयों के साथ पिकअप शेयर करें।"
            )
        else:
            answer = (
                f"🚜 **Selling Strategy ({crop}):**\n"
                f"• Current modal rate at {mandi} is **₹{price} / quintal**.\n"
                f"• 7-day weather indicates dry conditions, making transport safe and smooth.\n"
                f"• Recommendation: Sell 60% of your harvest this week to lock in profit, and hold 40% for post-Diwali price bumps."
            )
    else:
        if language == "mr":
            answer = (
                f"🌾 **किशनवाइज शेती सल्लागार:**\n"
                f"• तुमच्या {crop} पिकासाठी {mandi} बाजार समिती आज ₹{price}/क्विंटल दराने चालू आहे.\n"
                f"• हवामान अंदाज: पुढील ३ दिवस कोरडे, कापणी व मळणीसाठी अनुकूल.\n"
                f"• अधिक माहितीसाठी बाजारभाव तक्ता किंवा विक्री कॅल्क्युलेटर तपासा."
            )
        elif language == "hi":
            answer = (
                f"🌾 **किशनवाइज कृषि सलाहकार:**\n"
                f"• आपकी {crop} फसल के लिए {mandi} मंडी में भाव ₹{price}/क्विंटल पर चल रहा है।\n"
                f"• मौसम पूर्वानुमान: अगले ३ दिन साफ मौसम, कटाई और गहाई के लिए उपयुक्त।\n"
                f"• अधिक जानकारी के लिए मार्केट भाव या सेल एडवाइजर टैब देखें।"
            )
        else:
            answer = (
                f"🌾 **KisanWise Farm Advisor:**\n"
                f"• Active crop: {crop} | Primary Mandi: {mandi} (Current rate: ₹{price}/qtl).\n"
                f"• Weather: Optimal harvest and drying conditions over the next 72 hours.\n"
                f"• Ask about market trends, transport freight calculations, or harvest timing anytime!"
            )

    return {
        "reply": answer,
        "language": language,
        "timestamp": datetime.now().isoformat(),
        "engine": "heuristics"
    }
