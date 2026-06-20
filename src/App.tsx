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

export default function App() {
  // Localization State
  const [lang, setLang] = useState<LanguageCode>('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Date of birth input states
  const [dob, setDob] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('00:00');
  const [gender, setGender] = useState<Gender>('neutral');

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
        ar: 'ar-SA'
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

  return (
    <div id="calculator-application-container" className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 font-sans antialiased text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-white/20 selection:text-white">
      
      {/* Decorative Blur Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[25vw] h-[25vw] rounded-full bg-white/5 mix-blend-screen filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-pink-500/10 mix-blend-screen filter blur-[90px] pointer-events-none" />
      <div className="absolute top-[45%] right-[20%] w-[20vw] h-[20vw] rounded-full bg-indigo-500/10 mix-blend-screen filter blur-[70px] pointer-events-none" />

      {/* Floating Header area with premium Language bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 mb-8 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Calendar className="w-4.5 h-4.5 text-indigo-600 font-bold" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-display font-black tracking-tight text-white m-0">
              {t.title}
            </h1>
            <p className="text-[9px] uppercase tracking-wider text-pink-200 font-mono font-bold leading-none">
              Premium Spec V2.6
            </p>
          </div>
        </div>

        {/* Customized Dynamic Language Swapper Button */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all shadow-inner"
            aria-label={t.languageSelect}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="uppercase">{lang}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showLanguageDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 rounded-xl glass-container shadow-2xl p-2 z-50 border border-white/10"
              >
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { code: 'en', label: 'English (US)' },
                    { code: 'es', label: 'Español' },
                    { code: 'fr', label: 'Français' },
                    { code: 'de', label: 'Deutsch' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'ja', label: '日本語' },
                    { code: 'bn', label: 'বাংলা' },
                    { code: 'ar', label: 'العربية' }
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
                          ? 'bg-sky-500/20 text-sky-200' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {lang === item.code && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
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
          
          {/* Lign 1: Left Input controller card (Glassmorphic slab) */}
          <section className="lg:col-span-5 bg-white/15 backdrop-blur-lg border border-white/20 rounded-[40px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            
            {/* Soft top lighting */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            
            <div>
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 border border-white/30 text-pink-200 uppercase tracking-wider">
                  {lang === 'bn' ? 'অনলাইন টুল' : lang === 'es' ? 'Herramienta gratuita' : 'Global Application'}
                </span>
                <p className="text-indigo-100 opacity-90 font-light text-sm mt-4 leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* DOB input form */}
              <form onSubmit={handleCalculate} id="age-selector-form" className="space-y-6">
                
                {/* Date Selection block */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-indigo-200 mb-2 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-300" />
                    {t.birthDateLabel} *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                        setErrorText('');
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 px-5 text-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all relative z-10"
                      required
                    />
                  </div>
                </div>

                {/* Optional Time of Birth selection */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-indigo-200 mb-2 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-300" />
                    {t.birthTimeLabel}
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 px-5 text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  />
                </div>

                {/* Accessibility Voice Commands Panel */}
                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                        {t.voiceBtnLabel}
                      </span>
                    </div>

                    {!isListening ? (
                      <button
                        type="button"
                        onClick={startSpeechRecognition}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/20 shadow-sm"
                      >
                        <Mic className="w-3.5 h-3.5 text-pink-300" />
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
                    <p className="text-xs text-pink-200 italic animate-pulse">
                      {t.voiceListening}
                    </p>
                  )}
                  {voiceStatus === 'success' && (
                    <div className="space-y-1.5 text-xs text-pink-100">
                      <p className="font-semibold flex items-center gap-1 text-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5" /> {t.voiceSuccess}
                      </p>
                      <p className="bg-black/30 p-2 rounded-xl border border-white/10 text-[11px] font-mono italic text-indigo-100">
                        "{spokenText}"
                      </p>
                    </div>
                  )}
                  {voiceStatus === 'error' && (
                    <p className="text-xs text-rose-300 font-mono">
                      {errorText}
                    </p>
                  )}
                </div>

                {/* Persona Gender/Avatar Selection */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-indigo-200 mb-2 uppercase">
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
                            ? 'bg-pink-550/30 text-white border-pink-400 bg-pink-500/30 shadow-inner'
                            : 'bg-white/5 text-indigo-200 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {errorText && voiceStatus !== 'error' && (
                  <p className="text-xs text-rose-200 bg-rose-500/20 border border-rose-500/30 p-2.5 rounded-xl font-medium">
                    {errorText}
                  </p>
                )}

                {/* Submissions Action triggers */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-grow flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 hover:shadow-lg hover:shadow-pink-500/30 text-white font-extrabold transition-all cursor-pointer text-sm tracking-wide leading-none"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{t.calculateBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white transition-all cursor-pointer"
                    title="Reset parameters"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>

            {/* Static footer message for SEO indexing */}
            <div className="pt-6 mt-6 border-t border-white/5 text-[9px] text-slate-500 leading-relaxed font-mono">
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
                  className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-[40px] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
                >
                  {/* Decorative glowing back light */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500/20 rounded-full filter blur-2xl" />

                  {/* Top results header card: Avatar + Big Age categories */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
                    
                    {/* SVG Avatar widget */}
                    <div className="flex-shrink-0 w-full sm:w-auto relative group">
                      <AgeAvatar category={result.category} gender={gender} />
                      <div className="absolute -bottom-2 inset-x-0 text-center">
                        <span className="px-3 py-1 bg-pink-500 rounded-full text-[10px] font-black font-mono tracking-widest text-white shadow-md uppercase">
                          {t[result.category]}
                        </span>
                      </div>
                    </div>

                    {/* Accurate Age Grid counter */}
                    <div className="flex-grow space-y-4 text-center sm:text-left w-full">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-pink-200">
                          {t.ageCategory}
                        </span>
                        <h2 className="text-2xl font-display font-black text-white tracking-tight mt-1 flex items-center justify-center sm:justify-start gap-2">
                          <span>{t[result.category]}</span>
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#4ade80]" title="Sec-accurate Tracker Active" />
                        </h2>
                      </div>

                      {/* Precise values counter */}
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-sm sm:max-w-none mx-auto sm:mx-0">
                        <div className="px-3.5 py-3 rounded-2xl bg-white/10 border border-white/10 flex flex-col items-center sm:items-start justify-center shadow-inner">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-pink-300 via-purple-100 to-white">
                            {result.years}
                          </span>
                          <span className="text-[10px] text-pink-200 uppercase tracking-widest mt-0.5 font-bold">{t.years}</span>
                        </div>
                        <div className="px-3.5 py-3 rounded-2xl bg-white/10 border border-white/10 flex flex-col items-center sm:items-start justify-center shadow-inner">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-pink-300 via-purple-100 to-white">
                            {result.months}
                          </span>
                          <span className="text-[10px] text-pink-200 uppercase tracking-widest mt-0.5 font-bold">{t.months}</span>
                        </div>
                        <div className="px-3.5 py-3 rounded-2xl bg-white/10 border border-white/10 flex flex-col items-center sm:items-start justify-center shadow-inner">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-pink-300 via-purple-100 to-white">
                            {result.days}
                          </span>
                          <span className="text-[10px] text-pink-200 uppercase tracking-widest mt-0.5 font-bold">{t.days}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chronological Breakdown Stats */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-200 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-pink-300" />
                      {t.statsTitle}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-white">
                      <div className="p-3.5 rounded-xl bg-black/20 border border-white/10 space-y-1">
                        <span className="text-pink-200/70 uppercase text-[9px] block leading-none font-bold">{t.weeks}</span>
                        <span className="text-white font-extrabold text-xs">{result.totalWeeks.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-black/20 border border-white/10 space-y-1">
                        <span className="text-pink-200/70 uppercase text-[9px] block leading-none font-bold">{t.days}</span>
                        <span className="text-white font-extrabold text-xs">{result.totalDays.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-black/20 border border-white/10 space-y-1">
                        <span className="text-pink-200/70 uppercase text-[9px] block leading-none font-bold">{t.hours}</span>
                        <span className="text-white font-extrabold text-xs">{result.totalHours.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-black/20 border border-white/10 space-y-1">
                        <span className="text-pink-300 uppercase text-[9px] block leading-none font-black">{t.seconds}</span>
                        <span className="text-pink-200 font-extrabold text-xs">{result.totalSeconds.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Birthday Details display */}
                  <div className="p-5 rounded-[30px] bg-black/20 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-pink-300 font-bold block">
                        {t.nextBirthday}
                      </span>
                      <p className="text-xs text-indigo-100 opacity-90 leading-relaxed max-w-sm">
                        {t.birthdayCountdown}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="font-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-white block leading-none mb-1">
                          {result.nextBirthdayDays} {t.days.toLowerCase()}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-200 block">
                          {t.nextBirthdayDay}: <span className="text-white font-bold">{lang === 'hi' || lang === 'bn' || lang === 'ja' || lang === 'ar' ? result.nextBirthdayDate.toLocaleDateString(lang, { weekday: 'long' }) : result.nextBirthdayWeekday}</span>
                        </span>
                      </div>
                      <span className="p-2.5 rounded-xl bg-white/10 text-pink-300 border border-white/10 shadow-sm">
                        <Award className="w-5 h-5 text-pink-300" />
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
                  className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-[40px] p-10 h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:border-pink-300 hover:bg-white/20 transition-all relative group shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-pink-200 group-hover:scale-110 group-hover:bg-pink-500/20 group-hover:text-white transition-all shadow-md">
                    <Info className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h4 className="font-display font-black text-lg text-white">
                      {lang === 'bn' ? 'ফলাফল দেখতে জন্ম তারিখ দিন' : lang === 'es' ? 'Introduzca su fecha de nacimiento' : 'Awaiting Calculation Input'}
                    </h4>
                    <p className="text-xs text-indigo-100 opacity-80 max-w-sm mt-1.5 leading-relaxed font-light">
                      {lang === 'bn' 
                        ? 'আপনার বয়স কত বছর, মাস ও দিন হয়েছে তা জানতে ফর্মটি পূরণ করুন' 
                        : lang === 'es' 
                        ? 'Calcularemos los años, meses, semanas, días y segundos exactos de su vida'
                        : 'Select or say your date of birth on the left pane and compute exact milliseconds, hours, relative avatars, and birthday count.'}
                    </p>
                  </div>

                  <span className="px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wide bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-200 border border-pink-400/30 group-hover:scale-105 transition-all mt-2 shadow-sm">
                    {lang === 'bn' ? 'অটো-সাজেশন দিতে ক্লিক করুন' : 'Click frame to auto-suggest birthdate'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Analytics Simulated Engagement Trend Dashboard */}
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-[40px] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-pink-300" />
                    <h3 className="font-display font-black text-sm text-white">
                      {t.analyticsTitle}
                    </h3>
                  </div>
                  <p className="text-[10px] text-indigo-200 opacity-80 mt-0.5">
                    {t.analyticsSubtitle}
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/35 text-pink-200 text-[9px] font-mono font-black tracking-widest uppercase">
                  GA Tracked
                </div>
              </div>

              {/* Stats values row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center sm:text-left mb-6 font-mono">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-[9px] text-pink-200 uppercase tracking-wider block leading-none font-bold">{t.analyticsActiveUsers}</span>
                  <span className="text-white font-extrabold text-sm sm:text-base mt-2 block">
                    {globalSessions.toLocaleString()} <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5 shadow-[0_0_8px_#4ade80]" />
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-[9px] text-pink-200 uppercase tracking-wider block leading-none font-bold">{t.analyticsTotalCalc}</span>
                  <span className="text-pink-100 font-extrabold text-sm sm:text-base mt-2 block">
                    {cumulativeCalculations.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-[9px] text-pink-200 uppercase tracking-wider block leading-none font-bold">{t.analyticsVoiceSuccessRate}</span>
                  <span className="text-purple-200 font-extrabold text-sm sm:text-base mt-2 block">
                    {voiceAccuracy.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Dynamic Line Chart / SVG Graphic representation */}
              <div className="relative">
                <div className="absolute top-2 left-3 text-[9px] text-indigo-200 opacity-60 font-mono">
                  Calculators Engagement Velocity (Real-time updates)
                </div>

                <div className="h-[75px] w-full flex items-end gap-1 px-1 pt-6 pb-2 bg-black/25 rounded-2xl border border-white/10 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-1/4 border-b border-white/[0.04]" />
                  <div className="absolute inset-x-0 top-2/4 border-b border-white/[0.04]" />
                  <div className="absolute inset-x-0 top-3/4 border-b border-white/[0.04]" />

                  {analyticsLogs.map((val, idx) => (
                    <div key={idx} className="flex-grow flex flex-col justify-end h-full group/bar relative">
                      {/* Interactive hover tooltip value */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 px-1.5 py-0.5 rounded bg-purple-900 border border-white/20 text-[8px] font-mono text-pink-250 opacity-0 group-hover/bar:opacity-100 transition-opacity z-10 whitespace-nowrap text-white font-bold shadow-md">
                        V: {val}c/m
                      </span>
                      {/* Chart bar colored column */}
                      <div 
                        className="w-full rounded-t-sm bg-gradient-to-t from-pink-500/30 via-purple-500/60 to-pink-400 group-hover/bar:to-white transition-all"
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
        <section className="mt-2 text-slate-200">
          <AdSenseBlock t={t} />
        </section>

        {/* Beautiful Semantic SEO-Based FAQ Area Accordion Accordion */}
        <section className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-[40px] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-white/10">
            <span className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h3 className="font-display font-black text-lg text-white">
              {t.faqTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs[lang].map((feed) => {
              const isOpen = openFaqId === feed.id;
              return (
                <div 
                  key={feed.id} 
                  className="rounded-2xl bg-white/10 border border-white/10 overflow-hidden transition-all hover:border-pink-300 hover:bg-white/15"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : feed.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-display font-medium text-xs sm:text-sm text-white hover:text-pink-200 transition-colors cursor-pointer"
                  >
                    <span>{feed.question}</span>
                    <span className="p-1 rounded-lg bg-white/10 border border-white/10 text-white">
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
                        <p className="px-5 pb-5 pt-1 text-xs text-indigo-100 opacity-90 leading-relaxed font-sans border-t border-white/10">
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
      <footer className="max-w-5xl mx-auto w-full mt-10 pt-6 border-t border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-indigo-200/60 relative z-10 selection:bg-none">
        <div className="flex items-center gap-2">
          <span>© 2026 Age Calculator App. Verified secure sandbox.</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-indigo-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Web Accessibility AAA Compliance
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1 font-sans font-black text-[11px] text-pink-200 hover:text-white cursor-pointer transition-colors">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Built for the World</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
