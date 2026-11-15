import React from 'react';
import { Bell, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { Language, translations } from '../i18n';
import { User, Farm, AppNotification } from '../types';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: User | null;
  farm: Farm | null;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  user,
  farm,
  notifications,
  onOpenNotifications,
  onOpenAuth,
  onLogout,
  onGoHome
}) => {
  const t = translations[language];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Brand */}
        <button 
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-90 transition-opacity"
          title="Return to Home"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shadow-xs">
            🌱
          </div>
          <div>
            <h1 className="font-outfit font-bold text-lg text-primary leading-tight tracking-tight flex items-center gap-1.5">
              {t.appName}
              {user?.isDemo ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                  DEMO
                </span>
              ) : (
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/20">
                  PRO
                </span>
              )}
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[150px] sm:max-w-none">
              {farm ? `${farm.name} • ${farm.district}` : t.tagline}
            </p>
          </div>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-muted/80 rounded-full p-0.5 border border-border/80">
            {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === lang
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={`Switch to ${lang}`}
              >
                {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-foreground hover:bg-muted active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-border">
              <span className="hidden sm:inline text-xs font-medium text-foreground max-w-[100px] truncate">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                aria-label="Sign out"
                title="Sign out"
                className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-xs shadow-xs transition-all active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
