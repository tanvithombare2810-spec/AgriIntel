export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  tabs: {
    dashboard: string;
    farm: string;
    market: string;
    sell: string;
    ask: string;
  };
  dashboard: {
    title: string;
    decisionCardTitle: string;
    sellNow: string;
    waitDays: string;
    netRealization: string;
    modalPrice: string;
    totalYield: string;
    weatherAlert: string;
    quickStats: string;
    reasonsTitle: string;
    viewMandiBtn: string;
    optimizeSellBtn: string;
  };
  farm: {
    title: string;
    parcelMap: string;
    soilType: string;
    irrigation: string;
    area: string;
    sowingDate: string;
    cropHealth: string;
    ndviStatus: string;
    yieldForecast: string;
    healthyZones: string;
  };
  market: {
    title: string;
    mandiComparison: string;
    trend30Days: string;
    modalRate: string;
    arrivals: string;
    distance: string;
    freightDeduction: string;
    netPrice: string;
  };
  sell: {
    title: string;
    harvestSlider: string;
    nowVsWait: string;
    grossIncome: string;
    freightCost: string;
    mandiFee: string;
    netProfit: string;
    recommendationBadge: string;
  };
  ask: {
    title: string;
    placeholder: string;
    send: string;
    voiceBtn: string;
    listening: string;
    quickQueriesTitle: string;
    sample1: string;
    sample2: string;
    sample3: string;
  };
  notifications: {
    title: string;
    empty: string;
    markAllRead: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    phoneOrEmail: string;
    password: string;
    loginBtn: string;
    registerBtn: string;
    demoBtn: string;
    switchRegister: string;
    switchLogin: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KisanWise",
    tagline: "Farm Decision Assistant",
    tabs: {
      dashboard: "Dashboard",
      farm: "My Farm",
      market: "Mandi Rates",
      sell: "Sell Advisor",
      ask: "Ask AI"
    },
    dashboard: {
      title: "Today's Action & Alerts",
      decisionCardTitle: "Optimal Selling Window",
      sellNow: "Sell Now",
      waitDays: "Wait ~7 Days",
      netRealization: "Estimated Net Realization",
      modalPrice: "Prevailing Modal Rate",
      totalYield: "Est. Total Harvest",
      weatherAlert: "Weather & Rain Horizon",
      quickStats: "Key Harvest Indicators",
      reasonsTitle: "Why this recommendation?",
      viewMandiBtn: "Compare Mandis",
      optimizeSellBtn: "Open Profit Calculator"
    },
    farm: {
      title: "Field Map & Satellite Crop Health",
      parcelMap: "Registered Parcel Boundary",
      soilType: "Soil Type",
      irrigation: "Irrigation",
      area: "Farm Area",
      sowingDate: "Sowing Date",
      cropHealth: "Satellite NDVI Vigor",
      ndviStatus: "Peak Vigor (0.74 NDVI)",
      yieldForecast: "ML Yield Projection",
      healthyZones: "88% Healthy Vegetation"
    },
    market: {
      title: "APMC Mandi Live Comparison",
      mandiComparison: "Nearby Mandi Rates & Freight Deductions",
      trend30Days: "30-Day Agmarknet Price Trajectory",
      modalRate: "Modal Rate",
      arrivals: "Daily Arrivals",
      distance: "Distance",
      freightDeduction: "Freight / qtl",
      netPrice: "Net in Hand"
    },
    sell: {
      title: "Sell Timing & Profit Optimizer",
      harvestSlider: "Adjust Available Harvest (Quintals)",
      nowVsWait: "Now vs Wait 7/14 Days Scenarios",
      grossIncome: "Gross Mandi Value",
      freightCost: "Road Freight Deduction",
      mandiFee: "2% Mandi Cess & Handling",
      netProfit: "Net Take-Home Profit",
      recommendationBadge: "Recommended Window"
    },
    ask: {
      title: "Multilingual Voice AI Advisor",
      placeholder: "Ask about mandi prices, weather risk, or selling timing…",
      send: "Send",
      voiceBtn: "Voice",
      listening: "Listening… speak in Marathi, Hindi, or English",
      quickQueriesTitle: "Suggested Questions:",
      sample1: "What is today's soybean rate in Latur?",
      sample2: "Should I sell now or wait 7 days?",
      sample3: "Is rain expected this week during harvest?"
    },
    notifications: {
      title: "Alerts & Notifications",
      empty: "No new notifications",
      markAllRead: "Mark all as read"
    },
    auth: {
      loginTitle: "Welcome to KisanWise",
      loginSubtitle: "Sign in with your mobile number and password",
      phoneOrEmail: "Mobile Number or Email",
      password: "Password",
      loginBtn: "Sign In",
      registerBtn: "Create Farmer Account",
      demoBtn: "Explore Demo Farm (Instant)",
      switchRegister: "Don't have an account? Register",
      switchLogin: "Already registered? Sign in"
    }
  },
  mr: {
    appName: "किशनवाइज",
    tagline: "स्मार्ट शेती सल्लागार",
    tabs: {
      dashboard: "डॅशबोर्ड",
      farm: "माझे शेत",
      market: "बाजारभाव",
      sell: "विक्री सल्ला",
      ask: "कृषि AI"
    },
    dashboard: {
      title: "आजचा कृती आराखडा व सूचना",
      decisionCardTitle: "योग्य विक्री वेळ",
      sellNow: "आत्ताच विक्री करा",
      waitDays: "७ दिवस थांबा",
      netRealization: "अंदाजे निव्वळ मिळकत",
      modalPrice: "चालू बाजारभाव",
      totalYield: "अंदाजे एकूण उत्पादन",
      weatherAlert: "हवामान अंदाज व पावसाची शक्यता",
      quickStats: "महत्त्वाचे पीक निर्देशांक",
      reasonsTitle: "या सल्ल्यामागील कारणे:",
      viewMandiBtn: "बाजारभाव तपासा",
      optimizeSellBtn: "नफा कॅल्क्युलेटर उघडा"
    },
    farm: {
      title: "शेत नकाशा व उपग्रह पीक आरोग्य",
      parcelMap: "नोंदणीकृत शेत सीमा",
      soilType: "मातीचा प्रकार",
      irrigation: "पाणीपुरवठा",
      area: "शेत क्षेत्र",
      sowingDate: "पेरणी तारीख",
      cropHealth: "उपग्रह NDVI निर्देशांक",
      ndviStatus: "उत्तम वाढ (०.७४ NDVI)",
      yieldForecast: "अंदाजित एकरी उत्पादन",
      healthyZones: "८८% पीक निरोगी"
    },
    market: {
      title: "कृषी उत्पन्न बाजार समिती दर तुलना",
      mandiComparison: "जवळपासचे बाजार आणि वाहतूक खर्च",
      trend30Days: "गेल्या ३० दिवसांचा दर आलेख",
      modalRate: "सरासरी दर",
      arrivals: "दैनंदिन आवक",
      distance: "अंतर",
      freightDeduction: "वाहतूक खर्च/क्विंटल",
      netPrice: "हातात मिळणारा दर"
    },
    sell: {
      title: "विक्री वेळ व नफा कॅल्क्युलेटर",
      harvestSlider: "विक्रीयोग्य प्रमाण बदला (क्विंटल)",
      nowVsWait: "आत्ता विक्री वि. ७/१४ दिवस प्रतीक्षा",
      grossIncome: "एकूण बाजार मूल्य",
      freightCost: "वाहतूक भाडे वजावट",
      mandiFee: "२% बाजार समिती फी व हमाली",
      netProfit: "निव्वळ हातात उरणारा नफा",
      recommendationBadge: "शिफारस केलेली वेळ"
    },
    ask: {
      title: "मराठी व्हॉईस AI शेती सल्लागार",
      placeholder: "बाजारभाव, पाऊस किंवा विक्रीबाबत मराठीत बोला किंवा विचारा…",
      send: "पाठवा",
      voiceBtn: "बोला",
      listening: "ऐकत आहे… मराठीत बोला",
      quickQueriesTitle: "वारंवार विचारले जाणारे प्रश्न:",
      sample1: "लातूर बाजारात आज सोयाबीनचा भाव काय आहे?",
      sample2: "मी माल आत्ता विकू की ७ दिवस थांबू?",
      sample3: "या आठवड्यात काढणीसाठी पाऊस येईल का?"
    },
    notifications: {
      title: "महत्त्वाच्या सूचना व इशारे",
      empty: "कोणतीही नवीन सूचना नाही",
      markAllRead: "सर्व वाचले म्हणून खूण करा"
    },
    auth: {
      loginTitle: "किशनवाइज मध्ये आपले स्वागत आहे",
      loginSubtitle: "आपला मोबाईल नंबर व पासवर्ड टाकून लॉगिन करा",
      phoneOrEmail: "मोबाईल नंबर किंवा ईमेल",
      password: "पासवर्ड",
      loginBtn: "लॉगिन करा",
      registerBtn: "नवीन खाते उघडा",
      demoBtn: "डेमो शेत पाहा (विना लॉगिन)",
      switchRegister: "खाते नाही का? नोंदणी करा",
      switchLogin: "आधीच खाते आहे? लॉगिन करा"
    }
  },
  hi: {
    appName: "किसानवाइज",
    tagline: "स्मार्ट कृषि सलाहकार",
    tabs: {
      dashboard: "डैशबोर्ड",
      farm: "मेरा खेत",
      market: "मंडी भाव",
      sell: "बिक्री सलाह",
      ask: "कृषि AI"
    },
    dashboard: {
      title: "आज की कार्ययोजना व अलर्ट",
      decisionCardTitle: "फसल बेचने का सही समय",
      sellNow: "अभी बेचें",
      waitDays: "७ दिन रुकें",
      netRealization: "अनुमानित शुद्ध आय",
      modalPrice: "मौजूदा मॉडल भाव",
      totalYield: "अनुमानित कुल पैदावार",
      weatherAlert: "मौसम पूर्वानुमान व बारिश अलर्ट",
      quickStats: "प्रमुख फसल आंकड़े",
      reasonsTitle: "इस सलाह के मुख्य कारण:",
      viewMandiBtn: "मंडी भाव देखें",
      optimizeSellBtn: "मुनाफा कैलकुलेटर खोलें"
    },
    farm: {
      title: "खेत का नक्शा और सैटेलाइट फसल स्वास्थ्य",
      parcelMap: "पंजीकृत खेत की सीमा",
      soilType: "मिट्टी का प्रकार",
      irrigation: "सिंचाई का साधन",
      area: "खेत का रकबा",
      sowingDate: "बुवाई की तारीख",
      cropHealth: "सैटेलाइट NDVI सूचकांक",
      ndviStatus: "उत्तम विकास (०.७४ NDVI)",
      yieldForecast: "अनुमानित पैदावार",
      healthyZones: "८८% फसल स्वस्थ"
    },
    market: {
      title: "APMC मंडी लाइव तुलना",
      mandiComparison: "आसपास की मंडियों के भाव और भाड़ा कटौती",
      trend30Days: "पिछले ३० दिनों का मंडी भाव ग्राफ",
      modalRate: "मॉडल भाव",
      arrivals: "दैनिक आवक",
      distance: "दूरी",
      freightDeduction: "भाड़ा/क्विंटल",
      netPrice: "हाथ में मिलने वाला भाव"
    },
    sell: {
      title: "बिक्री समय और शुद्ध मुनाफा कैलकुलेटर",
      harvestSlider: "फसल मात्रा बदलें (क्विंटल)",
      nowVsWait: "अभी बिक्री बनाम ७/१४ दिन प्रतीक्षा",
      grossIncome: "कुल मंडी मूल्य",
      freightCost: "सड़क भाड़ा कटौती",
      mandiFee: "२% मंडी शुल्क व पल्लेदारी",
      netProfit: "शुद्ध हाथ में आने वाला मुनाफा",
      recommendationBadge: "अनुशंसित समय"
    },
    ask: {
      title: "हिंदी वॉइस AI कृषि सलाहकार",
      placeholder: "मंडी भाव, बारिश या फसल बिक्री के बारे में पूछें…",
      send: "भेजें",
      voiceBtn: "बोलें",
      listening: "सुन रहे हैं… हिंदी में बोलें",
      quickQueriesTitle: "सुझाए गए सवाल:",
      sample1: "लातूर मंडी में आज सोयाबीन का क्या भाव है?",
      sample2: "मुझे फसल अभी बेचनी चाहिए या ७ दिन रुकना चाहिए?",
      sample3: "क्या इस सप्ताह कटाई के समय बारिश का खतरा है?"
    },
    notifications: {
      title: "अलर्ट और सूचनाएं",
      empty: "कोई नया अलर्ट नहीं",
      markAllRead: "सभी को पढ़ा हुआ मार्क करें"
    },
    auth: {
      loginTitle: "किसानवाइज में आपका स्वागत है",
      loginSubtitle: "अपना मोबाइल नंबर और पासवर्ड डालकर लॉगिन करें",
      phoneOrEmail: "मोबाइल नंबर या ईमेल",
      password: "पासवर्ड",
      loginBtn: "लॉगिन करें",
      registerBtn: "नया खाता बनाएं",
      demoBtn: "डेमो खेत देखें (सीधे प्रवेश)",
      switchRegister: "खाता नहीं है? रजिस्टर करें",
      switchLogin: "पहले से खाता है? लॉगिन करें"
    }
  }
};
