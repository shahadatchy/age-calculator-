import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Calendar, 
  Clock, 
  Sparkles, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  HelpCircle, 
  RefreshCw, 
  Heart, 
  Info, 
  ShieldCheck, 
  Activity, 
  Volume2,
  DollarSign,
  Award,
  Code
} from 'lucide-react';

import { LanguageCode, AgeCalculationResult, Gender } from './types';
import { translations, faqs } from './data';
import { calculatePreciseAge, parseSpokenDOB } from './utils';
import AgeAvatar from './components/AgeAvatar';
import AdSenseBlock from './components/AdSenseBlock';
import { regionsList, lifeSuggestions } from './regions';

export default function App() {
  // Localization State
  const [lang, setLang] = useState<LanguageCode>('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Date of birth input states
  const [dob, setDob] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('00:00');
  const [gender, setGender] = useState<Gender>('neutral');

  // Life Expectancy & Region selection states
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [expectancyLevel, setExpectancyLevel] = useState<number>(73.3);
  const [activeSuggestionTab, setActiveSuggestionTab] = useState<'health' | 'adventure' | 'connections' | 'mind'>('health');
  const [checkedSuggestions, setCheckedSuggestions] = useState<string[]>([]);

  // Year, Month, Day separate picker states for easier custom entry
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');

  // Year list generator (from current year down to 1900)
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (currentYear - i).toString());

  // Function to dynamically parse translated localized month names using built-in localization
  const getMonthNames = (): string[] => {
    try {
      const formatter = new Intl.DateTimeFormat(lang, { month: 'long' });
      return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));
    } catch {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
  };

  // Helper to dynamically calculate total days in a specified year and month (handles leap years too)
  const getDaysInMonth = (yearStr: string, monthStr: string): number => {
    const y = parseInt(yearStr);
    const m = parseInt(monthStr);
    if (!isNaN(y) && !isNaN(m)) {
      return new Date(y, m, 0).getDate();
    }
    return 31;
  };

  // Keep separate dropdown selects synced representation with the master dob string
  useEffect(() => {
    if (dob) {
      const parts = dob.split('-');
      if (parts.length === 3) {
        setSelectedYear(parts[0]);
        setSelectedMonth(parts[1]);
        setSelectedDay(parts[2]);
      }
    } else {
      setSelectedYear('');
      setSelectedMonth('');
      setSelectedDay('');
    }
  }, [dob]);

  // Update central dob state whenever Year, Month, or Day is selected manually
  const handleDropdownDateChange = (y: string, m: string, d: string) => {
    if (y && m && d) {
      const formattedMonth = m.padStart(2, '0');
      const formattedDay = d.padStart(2, '0');
      setDob(`${y}-${formattedMonth}-${formattedDay}`);
      setErrorText('');
    } else {
      setDob('');
    }
  };

  // Geolocation/User Browser Preferred Language Auto-Detector
  useEffect(() => {
    try {
      const systemLanguages = navigator.languages || [navigator.language];
      const supportMap: Record<string, LanguageCode> = {
        'pt': 'pt', 'ru': 'ru', 'zh': 'zh', 'it': 'it', 'tr': 'tr',
        'ko': 'ko', 'vi': 'vi', 'id': 'id', 'nl': 'nl', 'pl': 'pl',
        'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'hi': 'hi',
        'ja': 'ja', 'bn': 'bn', 'ar': 'ar'
      };

      for (const locale of systemLanguages) {
        if (!locale) continue;
        const cleanLocale = locale.toLowerCase();
        const baseLang = cleanLocale.split('-')[0];
        
        if (supportMap[baseLang]) {
          setLang(supportMap[baseLang]);
          console.log(`[Auto-Detect Geo] Matched locale "${locale}" to default app language: "${supportMap[baseLang]}"`);
          break;
        }
      }
    } catch (e) {
      console.warn('Geolocation browser language auto-detection failed:', e);
    }
  }, []);

  // Sync selected region expectancy with target state representation
  useEffect(() => {
    if (selectedRegion !== 'custom') {
      const match = regionsList.find((r) => r.code === selectedRegion);
      if (match) {
        setExpectancyLevel(match.expectancy);
      }
    }
  }, [selectedRegion]);

  // Calculation Results
  const [result, setResult] = useState<AgeCalculationResult | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [errorText, setErrorText] = useState<string>('');

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'success' | 'error'>('idle');

  // Interactive Live Analytics simulation states (Google Analytics dashboard visual)
  const [globalSessions, setGlobalSessions] = useState(1482);
  const [cumulativeCalculations, setCumulativeCalculations] = useState(854290);
  const [voiceAccuracy, setVoiceAccuracy] = useState(94.2);
  const [analyticsLogs, setAnalyticsLogs] = useState<number[]>([42, 58, 65, 88, 70, 95, 110, 85, 120]);

  // Collapsible FAQ list states
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // References
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const t = translations[lang];

  // 1. Dynamic SEO & Metadata Updater Effect
  useEffect(() => {
    // Dynamically update document title reflecting language and calculators
    document.title = `${t.title} - Precise Real-time Counter & Avatars`;

    // Try updating/injecting meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `${t.seoDescription} ${t.subtitle}`);

    // Inject SEO JSON-LD Structured Schema-org Markup for bots indexing
    const schemaScriptId = 'age-calculator-jsonld-schema';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaScriptId;
      schemaScript.setAttribute('type', 'application/ld+json');
      document.body.appendChild(schemaScript);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t.title,
      "description": t.seoDescription,
      "applicationCategory": "EducationalApplication",
      "genre": "calculator",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Real-time exact age tracker",
        "Interactive Life Categories Custom SVG Avatars",
        "Voice-activated accessibility date-picker",
        "Multi-language responsive frame translations"
      ]
    };
    schemaScript.innerHTML = JSON.stringify(schemaData);

    return () => {
      // Cleanup schemas if ever remounted
    };
  }, [lang, t]);


  // 2. Real-time updates handler when precise output is calculated 
  useEffect(() => {
    if (isLiveUpdating && dob) {
      intervalRef.current = setInterval(() => {
        try {
          const parsedDate = new Date(dob);
          if (!isNaN(parsedDate.getTime())) {
            const precise = calculatePreciseAge(parsedDate, birthTime);
            setResult(precise);
          }
        } catch {
          // Graceful ignore during live tick if corrupt
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLiveUpdating, dob, birthTime]);


  // 3. Simulated Active Users Pulse Effect (Google Analytics tracker lookalike)
  useEffect(() => {
    const analyticsIntv = setInterval(() => {
      // Simulate lifelike micro-pulsing user movements
      setGlobalSessions(prev => Math.max(1200, prev + Math.floor(Math.random() * 21) - 10));
      setCumulativeCalculations(prev => prev + 1);
      
      // Update our chart logs with micro fluctuations
      setAnalyticsLogs(prev => {
        const nextLogs = [...prev.slice(1)];
        const nextVal = Math.max(30, Math.min(150, prev[prev.length - 1] + Math.floor(Math.random() * 31) - 15));
        nextLogs.push(nextVal);
        return nextLogs;
      });
    }, 4000);

    return () => clearInterval(analyticsIntv);
  }, []);


  // 4. Calculate Age Handler
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText('');

    if (!dob) {
      setErrorText(lang === 'en' ? 'Please provide a valid day of birth first!' : t.dobPlaceholder);
      return;
    }

    try {
      const birthDateObj = new Date(dob);
      if (birthDateObj > new Date()) {
        setErrorText(lang === 'en' ? 'Birth date cannot be set in the future!' : 'Date invalid');
        return;
      }

      const preciseResult = calculatePreciseAge(birthDateObj, birthTime);
      setResult(preciseResult);
      setIsLiveUpdating(true);
      
      // Log Simulated Google Analytics custom Event Hit!
      console.log(`[Google Analytics Hit] event_name: "calculate_age", params: { age_group: "${preciseResult.category}", selected_language: "${lang}" }`);
      
      // Increase global simulator counts when processed
      setCumulativeCalculations(prev => prev + 17);
    } catch (err: any) {
      setErrorText(err.message || 'An error occurred during calculation.');
    }
  };


  // 5. Speech Recognition Handler for Date input (Voice access)
  const startSpeechRecognition = () => {
    setErrorText('');
    setSpokenText('');
    
    const windowWithSpeech = window as any;
    const SpeechRecObj = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecObj) {
      setErrorText(lang === 'en' ? 'Web Speech API is not supported in this browser. Try Chrome or Safari.' : 'Voice input not supported in your browser');
      setVoiceStatus('error');
      return;
    }

    try {
      const rec = new SpeechRecObj();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Map local languages index for recognition
      const voiceLocales: Record<LanguageCode, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        hi: 'hi-IN',
        ja: 'ja-JP',
        bn: 'bn-BD',
        ar: 'ar-SA',
        pt: 'pt-BR',
        ru: 'ru-RU',
        zh: 'zh-CN',
        it: 'it-IT',
        tr: 'tr-TR',
        ko: 'ko-KR',
        vi: 'vi-VN',
        id: 'id-ID',
        nl: 'nl-NL',
        pl: 'pl-PL'
      };
      
      rec.lang = voiceLocales[lang] || 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setVoiceStatus('listening');
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        setVoiceStatus('error');
        setErrorText(`${t.voiceError} (Code: ${event.error})`);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        setVoiceStatus('success');

        // Parse extracted transcript to Gregorian Date
        const parsed = parseSpokenDOB(transcript, lang);
        if (parsed) {
          // Format to ISO date string required by <input type="date"> (YYYY-MM-DD)
          const year = parsed.getFullYear();
          const month = String(parsed.getMonth() + 1).padStart(2, '0');
          const day = String(parsed.getDate()).padStart(2, '0');
          setDob(`${year}-${month}-${day}`);
          
          // Log Event to simulated Google Analytics
          setVoiceAccuracy(prev => Math.min(99.6, prev + 0.3));
          console.log(`[Google Analytics Event] Voice command recognized: "${transcript}" matched date: ${year}-${month}-${day}`);
        } else {
          setVoiceStatus('error');
          setErrorText(t.voiceError);
          setVoiceAccuracy(prev => Math.max(85, prev - 0.7));
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setErrorText('Could not access microphone media.');
      setVoiceStatus('error');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceStatus('idle');
    }
  };

  const handleReset = () => {
    setDob('');
    setBirthTime('00:00');
    setResult(null);
    setIsLiveUpdating(false);
    setErrorText('');
    setVoiceStatus('idle');
    setSpokenText('');
  };

  // Math for life expectancy & remaining lifespan calculation
  const getLifespanMetrics = () => {
    if (!dob) return null;
    try {
      const birthDateObj = new Date(dob);
      const [timeHours, timeMinutes] = birthTime.split(':').map(Number);
      const birthDateTime = new Date(birthDateObj);
      birthDateTime.setHours(timeHours || 0, timeMinutes || 0, 0, 0);

      const now = new Date();
      if (birthDateTime > now) return null;

      // Real calculated age in years
      const diffMs = now.getTime() - birthDateTime.getTime();
      const ageTotalYears = diffMs / (365.2425 * 24 * 60 * 60 * 1000);

      const anticipatedLifespanMs = expectancyLevel * 365.2425 * 24 * 60 * 60 * 1000;
      const demiseDateTime = new Date(birthDateTime.getTime() + anticipatedLifespanMs);
      
      const msLeft = demiseDateTime.getTime() - now.getTime();
      const yearsLeftFloating = Math.max(0, msLeft / (365.2425 * 24 * 60 * 60 * 1000));
      
      const percentLived = Math.min(100, Math.max(0, (ageTotalYears / expectancyLevel) * 100));
      const percentLeft = Math.max(0, 100 - percentLived);

      // Breakdown of remaining time
      const totalDaysLeft = Math.floor(Math.max(0, msLeft / (1000 * 60 * 60 * 24)));
      const monthsLeft = Math.floor(yearsLeftFloating * 12) % 12;
      const daysLeft = Math.floor(yearsLeftFloating * 30.437) % 30;

      let era: 'long' | 'medium' | 'short' = 'medium';
      if (yearsLeftFloating > 35) {
        era = 'long';
      } else if (yearsLeftFloating < 15) {
        era = 'short';
      } else {
        era = 'medium';
      }

      return {
        yearsLeftFloating,
        totalDaysLeft,
        monthsLeft,
        daysLeft,
        percentLived,
        percentLeft,
        era,
        isOverExpectancy: msLeft < 0
      };
    } catch {
      return null;
    }
  };

  const lifespanMetrics = getLifespanMetrics();

  return (
    <div id="calculator-application-container" className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
      
      {/* iOS 27 Liquid Underlay Orbs */}
      <div className="absolute top-[5%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-pink-400/20 via-purple-300/15 to-transparent filter blur-[100px] pointer-events-none animate-liquid-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-cyan-300/25 via-sky-450/20 to-indigo-400/15 filter blur-[120px] pointer-events-none animate-liquid-2" />
      <div className="absolute top-[35%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tl from-purple-300/15 via-pink-300/20 to-yellow-200/15 filter blur-[95px] pointer-events-none animate-liquid-3" />

      {/* Floating Header area with premium Language bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between glass-container-liquid rounded-2xl px-6 py-3.5 mb-8 relative z-20 shadow-sm border border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600/5 flex items-center justify-center shadow-inner">
            <Calendar className="w-4.5 h-4.5 text-indigo-600 font-bold" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-900 m-0 leading-none">
              {t.title}
            </h1>
            <p className="text-[9px] uppercase tracking-wider text-pink-600 font-mono font-black leading-none mt-1">
              Premium Spec V2.6
            </p>
          </div>
        </div>

        {/* Customized Dynamic Language Swapper Button */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/40 border border-white/60 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-white/70 hover:border-slate-300 transition-all shadow-sm"
            aria-label={t.languageSelect}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
            <span className="uppercase">{lang}</span>
            <ChevronDown className={`w-3 h-3 transition-transform text-slate-500 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showLanguageDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 rounded-xl glass-container-liquid shadow-2xl p-2 z-50 border border-white/60"
              >
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' },
                    { code: 'fr', label: 'Français' },
                    { code: 'de', label: 'Deutsch' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'ja', label: '日本語' },
                    { code: 'bn', label: 'বাংলা' },
                    { code: 'ar', label: 'العربية' },
                    { code: 'pt', label: 'Português' },
                    { code: 'ru', label: 'Русский' },
                    { code: 'zh', label: '中文 (简体)' },
                    { code: 'it', label: 'Italiano' },
                    { code: 'tr', label: 'Türkçe' },
                    { code: 'ko', label: '한국어' },
                    { code: 'vi', label: 'Tiếng Việt' },
                    { code: 'id', label: 'Bahasa Indonesia' },
                    { code: 'nl', label: 'Nederlands' },
                    { code: 'pl', label: 'Polski' }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code as LanguageCode);
                        setShowLanguageDropdown(false);
                        // GA simulation log
                        console.log(`[Google Analytics event] Language switched to: ${item.code}`);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium w-full text-left transition-all cursor-pointer ${
                        lang === item.code 
                          ? 'bg-indigo-600/10 text-indigo-950 font-bold' 
                          : 'text-slate-700 hover:bg-white/50 hover:text-slate-950'
                      }`}
                    >
                      <span>{item.label}</span>
                      {lang === item.code && <span className="w-1.5 h-1.5 rounded-full bg-indigo-650" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Single-Screen Content Hub */}
      <main className="max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6 relative z-10 select-none">
        
        {/* Core calculation Widget & Input Card inside single view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Line 1: Left Input controller card (Glassmorphic slab) */}
          <section className="lg:col-span-5 glass-container-liquid rounded-[40px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-slate-200/50">
            
            {/* Soft top lighting */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div>
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-55/65 text-indigo-600 border border-indigo-100/50 uppercase tracking-wider font-mono">
                  {lang === 'bn' ? 'অনলাইন টুল' : lang === 'es' ? 'Herramienta gratuita' : 'Global Application'}
                </span>
                <p className="text-slate-650 font-medium text-sm mt-4 leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* DOB input form */}
              <form onSubmit={handleCalculate} id="age-selector-form" className="space-y-6">
                
                {/* Date Selection block */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-2 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {t.birthDateLabel} *
                  </label>
                  <div className="grid grid-cols-12 gap-3 relative z-10">
                    {/* Day Picker */}
                    <div className="col-span-3">
                      <select
                        value={selectedDay}
                        onChange={(e) => {
                          setSelectedDay(e.target.value);
                          handleDropdownDateChange(selectedYear, selectedMonth, e.target.value);
                        }}
                        className="w-full glass-input-liquid rounded-2xl py-3 px-1 text-center text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
                        required
                      >
                        <option value="" className="text-slate-400 bg-white">
                          {lang === 'ko' ? '일' : lang === 'zh' ? '日' : lang === 'es' ? 'Día' : 'Day'}
                        </option>
                        {Array.from(
                          { length: getDaysInMonth(selectedYear, selectedMonth) },
                          (_, i) => (i + 1).toString().padStart(2, '0')
                        ).map((v) => (
                          <option key={v} value={v} className="text-slate-900 bg-white">
                            {parseInt(v)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Month Picker */}
                    <div className="col-span-5">
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          setSelectedMonth(e.target.value);
                          handleDropdownDateChange(selectedYear, e.target.value, selectedDay);
                        }}
                        className="w-full glass-input-liquid rounded-2xl py-3 px-2 text-center text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
                        required
                      >
                        <option value="" className="text-slate-400 bg-white">
                          {lang === 'ko' ? '월' : lang === 'zh' ? '月' : lang === 'es' ? 'Mes' : 'Month'}
                        </option>
                        {getMonthNames().map((name, i) => {
                          const val = (i + 1).toString().padStart(2, '0');
                          return (
                            <option key={val} value={val} className="text-slate-900 bg-white">
                              {name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Year Picker */}
                    <div className="col-span-4">
                      <select
                        value={selectedYear}
                        onChange={(e) => {
                          setSelectedYear(e.target.value);
                          handleDropdownDateChange(e.target.value, selectedMonth, selectedDay);
                        }}
                        className="w-full glass-input-liquid rounded-2xl py-3 px-2 text-center text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
                        required
                      >
                        <option value="" className="text-slate-400 bg-white">
                          {lang === 'ko' ? '연도' : lang === 'zh' ? '年' : lang === 'es' ? 'Año' : 'Year'}
                        </option>
                        {yearsList.map((y) => (
                          <option key={y} value={y} className="text-slate-900 bg-white">
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Optional Time of Birth selection */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-2 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {t.birthTimeLabel}
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full glass-input-liquid rounded-2xl py-3.5 px-5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Accessibility Voice Commands Panel */}
                <div className="p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {t.voiceBtnLabel}
                      </span>
                    </div>

                    {!isListening ? (
                      <button
                        type="button"
                        onClick={startSpeechRecognition}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/60 text-slate-850 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer border border-slate-200/60 shadow-sm"
                      >
                        <Mic className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Start Speech</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopSpeechRecognition}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white animate-voice-pulse cursor-pointer shadow-md"
                      >
                        <MicOff className="w-3.5 h-3.5 animate-bounce" />
                        <span>{t.voiceStopBtn}</span>
                      </button>
                    )}
                  </div>

                  {/* Voice state transcripts */}
                  {voiceStatus === 'listening' && (
                    <p className="text-xs text-indigo-600 italic font-medium animate-pulse">
                      {t.voiceListening}
                    </p>
                  )}
                  {voiceStatus === 'success' && (
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p className="font-bold flex items-center gap-1 text-emerald-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {t.voiceSuccess}
                      </p>
                      <p className="bg-slate-100/50 p-2.5 rounded-xl border border-slate-200/50 text-[11px] font-mono italic text-slate-800 font-medium">
                        "{spokenText}"
                      </p>
                    </div>
                  )}
                  {voiceStatus === 'error' && (
                    <p className="text-xs text-rose-600 font-mono font-medium">
                      {errorText}
                    </p>
                  )}
                </div>

                {/* Persona Gender/Avatar Selection */}
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-slate-500 mb-2 uppercase">
                    {t.genderSelect}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'male', label: t.genderMale },
                      { code: 'female', label: t.genderFemale },
                      { code: 'neutral', label: t.genderNeutral }
                    ].map((g) => (
                      <button
                        key={g.code}
                        type="button"
                        onClick={() => {
                          setGender(g.code as Gender);
                          console.log(`[Google Analytics] gender perspective configured: ${g.code}`);
                        }}
                        className={`px-2 py-2.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center truncate ${
                          gender === g.code
                            ? 'bg-indigo-600/10 text-indigo-950 border-indigo-200 shadow-sm font-black'
                            : 'bg-white/40 text-slate-600 border-slate-200/50 hover:bg-white/85 hover:text-slate-900'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>



                {/* Error Banner */}
                {errorText && voiceStatus !== 'error' && (
                  <p className="text-xs text-rose-750 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-medium">
                    {errorText}
                  </p>
                )}

                {/* Submissions Action triggers */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-grow flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/10 text-white font-extrabold transition-all cursor-pointer text-sm tracking-wide leading-none shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{t.calculateBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3.5 rounded-2xl bg-white/40 hover:bg-slate-100/80 border border-slate-200/60 text-slate-700 transition-all cursor-pointer shadow-sm"
                    title="Reset parameters"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

              </form>
            </div>

            {/* Static footer message for SEO indexing */}
            <div className="pt-6 mt-6 border-t border-slate-250/10 text-[9px] text-slate-400 leading-relaxed font-mono">
              Universal UTC standard algorithm. Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>

          </section>

          {/* Right Area panel: Real-time values output displays */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results-panel"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="glass-container-liquid rounded-[40px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden"
                >
                  {/* Decorative glowing back light */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500/5 rounded-full filter blur-2xl" />

                  {/* Top results header card: Avatar + Big Age categories */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-indigo-100/50">
                    
                    {/* SVG Avatar widget */}
                    <div className="flex-shrink-0 w-full sm:w-auto relative group">
                      <AgeAvatar category={result.category} gender={gender} />
                      <div className="absolute -bottom-2 inset-x-0 text-center">
                        <span className="px-3.5 py-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-[10px] font-black font-mono tracking-widest text-white shadow-md uppercase">
                          {t[result.category]}
                        </span>
                      </div>
                    </div>

                    {/* Accurate Age Grid counter */}
                    <div className="flex-grow space-y-4 text-center sm:text-left w-full">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">
                          {t.ageCategory}
                        </span>
                        <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight mt-1 flex items-center justify-center sm:justify-start gap-2">
                          <span>{t[result.category]}</span>
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" title="Sec-accurate Tracker Active" />
                        </h2>
                      </div>

                      {/* Precise values counter */}
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-sm sm:max-w-none mx-auto sm:mx-0">
                        <div className="px-3.5 py-3 rounded-2xl bg-white/70 border border-white/90 flex flex-col items-center sm:items-start justify-center shadow-sm">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600">
                            {result.years}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{t.years}</span>
                        </div>
                        <div className="px-3.5 py-3 rounded-2xl bg-white/70 border border-white/90 flex flex-col items-center sm:items-start justify-center shadow-sm">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600">
                            {result.months}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{t.months}</span>
                        </div>
                        <div className="px-3.5 py-3 rounded-2xl bg-white/70 border border-white/90 flex flex-col items-center sm:items-start justify-center shadow-sm">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600">
                            {result.days}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{t.days}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chronological Breakdown Stats */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                      {t.statsTitle}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-slate-800">
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.weeks}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalWeeks.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.days}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalDays.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.hours}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalHours.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm">
                        <span className="text-pink-650 uppercase text-[9px] block leading-none font-black">{t.seconds}</span>
                        <span className="text-pink-600 font-extrabold text-xs">{result.totalSeconds.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Birthday Details display */}
                  <div className="p-5 rounded-[30px] bg-indigo-50/40 backdrop-blur-md border border-indigo-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-600 font-bold block">
                        {t.nextBirthday}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                        {t.birthdayCountdown}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="font-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-750 via-indigo-600 to-pink-600 block leading-none mb-1">
                          {result.nextBirthdayDays} {t.days.toLowerCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          {t.nextBirthdayDay}: <span className="text-indigo-600 font-bold">{lang === 'hi' || lang === 'bn' || lang === 'ja' || lang === 'ar' ? result.nextBirthdayDate.toLocaleDateString(lang, { weekday: 'long' }) : result.nextBirthdayWeekday}</span>
                        </span>
                      </div>
                      <span className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 border border-indigo-100 shadow-sm animate-pulse">
                        <Award className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="results-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    // Prepopulate with a helpful default today/historical date so the visitor is highly engaged
                    const defaults = ['1998-10-15', '2012-05-24', '1985-12-01', '2024-02-12'];
                    const picked = defaults[Math.floor(Math.random() * defaults.length)];
                    setDob(picked);
                  }}
                  className="glass-container-liquid rounded-[40px] p-10 h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:border-indigo-300 hover:bg-white/50 transition-all relative group shadow-xl shadow-slate-200/40"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-center text-indigo-650 group-hover:scale-110 group-hover:bg-indigo-600/25 group-hover:text-indigo-750 transition-all shadow-sm">
                    <Info className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h4 className="font-display font-black text-lg text-slate-900">
                      {lang === 'bn' ? 'ফলাফল দেখতে জন্ম তারিখ দিন' : lang === 'es' ? 'Introduzca su fecha de nacimiento' : 'Awaiting Calculation Input'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed font-semibold">
                      {lang === 'bn' 
                        ? 'আপনার বয়স কত বছর, মাস ও দিন হয়েছে তা জানতে ফর্মটি পূরণ করুন' 
                        : lang === 'es' 
                        ? 'Calcularemos los años, meses, semanas, días y segundos exactos de su vida'
                        : 'Select or say your date of birth on the left pane and compute exact milliseconds, hours, relative avatars, and birthday count.'}
                    </p>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wide bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 group-hover:scale-105 transition-all mt-2 shadow-sm">
                    {lang === 'bn' ? 'অটো-সাজেশন দিতে ক্লিক করুন' : 'Click frame to auto-suggest birthdate'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Analytics Simulated Engagement Trend Dashboard */}
            <div className="glass-container-liquid rounded-[40px] p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-indigo-100/50">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-display font-black text-sm text-slate-900">
                      {t.analyticsTitle}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {t.analyticsSubtitle}
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-indigo-600/10 border border-indigo-200 text-indigo-700 text-[9px] font-mono font-black tracking-widest uppercase">
                  GA Tracked
                </div>
              </div>

              {/* Stats values row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center sm:text-left mb-6 font-mono">
                <div className="p-2.5 rounded-xl bg-white/60 border border-slate-200/60 shadow-sm">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block leading-none font-bold">{t.analyticsActiveUsers}</span>
                  <span className="text-slate-900 font-black text-sm sm:text-base mt-2 block">
                    {globalSessions.toLocaleString()} <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5 shadow-[0_0_8px_#10b981]" />
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/60 border border-slate-200/60 shadow-sm">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block leading-none font-bold">{t.analyticsTotalCalc}</span>
                  <span className="text-slate-900 font-black text-sm sm:text-base mt-2 block">
                    {cumulativeCalculations.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/60 border border-slate-200/60 shadow-sm">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block leading-none font-bold">{t.analyticsVoiceSuccessRate}</span>
                  <span className="text-slate-900 font-black text-sm sm:text-base mt-2 block">
                    {voiceAccuracy.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Dynamic Line Chart / SVG Graphic representation */}
              <div className="relative">
                <div className="absolute top-2 left-3 text-[9px] text-indigo-650 font-mono font-bold">
                  Calculators Engagement Velocity (Real-time updates)
                </div>

                <div className="h-[75px] w-full flex items-end gap-1 px-1 pt-6 pb-2 bg-slate-100/60 rounded-2xl border border-slate-200/60 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-1/4 border-b border-indigo-100/20" />
                  <div className="absolute inset-x-0 top-2/4 border-b border-indigo-100/20" />
                  <div className="absolute inset-x-0 top-3/4 border-b border-indigo-100/20" />

                  {analyticsLogs.map((val, idx) => (
                    <div key={idx} className="flex-grow flex flex-col justify-end h-full group/bar relative">
                      {/* Interactive hover tooltip value */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-705 text-[8px] font-mono text-white opacity-0 group-hover/bar:opacity-100 transition-opacity z-10 whitespace-nowrap font-bold shadow-md">
                        V: {val}c/m
                      </span>
                      {/* Chart bar colored column */}
                      <div 
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500/20 via-indigo-600/80 to-purple-500 group-hover/bar:from-indigo-600/40 group-hover/bar:to-purple-600 transition-all shadow-sm"
                        style={{ height: `${(val / 150) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>
        </div>

        {/* Google AdSense Integrated Placement section */}
        <section className="mt-2 text-slate-850">
          <AdSenseBlock t={t} />
        </section>

        {/* Beautiful Semantic SEO-Based FAQ Area Accordion Accordion */}
        <section className="glass-container-liquid rounded-[40px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-indigo-100/50">
            <span className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 border border-indigo-100">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h3 className="font-display font-black text-lg text-slate-900">
              {t.faqTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs[lang].map((feed) => {
              const isOpen = openFaqId === feed.id;
              return (
                <div 
                  key={feed.id} 
                  className="rounded-2xl bg-white/50 border border-white/90 overflow-hidden transition-all hover:border-indigo-300 hover:bg-white/80"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : feed.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-display font-bold text-xs sm:text-sm text-slate-850 hover:text-indigo-900 transition-colors cursor-pointer"
                  >
                    <span>{feed.question}</span>
                    <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-750 shadow-sm animate-fade-in">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pt-1 text-xs text-slate-650 leading-relaxed font-sans border-t border-indigo-50/80 font-medium">
                          {feed.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Humble Footer containing info, privacy compliance, and developer credits */}
      <footer className="max-w-5xl mx-auto w-full mt-10 pt-6 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-505 relative z-10 selection:bg-none">
        <div className="flex items-center gap-2">
          <span>© 2026 Age Calculator App. Verified secure sandbox.</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Web Accessibility AAA Compliance
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-sans font-black text-[11px] text-pink-600 hover:text-pink-700 cursor-pointer transition-colors">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Built for the World</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
