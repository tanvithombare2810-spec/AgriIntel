import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CloudRain, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { RecommendationData, WeatherData, MarketData, Farm } from '../types';
import { Language, translations } from '../i18n';
import { NavTab } from '../components/BottomNav';

interface DashboardViewProps {
  recommendation: RecommendationData | null;
  weather: WeatherData | null;
  market: MarketData | null;
  farm: Farm | null;
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recommendation,
  weather,
  market,
  farm,
  language,
  onNavigate
}) => {
  const t = translations[language];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const isWait = recommendation?.recommendedWindow === '7_days';
  const headlinePrice = market?.headlineModalPrice || 4380;
  const netEarnings = recommendation?.estimatedNetRealization || 286500;
  const mandiName = recommendation?.suggestedMandi || 'Latur';

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner: Daily Decision Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b6e47] to-[#124d31] text-white p-5 sm:p-6 shadow-lg border border-primary/30">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{t.dashboard.decisionCardTitle}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-200/90 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Today, 07:00 AM
          </span>
        </div>

        <div className="mt-1">
          <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
            {isWait ? t.dashboard.waitDays : t.dashboard.sellNow}
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            {isWait
              ? `Hold harvest for 7 days to capture +₹${((recommendation?.scenarios[1]?.netRealization || 0) - (recommendation?.scenarios[0]?.netRealization || 0)).toLocaleString('en-IN')} extra upside at ${mandiName} APMC.`
              : `Current APMC rates lock in safe profit with zero rain vulnerability.`}
          </p>
        </div>

        {/* Big Net Realization Number */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-emerald-200/80 font-semibold">
              {t.dashboard.netRealization}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold font-outfit tabular-nums tracking-tight text-white mt-0.5">
              {formatCurrency(netEarnings)}
            </p>
          </div>
          <button
            onClick={() => onNavigate('sell')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{t.dashboard.optimizeSellBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Indicators Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mandi Rate Card */}
        <button 
          type="button"
          onClick={() => onNavigate('market')}
          className="text-left w-full p-4 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{mandiName} Mandi</span>
            <TrendingUp className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-outfit text-xl font-bold text-foreground tabular-nums">
            ₹{headlinePrice.toLocaleString('en-IN')}
            <span className="text-xs font-medium text-muted-foreground ml-1">/ qtl</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>↑ High demand</span>
            <span className="text-muted-foreground font-normal">• 18 km away</span>
          </p>
        </button>

        {/* Harvest Volume Card */}
        <button 
          type="button"
          onClick={() => onNavigate('farm')}
          className="text-left w-full p-4 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{t.dashboard.totalYield}</span>
            <IndianRupee className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-outfit text-xl font-bold text-foreground tabular-nums">
            {farm?.totalHarvestQ || 68.3}
            <span className="text-xs font-medium text-muted-foreground ml-1">qtl</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {farm?.areaHectares || 3.5} ha • {farm?.crop || 'Soybean'}
          </p>
        </button>
      </div>

      {/* 3-Day Weather Horizon */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <CloudRain className="w-4 h-4" />
            </div>
            <h3 className="font-outfit font-bold text-sm text-foreground">
              {t.dashboard.weatherAlert}
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Safe for Hauling
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {weather?.days.slice(0, 3).map((d) => (
            <div
              key={d.date}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                d.isHighRainRisk
                  ? 'bg-red-50/60 border-red-200 text-red-900'
                  : 'bg-muted/40 border-border/80 text-foreground'
              }`}
            >
              <p className="text-[11px] font-bold uppercase text-muted-foreground">
                {d.dayName}
              </p>
              <p className="text-base font-outfit font-extrabold my-0.5 tabular-nums">
                {Math.round(d.tempMaxC)}°C
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {d.rainfallMm > 0 ? `${d.rainfallMm} mm rain` : 'Clear sky'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Recommendation */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
        <h3 className="font-outfit font-bold text-sm text-foreground mb-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>{t.dashboard.reasonsTitle}</span>
        </h3>
        <div className="space-y-2.5">
          {recommendation?.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
