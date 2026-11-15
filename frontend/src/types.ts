export interface User {
  id: string;
  name: string;
  phoneOrEmail: string;
  preferredLanguage: string;
  isDemo?: boolean;
}

export interface Farm {
  id: string;
  userId?: string;
  name: string;
  crop: string;
  commodity: string;
  state: string;
  district: string;
  village: string;
  lat: number;
  lng: number;
  areaHectares: number;
  sowingDate: string;
  expectedHarvestDate?: string;
  soilType: string;
  irrigationType: string;
  inputCostPerHa: number;
  expectedYieldQPerHa?: number;
  totalHarvestQ?: number;
  fieldGeoJson?: any;
}

export interface MandiItem {
  mandi: string;
  district: string;
  state: string;
  distanceKm: number;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalsTonnes: number;
  freightPerQtl: number;
  netEstimatePerQtl: number;
  lat: number;
  lng: number;
  trend: 'rising' | 'stable' | 'softening';
}

export interface PriceHistoryItem {
  date: string;
  fullDate: string;
  modalPrice: number;
  arrivals: number;
}

export interface MarketData {
  commodity: string;
  headlineMandi: string;
  headlineModalPrice: number;
  nearbyMandis: MandiItem[];
  priceHistory: PriceHistoryItem[];
  updatedAt: string;
  source: string;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempMaxC: number;
  tempMinC: number;
  rainfallMm: number;
  rainProbability: number;
  weatherCode: number;
  description: string;
  isHighRainRisk: boolean;
}

export interface WeatherData {
  source: string;
  lat: number;
  lng: number;
  hasRainRisk: boolean;
  days: WeatherDay[];
  generatedAt: string;
}

export interface SellingScenario {
  window: string;
  label: string;
  mandi: string;
  estimatedModalPricePerQuintal: number;
  grossValue: number;
  transportCostTotal: number;
  sellingCostTotal: number;
  netRealization: number;
  netProfit: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface RecommendationData {
  commodity: string;
  recommendedWindow: 'now' | '7_days' | '14_days';
  suggestedMandi: string;
  distanceKm: number;
  totalHarvestQ: number;
  estimatedNetRealization: number;
  projectedNetProfit: number;
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: 'high' | 'moderate' | 'low';
  reasons: string[];
  scenarios: SellingScenario[];
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success';
  isRead: boolean;
  timestamp: string;
}
