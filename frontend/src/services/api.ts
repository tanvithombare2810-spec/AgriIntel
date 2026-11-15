import { Farm, MarketData, WeatherData, RecommendationData, AppNotification, User } from '../types';

const TOKEN_KEY = 'kisanwise_jwt_token';
const USER_KEY = 'kisanwise_user_session';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: (): User | null => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setUser: (u: User) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  removeUser: () => localStorage.removeItem(USER_KEY)
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: async (phoneOrEmail: string, password: string) => {
    return apiFetch<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneOrEmail, password })
    });
  },
  register: async (name: string, phoneOrEmail: string, password: string, preferredLanguage: string = 'mr') => {
    return apiFetch<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phoneOrEmail, password, preferredLanguage })
    });
  },
  demoLogin: async () => {
    return apiFetch<{ success: boolean; token: string; user: User }>('/api/auth/demo', {
      method: 'POST'
    });
  },
  getProfile: async () => {
    return apiFetch<User>('/api/auth/me');
  },

  // Farm
  getFarm: async () => {
    return apiFetch<{ success: boolean; farm: Farm }>('/api/farms');
  },
  resetDemoFarm: async () => {
    return apiFetch<{ success: boolean; farm: Farm }>('/api/farms/reset-demo', {
      method: 'POST'
    });
  },
  saveFarm: async (farm: Partial<Farm>) => {
    return apiFetch<{ success: boolean; farm: Farm }>('/api/farms', {
      method: 'POST',
      body: JSON.stringify(farm)
    });
  },

  // Market & APMC
  getMarketData: async (commodity: string = 'soybean', lat: number = 18.2333, lng: number = 76.7167) => {
    return apiFetch<{ success: boolean; data: MarketData }>(
      `/api/market?commodity=${encodeURIComponent(commodity)}&lat=${lat}&lng=${lng}`
    );
  },

  // Weather
  getWeather: async (lat: number = 18.2333, lng: number = 76.7167, days: number = 7) => {
    return apiFetch<{ success: boolean; data: WeatherData }>(
      `/api/weather?lat=${lat}&lng=${lng}&days=${days}`
    );
  },

  // Recommendations & Sell
  getRecommendations: async (params: {
    commodity: string;
    areaHectares: number;
    yieldQPerHa?: number;
    soilType?: string;
    irrigationType?: string;
    sowingDate?: string;
    lat: number;
    lng: number;
    inputCostTotal?: number;
  }) => {
    return apiFetch<{ success: boolean; data: RecommendationData }>('/api/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        commodity: params.commodity,
        areaHectares: params.areaHectares,
        yieldQPerHa: params.yieldQPerHa,
        soilType: params.soilType || 'black',
        irrigationType: params.irrigationType || 'rainfed',
        sowingDate: params.sowingDate || '2026-06-20',
        lat: params.lat,
        lng: params.lng,
        inputCostTotal: params.inputCostTotal
      })
    });
  },

  // Notifications
  getNotifications: async () => {
    return apiFetch<{ success: boolean; notifications: AppNotification[] }>('/api/notifications');
  },
  markNotificationRead: async (notifId: string) => {
    return apiFetch<{ success: boolean }>(`/api/notifications/${notifId}/read`, {
      method: 'POST'
    });
  },

  // AI Advisor
  askAi: async (query: string, language: string = 'en', farmContext?: any) => {
    return apiFetch<{ success: boolean; data: { reply: string; language: string; timestamp: string } }>(
      '/api/ai',
      {
        method: 'POST',
        body: JSON.stringify({ query, language, farmContext })
      }
    );
  }
};
