import React, { useState } from 'react';
import { 
  TrendingUp, 
  Truck, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Filter
} from 'lucide-react';
import { MarketData, MandiItem } from '../types';
import { Language, translations } from '../i18n';

interface MarketViewProps {
  market: MarketData | null;
  selectedCommodity: string;
  onSelectCommodity: (commodity: string) => void;
  language: Language;
}

export const MarketView: React.FC<MarketViewProps> = ({
  market,
  selectedCommodity,
  onSelectCommodity,
  language
}) => {
  const t = translations[language];

  const commodities = [
    { id: 'paddy', label: 'Paddy / Rice (भात / நெல் / ধান)' },
    { id: 'chilli', label: 'Chilli (मिरची / மிளகாய் / मिर्च)' },
    { id: 'turmeric', label: 'Turmeric (हळद / மஞ்சள் / हल्दी)' },
    { id: 'groundnut', label: 'Groundnut (भुईमूग / வேர்க்கடலை)' },
    { id: 'ragi', label: 'Ragi (नाचणी / கேழ்வரகு / रागी)' },
    { id: 'soybean', label: 'Soybean (सोयाबीन)' },
    { id: 'cotton', label: 'Cotton (कापूस / பருத்தி)' },
    { id: 'tur', label: 'Tur / Arhar (तूर)' },
    { id: 'wheat', label: 'Wheat (गहू / गेहूं)' },
    { id: 'onion', label: 'Onion (कांदा / प्याज)' },
    { id: 'maize', label: 'Maize (मका / मक्का)' },
    { id: 'jowar', label: 'Jowar (ज्वारी)' },
    { id: 'gram', label: 'Gram / Chana (हरभरा)' },
    { id: 'sugarcane', label: 'Sugarcane (ऊस)' }
  ];

  const priceHistory = market?.priceHistory || [];
  const minPrice = priceHistory.length ? Math.min(...priceHistory.map(p => p.modalPrice)) : 4200;
  const maxPrice = priceHistory.length ? Math.max(...priceHistory.map(p => p.modalPrice)) : 4550;
  const range = maxPrice - minPrice || 1;

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Commodity Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none overscroll-contain">
        {commodities.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCommodity(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCommodity === c.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-card text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 30-Day Agmarknet Trend Card */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-outfit font-bold text-sm text-foreground">
              {t.market.trend30Days}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Agmarknet APMC Modal Prices (Past 30 Days)
            </p>
          </div>
          <span className="text-xs font-bold font-outfit text-primary tabular-nums">
            ₹{market?.headlineModalPrice || 4380} / qtl
          </span>
        </div>

        {/* Micro SVG Sparkline / Bar Chart */}
        <div className="h-32 w-full pt-4 flex items-end justify-between gap-1">
          {priceHistory.map((item, idx) => {
            const heightPercent = Math.max(15, Math.round(((item.modalPrice - minPrice) / range) * 100));
            const isLatest = idx === priceHistory.length - 1;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all ${
                    isLatest
                      ? 'bg-primary'
                      : 'bg-primary/30 group-hover:bg-primary/70'
                  }`}
                />
                {/* Tooltip on hover/touch */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded-md whitespace-nowrap z-20">
                  {item.date}: ₹{item.modalPrice}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2 border-t border-border pt-1 font-mono">
          <span>{priceHistory[0]?.date || '30 days ago'}</span>
          <span>15 days ago</span>
          <span className="font-bold text-primary">{priceHistory[priceHistory.length - 1]?.date || 'Today'}</span>
        </div>
      </div>

      {/* Mandi Rate Comparison Table */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
        <h3 className="font-outfit font-bold text-sm text-foreground mb-3">
          {t.market.mandiComparison}
        </h3>

        <div className="space-y-2.5">
          {market?.nearbyMandis.map((mandi) => {
            const isRising = mandi.trend === 'rising';
            const isSoftening = mandi.trend === 'softening';

            return (
              <div
                key={mandi.mandi}
                className="p-3 rounded-2xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-outfit font-bold text-sm text-foreground">
                      {mandi.mandi} APMC
                    </h4>
                    {isRising && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center">
                        <ArrowUpRight className="w-3 h-3" /> Rising
                      </span>
                    )}
                    {isSoftening && (
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center">
                        <ArrowDownRight className="w-3 h-3" /> Softening
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{mandi.distanceKm} km away</span>
                    <span>•</span>
                    <span className="text-red-600 font-medium">-₹{mandi.freightPerQtl}/qtl freight</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold font-outfit text-foreground tabular-nums">
                    ₹{mandi.modalPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs font-bold text-primary tabular-nums">
                    ₹{mandi.netEstimatePerQtl.toLocaleString('en-IN')} net
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
