import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Bot, User, Sparkles, Volume2 } from 'lucide-react';
import { Language, translations } from '../i18n';
import { api } from '../services/api';
import { Farm, MarketData } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AskAiViewProps {
  language: Language;
  farm: Farm | null;
  market: MarketData | null;
}

export const AskAiView: React.FC<AskAiViewProps> = ({
  language,
  farm,
  market
}) => {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: language === 'mr'
        ? `नमस्कार! मी तुमचा **किशनवाइज AI** शेती सल्लागार आहे. तुमच्या ${farm?.crop || 'सोयाबीन'} पिकाचा बाजारभाव, हवामान किंवा विक्री नियोजनाबाबत मराठीत काहीही विचारा किंवा बोला!`
        : language === 'hi'
        ? `नमस्ते! मैं आपका **किसानवाइज AI** सलाहकार हूँ। अपनी ${farm?.crop || 'सोयाबीन'} फसल के मंडी भाव, मौसम या बिक्री के बारे में हिंदी में पूछें या बोलें!`
        : `Hello! I'm your **KisanWise AI** farm advisor. Ask me anything about mandi rates, rain risks, or harvest selling timing!`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const farmContext = {
        crop: farm?.crop || 'Soybean',
        mandi: market?.headlineMandi || 'Latur',
        currentPrice: market?.headlineModalPrice || 4380,
        district: farm?.district || 'Latur',
        state: farm?.state || 'Maharashtra'
      };

      const res = await api.askAi(textToSend, language, farmContext);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.data?.reply || 'Could not generate reply',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'क्षमा करा, नेटवर्क संपर्क साधण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा. (Connection error)',
        time: 'Now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API Voice Input
  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-18 animate-fade-in">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            🤖
          </div>
          <div>
            <h2 className="font-outfit font-bold text-base text-foreground leading-tight">
              {t.ask.title}
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {language === 'mr' ? 'मराठी व्हॉईस सपोर्ट चालू आहे' : 'Real-time farm advisory'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-2 scrollbar-none overscroll-contain">
        {[t.ask.sample1, t.ask.sample2, t.ask.sample3].map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-2.5 py-1 rounded-xl bg-card border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 whitespace-nowrap transition-all shrink-0 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-muted/30 border border-border/80 overscroll-contain">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser ? 'bg-primary text-white' : 'bg-card border border-border text-foreground shadow-xs'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : '🌱'}
              </div>
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-card border border-border text-foreground rounded-tl-none shadow-xs whitespace-pre-line'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] mt-1 block tabular-nums ${
                    isUser ? 'text-emerald-100/70 text-right' : 'text-muted-foreground'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>AI विचार करत आहे… (Thinking)</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice / Text Input Box */}
      <div className="mt-2 pt-2 border-t border-border">
        {isListening && (
          <div className="mb-2 p-2 bg-red-50 text-red-700 text-xs rounded-xl flex items-center justify-between border border-red-200 animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              {t.ask.listening}
            </span>
            <button onClick={toggleVoice} className="text-xs font-bold underline">
              Stop
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={toggleVoice}
            aria-label="Toggle voice input"
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-600 text-white border-red-700 scale-105'
                : 'bg-card border-border text-foreground hover:bg-muted'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-primary" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.ask.placeholder}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs sm:text-sm outline-none focus:border-primary transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
