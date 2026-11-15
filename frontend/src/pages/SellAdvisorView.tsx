import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  Truck, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { RecommendationData } from '../types';
import { Language, translations } from '../i18n';

interface SellAdvisorViewProps {
  recommendation: RecommendationData | null;
  language: Language;
}

export const SellAdvisorView: React.FC<SellAdvisorViewProps> = ({
  recommendation,
  language
}) => {
  const t = translations[language];

  const defaultHarvest = recommendation?.totalHarvestQ || 68.25;
  const [harvestQtl, setHarvestQtl] = useState<number>(defaultHarvest);

  useEffect(() => {
    if (recommendation?.totalHarvestQ) {
      setHarvestQtl(recommendation.totalHarvestQ);
    }
  }, [recommendation?.totalHarvestQ]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const mandi = recommendation?.suggestedMandi || 'Latur';
  const baseRate = recommendation?.scenarios?.[0]?.estimatedModalPricePerQuintal || 4380;
  const rate7d = recommendation?.scenarios?.[1]?.estimatedModalPricePerQuintal || 4470;
  const rate14d = recommendation?.scenarios?.[2]?.estimatedModalPricePerQuintal || 4520;
  const freightPerQtl = 18; // Latur baseline freight

  // Dynamic calculations based on slider
  const calcScenario = (rate: number) => {
    const gross = Math.round(harvestQtl * rate);
    const freight = Math.round(harvestQtl * freightPerQtl);
    const cess = Math.round(gross * 0.02);
    const net = gross - freight - cess;
    const inputCost = 63000;
    const profit = net - inputCost;
    return { gross, freight, cess, net, profit };
  };

  const nowScen = calcScenario(baseRate);
  const scen7d = calcScenario(rate7d);
  const scen14d = calcScenario(rate14d);

  const bestWindow = recommendation?.recommendedWindow || 'now';

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Harvest Quantity Slider Card */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-primary" />
            <h3 className="font-outfit font-bold text-sm text-foreground">
              {t.sell.harvestSlider}
            </h3>
          </div>
          <span className="text-base font-extrabold font-outfit text-primary tabular-nums">
            {harvestQtl} Quintals
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="250"
          step="0.5"
          value={harvestQtl}
          onChange={(e) => setHarvestQtl(parseFloat(e.target.value))}
          className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>10 qtl</span>
          <span>100 qtl</span>
          <span>250 qtl</span>
        </div>
      </div>

      {/* 3 Scenario Cards */}
      <div className="space-y-3">
        {/* Scenario 1: Sell Now */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            bestWindow === 'now'
              ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/40'
              : 'bg-card border-border shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h4 className="font-outfit font-bold text-base text-foreground">
                Sell Now (आजच विक्री)
              </h4>
              {bestWindow === 'now' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                  Recommended
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-foreground tabular-nums">
              ₹{baseRate} / qtl
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Locks in current favorable rate at {mandi} APMC with zero rain damage risk.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.grossIncome}</p>
              <p className="font-semibold tabular-nums text-foreground">{formatCurrency(nowScen.gross)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.freightCost}</p>
              <p className="font-semibold tabular-nums text-red-600">-{formatCurrency(nowScen.freight)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.mandiFee}</p>
              <p className="font-semibold tabular-nums text-red-600">-{formatCurrency(nowScen.cess)}</p>
            </div>
            <div>
              <p className="text-[10px] text-primary uppercase font-bold">{t.sell.netProfit}</p>
              <p className="font-outfit text-base font-extrabold tabular-nums text-primary">
                {formatCurrency(nowScen.net)}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario 2: Wait ~7 Days */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            bestWindow === '7_days'
              ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/40'
              : 'bg-card border-border shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h4 className="font-outfit font-bold text-base text-foreground">
                Wait ~7 Days (७ दिवस प्रतीक्षा)
              </h4>
              {bestWindow === '7_days' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                  Recommended
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-foreground tabular-nums">
              ₹{rate7d} / qtl (Est.)
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Potential upside of +₹{(scen7d.net - nowScen.net).toLocaleString('en-IN')} if moisture stays under 10%.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.grossIncome}</p>
              <p className="font-semibold tabular-nums text-foreground">{formatCurrency(scen7d.gross)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.freightCost}</p>
              <p className="font-semibold tabular-nums text-red-600">-{formatCurrency(scen7d.freight)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.mandiFee}</p>
              <p className="font-semibold tabular-nums text-red-600">-{formatCurrency(scen7d.cess)}</p>
            </div>
            <div>
              <p className="text-[10px] text-primary uppercase font-bold">{t.sell.netProfit}</p>
              <p className="font-outfit text-base font-extrabold tabular-nums text-primary">
                {formatCurrency(scen7d.net)}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario 3: Wait ~14 Days */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs opacity-90">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-outfit font-bold text-base text-foreground">
              Wait ~14 Days (१४ दिवस प्रतीक्षा)
            </h4>
            <span className="text-xs font-bold text-foreground tabular-nums">
              ₹{rate14d} / qtl (Est.)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Higher storage risk; post-festival arrivals might create mandi bottlenecks.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.grossIncome}</p>
              <p className="font-semibold tabular-nums text-foreground">{formatCurrency(scen14d.gross)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">{t.sell.netProfit}</p>
              <p className="font-outfit text-base font-extrabold tabular-nums text-foreground">
                {formatCurrency(scen14d.net)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
