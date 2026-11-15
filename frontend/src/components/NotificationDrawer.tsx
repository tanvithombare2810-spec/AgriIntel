import React from 'react';
import { X, CheckCheck, TrendingUp, CloudRain, AlertTriangle } from 'lucide-react';
import { AppNotification } from '../types';
import { Language, translations } from '../i18n';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  language: Language;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  language
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div>
            <h2 id="notif-title" className="font-outfit font-bold text-base text-foreground">
              {t.notifications.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {notifications.filter(n => !n.isRead).length} unread updates
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllRead}
              className="p-2 text-xs text-primary font-semibold hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-1"
              title={t.notifications.markAllRead}
              aria-label={t.notifications.markAllRead}
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 overscroll-contain">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {t.notifications.empty}
            </div>
          ) : (
            notifications.map((notif) => {
              const isSurge = notif.type.includes('surge') || notif.type.includes('price');
              const isWeather = notif.type.includes('weather') || notif.type.includes('rain');

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    notif.isRead
                      ? 'bg-card border-border/70 opacity-80'
                      : 'bg-primary/5 border-primary/20 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSurge
                          ? 'bg-emerald-100 text-emerald-800'
                          : isWeather
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isSurge ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : isWeather ? (
                        <CloudRain className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-foreground leading-snug">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
