import React from 'react';
import { 
  Sparkles, 
  LogIn, 
  Sprout, 
  TrendingUp, 
  CloudRain, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Language, translations } from '../i18n';

interface HomeViewProps {
  onEnterDemo: () => void;
  onOpenAuth: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onEnterDemo,
  onOpenAuth,
  language,
  onLanguageChange
}) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between animate-fade-in pb-12">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shadow-xs">
              🌱
            </div>
            <div>
              <h1 className="font-outfit font-extrabold text-xl text-primary leading-tight tracking-tight flex items-center gap-1.5">
                {t.appName}
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/20">
                  AgriIntel
                </span>
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-muted/80 rounded-full p-0.5 border border-border/80">
            {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Hero & Dual Entry Section */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 flex-1">
        {/* Hero Title */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Pan-India Agricultural Decision Intelligence</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl text-foreground tracking-tight leading-tight max-w-xl mx-auto">
            Smart APMC Selling, Rain Risk Alerts & Yield Science
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            {language === 'mr'
              ? 'महाराष्ट्रातील सोयाबीन, तूर ते दक्षिण भारतातील भातशेती, मिरची व हळद उत्पादक शेतकऱ्यांसाठी अचूक बाजारभाव व विक्री सल्ला.'
              : language === 'hi'
              ? 'महाराष्ट्र के सोयाबीन-तुवर से लेकर दक्षिण भारत के धान, मिर्च व हल्दी तक—मंडी भाव, बारिश अलर्ट और सटीक मुनाफा योजना।'
              : 'From Maharashtra soybeans & pulses to South Indian rice paddies, chillies & turmeric—real-time freight deductions and harvest timing.'}
          </p>
        </div>

        {/* Two-Track Entry Cards (Demo vs Real Login) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Card 1: Demo Sandbox */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-card border-2 border-amber-300/80 shadow-md flex flex-col justify-between hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Instant Preview</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Zero setup required
                </span>
              </div>

              <div>
                <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-foreground flex items-center gap-2">
                  <span>Explore Demo Sandbox</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {language === 'mr'
                    ? 'खाते न उघडता थेट चाचणी करा. दक्षिण भारत व महाराष्ट्रातील पिके, हवामान अंदाज व मंडी नफा तपासा. हे पूर्णपणे सुरक्षित सँडबॉक्स आहे.'
                    : language === 'hi'
                    ? 'बिना लॉगिन तुरंत टेस्ट करें। धान, सोयाबीन, मिर्च के भाव, 7-दिवसीय मौसम और मुनाफा कैलकुलेटर चलाकर देखें।'
                    : 'Jump straight in with realistic sample farms. Test South Indian paddy, Guntur chilli, or Latur soybean without affecting any real user data.'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Preloaded sample farms across India</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Isolated sandbox (will not overwrite real accounts)</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-auto">
              <button
                type="button"
                onClick={onEnterDemo}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer group-hover:bg-amber-600"
              >
                <span>Launch Demo Sandbox</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Card 2: Farmer Account Login / Register */}
          <div className="relative p-5 sm:p-6 rounded-3xl bg-card border-2 border-primary/50 shadow-md flex flex-col justify-between hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Private Farmer Portal</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Personal & Encrypted
                </span>
              </div>

              <div>
                <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-foreground flex items-center gap-2">
                  <span>Farmer Login / Register</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {language === 'mr'
                    ? 'तुमच्या स्वतःच्या शेताची माहिती, नकाशा, मातीचा प्रकार व सिंचन कायमस्वरूपी सेव्ह करा. तुमचे डेटा सुरक्षित व खाजगी राहील.'
                    : language === 'hi'
                    ? 'अपने निजी खेत का रकबा, मिट्टी, फसल और बिक्री रिकॉर्ड हमेशा के लिए सुरक्षित रखें। पासवर्ड और क्लाउड स्टोरेज से सुरक्षित।'
                    : 'Sign in to access your private farm dashboard. Save your field boundaries, soil characteristics, and personal harvest sales records.'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Permanent MongoDB Cloud storage for your farm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Encrypted session with password authentication</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-auto">
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In or Create Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid Highlights */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
            Built for Modern Indian Agriculture
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h5 className="font-outfit font-bold text-xs text-foreground">APMC Mandis</h5>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Net returns calculated after rural road freight & 2% cess
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
                <CloudRain className="w-4 h-4" />
              </div>
              <h5 className="font-outfit font-bold text-xs text-foreground">Rain Alerts</h5>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Live Open-Meteo forecasts preventing harvest rot
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
                <Compass className="w-4 h-4" />
              </div>
              <h5 className="font-outfit font-bold text-xs text-foreground">Pan-India Support</h5>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Thanjavur Paddy, Guntur Chilli, Latur Soybean & Wheat
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center mx-auto sm:mx-0">
                <Bot className="w-4 h-4" />
              </div>
              <h5 className="font-outfit font-bold text-xs text-foreground">Background AI</h5>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Agronomic voice guidance in Marathi, Hindi & English
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <p>KisanWise (AgriIntel) • Production AgriTech Decision Support Platform</p>
      </footer>
    </div>
  );
};

export default HomeView;
