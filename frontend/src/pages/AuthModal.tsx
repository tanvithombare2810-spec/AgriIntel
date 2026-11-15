import React, { useState } from 'react';
import { X, Lock, Phone, User as UserIcon, Sparkles } from 'lucide-react';
import { Language, translations } from '../i18n';
import { api, authStorage } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const t = translations[language];
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        const res = await api.register(name, phoneOrEmail, password, language);
        authStorage.setToken(res.token);
        authStorage.setUser(res.user);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.login(phoneOrEmail, password);
        authStorage.setToken(res.token);
        authStorage.setUser(res.user);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      const res = await api.demoLogin();
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      onSuccess(res.user);
      onClose();
    } catch {
      const demoUser: User = {
        id: 'demo-user-suresh',
        name: 'Suresh Patil',
        phoneOrEmail: 'demo@kisanwise.org',
        preferredLanguage: language,
        isDemo: true
      };
      authStorage.setToken('demo-jwt-token-active');
      authStorage.setUser(demoUser);
      onSuccess(demoUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-2xl p-6 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-xl"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-2xl flex items-center justify-center mx-auto mb-2">
            🌱
          </div>
          <h2 className="font-outfit font-extrabold text-xl text-foreground">
            {isRegister ? t.auth.registerBtn : t.auth.loginTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.auth.loginSubtitle}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Full Name (पूर्ण नाव)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t.auth.phoneOrEmail}
            </label>
            <input
              type="text"
              required
              placeholder="10-digit mobile or email"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              {t.auth.password}
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait…' : isRegister ? t.auth.registerBtn : t.auth.loginBtn}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-semibold">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Demo Bypass */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t.auth.demoBtn}</span>
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-primary font-bold hover:underline"
          >
            {isRegister ? t.auth.switchLogin : t.auth.switchRegister}
          </button>
        </p>
      </div>
    </div>
  );
};
