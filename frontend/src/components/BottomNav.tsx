import React from 'react';
import { LayoutDashboard, Sprout, TrendingUp, IndianRupee, MessageSquare } from 'lucide-react';
import { Language, translations } from '../i18n';

export type NavTab = 'dashboard' | 'farm' | 'market' | 'sell' | 'ask';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language
}) => {
  const t = translations[language];

  const items = [
    { id: 'dashboard' as NavTab, label: t.tabs.dashboard, icon: LayoutDashboard },
    { id: 'farm' as NavTab, label: t.tabs.farm, icon: Sprout },
    { id: 'market' as NavTab, label: t.tabs.market, icon: TrendingUp },
    { id: 'sell' as NavTab, label: t.tabs.sell, icon: IndianRupee },
    { id: 'ask' as NavTab, label: t.tabs.ask, icon: MessageSquare }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg pb-[env(safe-area-inset-bottom,8px)]">
      <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-primary scale-105 font-bold'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
