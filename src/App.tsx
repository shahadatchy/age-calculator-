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
  Code,
  Download,
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Link,
  User,
  Sun,
  Moon,
  Trash,
  Plus,
  Bell
} from 'lucide-react';
import { jsPDF } from 'jspdf';

import { LanguageCode, AgeCalculationResult, Gender } from './types';
import { translations, faqs } from './data';
import { calculatePreciseAge, parseSpokenDOB, getWesternZodiac, getChineseZodiac } from './utils';
import AgeAvatar from './components/AgeAvatar';
import SandsOfTime from './components/SandsOfTime';
import AdSenseBlock from './components/AdSenseBlock';
import LegalAboutModals from './components/LegalAboutModals';
import SocialCardGenerator from './components/SocialCardGenerator';
import { regionsList, lifeSuggestions } from './regions';
import { getCelebritiesForDate } from './celebrities';

// Professional stagger and ease-out animations
const containerVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -15,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function App() {
  // Theme State (Forced to light-only theme)
  const theme = 'white';

  // Localization State
  const [lang, setLang] = useState<LanguageCode>('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Date of birth input states
  const [dob, setDob] = useState<string>(() => localStorage.getItem('precision_dob') || '');
  const [birthTime, setBirthTime] = useState<string>(() => localStorage.getItem('precision_birthTime') || '00:00');
  const [gender, setGender] = useState<Gender>(() => (localStorage.getItem('precision_gender') as Gender) || 'neutral');

  // Life Expectancy & Region selection states
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [expectancyLevel, setExpectancyLevel] = useState<number>(73.3);
  const [activeSuggestionTab, setActiveSuggestionTab] = useState<'health' | 'adventure' | 'connections' | 'mind'>('health');
  const [checkedSuggestions, setCheckedSuggestions] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'about' | 'growth'>('privacy');

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

  // LocalStorage synchronizer effects for persistence
  useEffect(() => {
    if (dob) localStorage.setItem('precision_dob', dob);
  }, [dob]);

  useEffect(() => {
    if (birthTime) localStorage.setItem('precision_birthTime', birthTime);
  }, [birthTime]);

  // Calculation Results
  const [result, setResult] = useState<AgeCalculationResult | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [errorText, setErrorText] = useState<string>('');
  const [singleCalcCount, setSingleCalcCount] = useState(0);
  const [compareCalcCount, setCompareCalcCount] = useState(0);

  // Social Card & Comparison states
  const [isSocialCardOpen, setIsSocialCardOpen] = useState(false);
  const [calcMode, setCalcMode] = useState<'single' | 'compare' | 'time' | 'anniversary'>('single');

  // Anniversary Calculator State parameters
  const [anniversaryTitle, setAnniversaryTitle] = useState<string>(() => localStorage.getItem('precision_ann_title') || 'Our Wedding');
  const [anniversaryDate, setAnniversaryDate] = useState<string>(() => localStorage.getItem('precision_ann_date') || '');
  const [anniversaryTime, setAnniversaryTime] = useState<string>(() => localStorage.getItem('precision_ann_time') || '12:00');
  const [anniversaryType, setAnniversaryType] = useState<string>(() => localStorage.getItem('precision_ann_type') || 'wedding');
  const [anniversaryResult, setAnniversaryResult] = useState<any>(null);
  const [anniversaryCalcCount, setAnniversaryCalcCount] = useState(0);

  // Reminders board state
  interface SavedReminder {
    id: string;
    name: string;
    type: 'birthday' | 'anniversary';
    day: number;
    month: number;
    year?: number;
  }

  const [reminders, setReminders] = useState<SavedReminder[]>(() => {
    const stored = localStorage.getItem('precision_reminders');
    const defaultReminders: SavedReminder[] = [
      { id: '1', name: 'Liam', type: 'birthday', day: 12, month: 7, year: 1998 },
      { id: '2', name: 'Sarah & Dave', type: 'anniversary', day: 28, month: 6, year: 2021 },
      { id: '3', name: 'Emily', type: 'birthday', day: 25, month: 10, year: 2002 }
    ];
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultReminders;
      }
    }
    return defaultReminders;
  });

  useEffect(() => {
    localStorage.setItem('precision_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Quick-Add fields for reminders
  const [remName, setRemName] = useState('');
  const [remType, setRemType] = useState<'birthday' | 'anniversary'>('birthday');
  const [remDate, setRemDate] = useState('');

  // Sync Anniversary parameters
  useEffect(() => {
    if (anniversaryTitle) localStorage.setItem('precision_ann_title', anniversaryTitle);
  }, [anniversaryTitle]);

  useEffect(() => {
    if (anniversaryDate) localStorage.setItem('precision_ann_date', anniversaryDate);
  }, [anniversaryDate]);

  useEffect(() => {
    if (anniversaryTime) localStorage.setItem('precision_ann_time', anniversaryTime);
  }, [anniversaryTime]);

  useEffect(() => {
    if (anniversaryType) localStorage.setItem('precision_ann_type', anniversaryType);
  }, [anniversaryType]);

  // Time Calculator State parameters
  const [timeH1, setTimeH1] = useState<number>(0);
  const [timeM1, setTimeM1] = useState<number>(0);
  const [timeS1, setTimeS1] = useState<number>(0);
  const [timeOp, setTimeOp] = useState<'+' | '-'>('+');
  const [timeH2, setTimeH2] = useState<number>(0);
  const [timeM2, setTimeM2] = useState<number>(0);
  const [timeS2, setTimeS2] = useState<number>(0);
  const [timeResult, setTimeResult] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    formatted: string;
    isNegative: boolean;
  } | null>(null);

  // Comparison Person A parameters
  const [compName1, setCompName1] = useState<string>(() => localStorage.getItem('precision_compName1') || 'Person A');
  const [compDob1, setCompDob1] = useState<string>(() => localStorage.getItem('precision_compDob1') || '');
  const [compTime1, setCompTime1] = useState<string>(() => localStorage.getItem('precision_compTime1') || '00:00');
  const [compGender1, setCompGender1] = useState<Gender>(() => (localStorage.getItem('precision_compGender1') as Gender) || 'neutral');

  // Comparison Person B parameters
  const [compName2, setCompName2] = useState<string>(() => localStorage.getItem('precision_compName2') || 'Person B');
  const [compDob2, setCompDob2] = useState<string>(() => localStorage.getItem('precision_compDob2') || '');
  const [compTime2, setCompTime2] = useState<string>(() => localStorage.getItem('precision_compTime2') || '00:00');
  const [compGender2, setCompGender2] = useState<Gender>(() => (localStorage.getItem('precision_compGender2') as Gender) || 'neutral');

  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [selectedCelebrity, setSelectedCelebrity] = useState<any | null>(null);

  useEffect(() => {
    if (gender) localStorage.setItem('precision_gender', gender);
  }, [gender]);

  useEffect(() => {
    if (compName1) localStorage.setItem('precision_compName1', compName1);
  }, [compName1]);

  useEffect(() => {
    if (compDob1) localStorage.setItem('precision_compDob1', compDob1);
  }, [compDob1]);

  useEffect(() => {
    if (compTime1) localStorage.setItem('precision_compTime1', compTime1);
  }, [compTime1]);

  useEffect(() => {
    if (compGender1) localStorage.setItem('precision_compGender1', compGender1);
  }, [compGender1]);

  useEffect(() => {
    if (compName2) localStorage.setItem('precision_compName2', compName2);
  }, [compName2]);

  useEffect(() => {
    if (compDob2) localStorage.setItem('precision_compDob2', compDob2);
  }, [compDob2]);

  useEffect(() => {
    if (compTime2) localStorage.setItem('precision_compTime2', compTime2);
  }, [compTime2]);

  useEffect(() => {
    if (compGender2) localStorage.setItem('precision_compGender2', compGender2);
  }, [compGender2]);

  // Sync selected region expectancy with target state representation
  useEffect(() => {
    if (selectedRegion !== 'custom') {
      const match = regionsList.find((r) => r.code === selectedRegion);
      if (match) {
        setExpectancyLevel(match.expectancy);
      }
    }
  }, [selectedRegion]);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'success' | 'error'>('idle');
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  // Check Speech Recognition API support on mount
  useEffect(() => {
    const windowWithSpeech = window as any;
    const SpeechRecObj = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    setIsSpeechSupported(!!SpeechRecObj);
  }, []);

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
  const resultsSectionRef = useRef<HTMLElement>(null);

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


  // Time calculation handler (addition and subtraction)
  const handleTimeCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText('');

    const h1 = Math.max(0, Math.floor(Number(timeH1) || 0));
    const m1 = Math.max(0, Math.floor(Number(timeM1) || 0));
    const s1 = Math.max(0, Math.floor(Number(timeS1) || 0));

    const h2 = Math.max(0, Math.floor(Number(timeH2) || 0));
    const m2 = Math.max(0, Math.floor(Number(timeM2) || 0));
    const s2 = Math.max(0, Math.floor(Number(timeS2) || 0));

    const totalSecs1 = h1 * 3600 + m1 * 60 + s1;
    const totalSecs2 = h2 * 3600 + m2 * 60 + s2;

    let diffSecs = 0;
    let isNeg = false;

    if (timeOp === '+') {
      diffSecs = totalSecs1 + totalSecs2;
    } else {
      diffSecs = totalSecs1 - totalSecs2;
      if (diffSecs < 0) {
        isNeg = true;
        diffSecs = Math.abs(diffSecs);
      }
    }

    const resH = Math.floor(diffSecs / 3600);
    const remainingAfterH = diffSecs % 3600;
    const resM = Math.floor(remainingAfterH / 60);
    const resS = remainingAfterH % 60;

    const totM = Number((diffSecs / 60).toFixed(2));
    const totH = Number((diffSecs / 3600).toFixed(2));
    const totD = Number((diffSecs / 86400).toFixed(2));

    const sign = isNeg ? '-' : '';
    const formatted = `${sign}${resH}h ${resM}m ${resS}s`;

    setTimeResult({
      hours: resH,
      minutes: resM,
      seconds: resS,
      totalSeconds: isNeg ? -diffSecs : diffSecs,
      totalMinutes: isNeg ? -totM : totM,
      totalHours: isNeg ? -totH : totH,
      totalDays: isNeg ? -totD : totD,
      formatted,
      isNegative: isNeg,
    });

    // Smooth scroll down to the results section
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTimeReset = () => {
    setTimeH1(0);
    setTimeM1(0);
    setTimeS1(0);
    setTimeH2(0);
    setTimeM2(0);
    setTimeS2(0);
    setTimeOp('+');
    setTimeResult(null);
    setErrorText('');
  };

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
      setSingleCalcCount(prev => prev + 1);
      
      // Log Simulated Google Analytics custom Event Hit!
      console.log(`[Google Analytics Hit] event_name: "calculate_age", params: { age_group: "${preciseResult.category}", selected_language: "${lang}" }`);
      
      // Increase global simulator counts when processed
      setCumulativeCalculations(prev => prev + 17);

      // Smooth scroll down to the results section
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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

  // Date Comparison Calculation Handler
  const handleCompareCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText('');

    if (!compDob1 || !compDob2) {
      setErrorText(lang === 'en' ? 'Please provide valid birth dates for both people first!' : 'Select both dates');
      return;
    }

    try {
      const birthDateObj1 = new Date(compDob1);
      const birthDateObj2 = new Date(compDob2);

      if (birthDateObj1 > new Date() || birthDateObj2 > new Date()) {
        setErrorText(lang === 'en' ? 'Birth dates cannot be in the future!' : 'Dates cannot be in future');
        return;
      }

      const age1 = calculatePreciseAge(birthDateObj1, compTime1);
      const age2 = calculatePreciseAge(birthDateObj2, compTime2);

      const time1 = birthDateObj1.getTime();
      const time2 = birthDateObj2.getTime();

      let isOlder: 'person1' | 'person2' | 'same' = 'same';
      let olderName = compName1 || 'Person A';
      let youngerName = compName2 || 'Person B';

      if (time1 < time2) {
        isOlder = 'person1';
        olderName = compName1 || 'Person A';
        youngerName = compName2 || 'Person B';
      } else if (time2 < time1) {
        isOlder = 'person2';
        olderName = compName2 || 'Person B';
        youngerName = compName1 || 'Person A';
      }

      const msDiff = Math.abs(time1 - time2);
      const diffDays = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(msDiff / (1000 * 60 * 60));
      const diffSeconds = Math.floor(msDiff / 1000);

      const olderDate = time1 < time2 ? birthDateObj1 : birthDateObj2;
      const youngerDate = time1 < time2 ? birthDateObj2 : birthDateObj1;

      let diffYears = youngerDate.getFullYear() - olderDate.getFullYear();
      let diffMonths = youngerDate.getMonth() - olderDate.getMonth();
      let diffRemainingDays = youngerDate.getDate() - olderDate.getDate();

      if (diffRemainingDays < 0) {
        diffMonths--;
        const prevMonth = new Date(youngerDate.getFullYear(), youngerDate.getMonth(), 0);
        diffRemainingDays = prevMonth.getDate() + diffRemainingDays;
      }
      if (diffMonths < 0) {
        diffYears--;
        diffMonths = 12 + diffMonths;
      }

      const combinedDays = age1.totalDays + age2.totalDays;
      const olderTotalMs = Date.now() - olderDate.getTime();
      const youngerTotalMs = Date.now() - youngerDate.getTime();
      const overlapPercentage = Math.min(100, Math.round((youngerTotalMs / olderTotalMs) * 1000) / 10);

      const daySum1 = birthDateObj1.getDate() + birthDateObj1.getMonth() + birthDateObj1.getFullYear();
      const daySum2 = birthDateObj2.getDate() + birthDateObj2.getMonth() + birthDateObj2.getFullYear();
      const compatibilityScore = 60 + ((daySum1 + daySum2) % 38);

      const nextMilestoneDays = Math.ceil((combinedDays + 1) / 5000) * 5000;
      const daysToMilestone = nextMilestoneDays - combinedDays;
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + daysToMilestone);

      setComparisonResult({
        age1,
        age2,
        isOlder,
        olderName,
        youngerName,
        diffYears,
        diffMonths,
        diffRemainingDays,
        diffDays,
        diffHours,
        diffSeconds,
        combinedDays,
        overlapPercentage,
        compatibilityScore,
        nextMilestoneDays,
        milestoneDate,
      });

      setResult(null); // Clear single result
      setIsLiveUpdating(true);
      setCompareCalcCount(prev => prev + 1);

      console.log(`[Google Analytics Hit] event_name: "compare_ages", params: { user_language: "${lang}" }`);
      setCumulativeCalculations(prev => prev + 29);

      // Smooth scroll down to the results section
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorText(err.message || 'An error occurred during comparison calculation.');
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

    // Reset comparison states
    setCompName1('Person A');
    setCompDob1('');
    setCompTime1('00:00');
    setCompGender1('neutral');
    setCompName2('Person B');
    setCompDob2('');
    setCompTime2('00:00');
    setCompGender2('neutral');
    setComparisonResult(null);
  };

  const handleAnniversaryReset = () => {
    setAnniversaryTitle('Our Wedding');
    setAnniversaryDate('');
    setAnniversaryTime('12:00');
    setAnniversaryType('wedding');
    setAnniversaryResult(null);
    setErrorText('');
  };

  const handleAnniversaryCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText('');

    if (!anniversaryDate) {
      setErrorText(lang === 'bn' ? 'দয়া করে একটি সঠিক বার্ষিকী তারিখ প্রদান করুন!' : lang === 'es' ? '¡Por favor proporcione una fecha de aniversario válida!' : 'Please provide a valid anniversary date!');
      return;
    }

    try {
      const annDateObj = new Date(anniversaryDate);
      if (annDateObj > new Date()) {
        setErrorText(lang === 'bn' ? 'বার্ষিকী তারিখ ভবিষ্যতে হতে পারে না!' : lang === 'es' ? '¡La fecha de aniversario no puede estar en el futuro!' : 'Anniversary date cannot be in the future!');
        return;
      }

      // Compute precise age values from the date of the anniversary
      const precise = calculatePreciseAge(annDateObj, anniversaryTime);

      const now = new Date();
      const [timeHours, timeMinutes] = anniversaryTime.split(':').map(Number);
      const eventTimeDate = new Date(annDateObj);
      eventTimeDate.setHours(timeHours || 0, timeMinutes || 0, 0, 0);

      // Find next anniversary
      const nextAnnDate = new Date(eventTimeDate);
      nextAnnDate.setFullYear(now.getFullYear());
      if (nextAnnDate < now) {
        nextAnnDate.setFullYear(now.getFullYear() + 1);
      }

      const nextAnnDiffMs = nextAnnDate.getTime() - now.getTime();
      const nextAnnDays = Math.ceil(nextAnnDiffMs / (1000 * 60 * 60 * 24));
      let nextAnnMonths = nextAnnDate.getMonth() - now.getMonth();
      if (nextAnnMonths < 0) {
        nextAnnMonths = 12 + nextAnnMonths;
      }
      const weekdaysIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const nextAnnWeekday = weekdaysIndex[nextAnnDate.getDay()];

      const elapsedYears = precise.years;
      const nextMilestoneYear = elapsedYears + 1;

      // Traditional and modern gift lookups
      let traditionalGift = 'No standard traditional gift';
      let modernGift = 'No standard modern gift';

      if (anniversaryType === 'wedding') {
        const weddingGifts: Record<number, { trad: string; mod: string }> = {
          1: { trad: 'Paper (Symbol of fresh page)', mod: 'Clocks (Symbol of timeless relationship)' },
          2: { trad: 'Cotton (Symbol of warmth and comfort)', mod: 'China (Symbol of delicate beauty)' },
          3: { trad: 'Leather (Symbol of durability and shelter)', mod: 'Crystal/Glass (Symbol of clarity)' },
          4: { trad: 'Fruit or Flowers (Symbol of blossoming relationship)', mod: 'Appliances (Symbol of utility)' },
          5: { trad: 'Wood (Symbol of deep roots and strength)', mod: 'Silverware (Symbol of connection)' },
          6: { trad: 'Iron (Symbol of unbreakable bond)', mod: 'Wood objects (Symbol of grounding)' },
          7: { trad: 'Copper or Wool (Symbol of warmth and conductivity)', mod: 'Desk sets' },
          8: { trad: 'Bronze or Pottery (Symbol of sculpture of life)', mod: 'Lace/Linens' },
          9: { trad: 'Willow or Pottery (Symbol of flexibility)', mod: 'Leather goods' },
          10: { trad: 'Tin or Aluminum (Symbol of preservation)', mod: 'Diamond jewelry' },
          11: { trad: 'Steel (Symbol of high strength)', mod: 'Fashion jewelry' },
          12: { trad: 'Silk or Linen (Symbol of luxury and flow)', mod: 'Pearls' },
          13: { trad: 'Lace (Symbol of intricate devotion)', mod: 'Textiles/Furs' },
          14: { trad: 'Ivory / Opal (Symbol of rarity)', mod: 'Gold jewelry' },
          15: { trad: 'Crystal (Symbol of sparkling clarity)', mod: 'Watches' },
          20: { trad: 'China (Symbol of exquisite refinement)', mod: 'Platinum' },
          25: { trad: 'Silver Jubilee (Symbol of timeless brilliance)', mod: 'Silver objects' },
          30: { trad: 'Pearl Jubilee (Symbol of hidden treasure)', mod: 'Diamond' },
          35: { trad: 'Coral (Symbol of oceanic growth)', mod: 'Jade' },
          40: { trad: 'Ruby Jubilee (Symbol of passionate fire)', mod: 'Ruby' },
          45: { trad: 'Sapphire Jubilee (Symbol of heavenly depth)', mod: 'Sapphire' },
          50: { trad: 'Golden Jubilee (Symbol of pure grandeur)', mod: 'Gold' },
          60: { trad: 'Diamond Jubilee (Symbol of indestructible love)', mod: 'Diamond' }
        };

        const gift = weddingGifts[nextMilestoneYear] || { trad: 'Paper, Wood, Tin, Silver, or Gold milestones.', mod: 'Clocks, Crystal, Watches, or Platinum gifts.' };
        traditionalGift = gift.trad;
        modernGift = gift.mod;
      } else if (anniversaryType === 'relationship') {
        const relationshipMilestones: Record<number, { trad: string; mod: string }> = {
          1: { trad: 'Handwritten love letter / Photo album', mod: 'Special date night experience' },
          2: { trad: 'Cozy matching sweaters or blankets', mod: 'Weekend getaway trip' },
          3: { trad: 'Engraved custom leather keychains', mod: 'Fine dining culinary class' },
          4: { trad: 'Blossoming flowers or plants to nurture together', mod: 'Smart home memory display' },
          5: { trad: 'Engraved wooden memory chest', mod: 'Spa relaxation package for two' },
          10: { trad: 'Stunning customized shadowbox of milestones', mod: 'High-end modern jewelry' }
        };
        const gift = relationshipMilestones[nextMilestoneYear] || { trad: 'Custom scrapbook of memories, shared photo books', mod: 'Adventurous experience, weekend getaway' };
        traditionalGift = gift.trad;
        modernGift = gift.mod;
      } else if (anniversaryType === 'career') {
        const careerMilestones: Record<number, { trad: string; mod: string }> = {
          1: { trad: 'New professional notebook / certificate holder', mod: 'Premium desk organizer' },
          2: { trad: 'Personal development book / course license', mod: 'Ergonomic seat pillow' },
          3: { trad: 'Custom professional leather binder/portfolio', mod: 'Noise-canceling headphones' },
          5: { trad: 'Solid wood custom desk name plaque', mod: 'High-quality mechanical keyboard' },
          10: { trad: 'Tribute frame / decade of excellence certificate', mod: 'Premium office ergonomic chair' }
        };
        const gift = careerMilestones[nextMilestoneYear] || { trad: 'Mentorship offering, speaking opportunity', mod: 'Conference ticket, advanced professional gear' };
        traditionalGift = gift.trad;
        modernGift = gift.mod;
      } else {
        traditionalGift = 'Celebration event, personalized memory book';
        modernGift = 'Custom art print, dynamic digital photo frame';
      }

      // Upcoming milestone years list
      const milestoneMilestoneYears = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60];
      const milestonesForecast = milestoneMilestoneYears
        .filter(y => y > elapsedYears)
        .slice(0, 4)
        .map(y => {
          const targetDate = new Date(eventTimeDate);
          targetDate.setFullYear(eventTimeDate.getFullYear() + y);
          const daysLeft = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const weekdayName = weekdaysIndex[targetDate.getDay()];
          return {
            year: y,
            date: targetDate,
            daysRemaining: daysLeft,
            weekday: weekdayName
          };
        });

      setAnniversaryResult({
        title: anniversaryTitle || (anniversaryType === 'wedding' ? 'Our Wedding' : anniversaryType === 'career' ? 'Career Start' : 'Special Milestone'),
        type: anniversaryType,
        precise,
        nextAnnDate,
        nextAnnDays,
        nextAnnMonths,
        nextAnnWeekday,
        nextMilestoneYear,
        traditionalGift,
        modernGift,
        milestonesForecast
      });

      setResult(null); // clear single result
      setComparisonResult(null); // clear comparison result
      setAnniversaryCalcCount(prev => prev + 1);

      console.log(`[Google Analytics Hit] event_name: "calculate_anniversary", params: { type: "${anniversaryType}" }`);
      setCumulativeCalculations(prev => prev + 21);

      // Smooth scroll down to the results section
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setErrorText(err.message || 'An error occurred during calculations.');
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remName.trim() || !remDate) return;

    try {
      const parsedDate = new Date(remDate);
      const reminder: SavedReminder = {
        id: Date.now().toString(),
        name: remName.trim(),
        type: remType,
        day: parsedDate.getDate(),
        month: parsedDate.getMonth() + 1,
        year: parsedDate.getFullYear()
      };

      setReminders(prev => [...prev, reminder]);
      setRemName('');
      setRemDate('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
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

  // Share Content Generator
  const getShareText = () => {
    if (!result) return '';

    const appUrl = window.location.origin;

    if (lang === 'bn') {
      return `আমি প্রিসিশন ক্রোনোলজিক্যাল ক্যালকুলেটর দিয়ে আমার সঠিক বয়স হিসেব করেছি! ⏳\n\n` +
        `• বয়স: ${result.years} বছর, ${result.months} মাস, ${result.days} দিন\n` +
        `• মোট অতিক্রান্ত সময়: ${result.totalDays.toLocaleString()} দিন (${result.totalWeeks.toLocaleString()} সপ্তাহ)\n` +
        (lifespanMetrics ? `• গড় অবশিষ্ট আয়ু: ${lifespanMetrics.yearsLeftFloating.toFixed(4)} বছর (${lifespanMetrics.totalDaysLeft.toLocaleString()} দিন)\n` : '') +
        `\nআপনার নিখুঁত বয়স ও মিলিসেকেন্ড কাউন্টডাউন দেখুন এখানে: ${appUrl}`;
    } else if (lang === 'es') {
      return `¡Calculé mi edad exacta con la Calculadora Cronológica de Precisión! ⏳\n\n` +
        `• Edad: ${result.years} años, ${result.months} meses, ${result.days} días\n` +
        `• Tiempo vivido: ${result.totalDays.toLocaleString()} días (${result.totalWeeks.toLocaleString()} semanas)\n` +
        (lifespanMetrics ? `• Esperanza restante: ${lifespanMetrics.yearsLeftFloating.toFixed(4)} años (${lifespanMetrics.totalDaysLeft.toLocaleString()} días)\n` : '') +
        `\nCalcula tu cuenta regresiva en milisegundos aquí: ${appUrl}`;
    } else {
      return `I calculated my exact chronological age with the Precision Tracker! ⏳\n\n` +
        `• Age: ${result.years} years, ${result.months} months, ${result.days} days\n` +
        `• Lifetime lived: ${result.totalDays.toLocaleString()} days (${result.totalWeeks.toLocaleString()} weeks)\n` +
        (lifespanMetrics ? `• Expected time remaining: ${lifespanMetrics.yearsLeftFloating.toFixed(4)} years (${lifespanMetrics.totalDaysLeft.toLocaleString()} days)\n` : '') +
        `\nCheck your precise millisecond countdown here: ${appUrl}`;
    }
  };

  const handleShareClick = async () => {
    const text = getShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === 'bn' ? 'প্রিসিশন বয়স ক্যালকুলেটর' : lang === 'es' ? 'Calculadora de Edad de Precisión' : 'Precision Age Tracker',
          text: text,
          url: window.location.origin
        });
        console.log('[Google Analytics] Shared via native API');
        return;
      } catch (err) {
        console.log('Native share cancelled or failed, falling back to modal:', err);
      }
    }
    // Fallback to custom modal
    setIsShareModalOpen(true);
  };

  // Premium PDF Generation Function
  const exportToPDF = () => {
    if (!result) return;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Page Dimensions (A4 is 595.28 x 841.89 pt)
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 36;
      const usableWidth = pageWidth - (margin * 2);

      // Deep, modern colors (Indigo/Purple premium theme)
      const primaryColor = [30, 27, 75]; // #1e1b4b (indigo-950)
      const secondaryColor = [79, 70, 229]; // #4f46e5 (indigo-600)
      const accentColor = [219, 39, 119]; // #db2777 (pink-600)
      const textColor = [15, 23, 42]; // #0f172a (slate-900)
      const lightTextColor = [71, 85, 105]; // #475569 (slate-600)
      const lightBg = [248, 250, 252]; // #f8fafc (slate-50)
      const borderColor = [226, 232, 240]; // #e2e8f0 (slate-200)

      // Background decorative borders
      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setLineWidth(1.5);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(24, 24, pageWidth - 48, pageHeight - 48);

      // Draw Main Header Bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(24, 24, pageWidth - 48, 65, 'F');

      // Title & Subtitle inside header
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('PRECISION CHRONOLOGICAL AGE CALCULATOR', pageWidth / 2, 50, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(199, 210, 254);
      doc.text('HIGH-PRECISION BIOMETRICS & LIFE EXPECTANCY ANALYTICS REPORT', pageWidth / 2, 65, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setTextColor(165, 180, 252);
      doc.text(`Report Generated on: ${new Date().toLocaleString()} | Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`, pageWidth / 2, 78, { align: 'center' });

      let currentY = 110;

      // Section A: Personal Profile & Parameters Summary
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(margin, currentY, usableWidth, 54, 'F');
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(margin, currentY, usableWidth, 54, 'S');

      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SUBJECT PROFILE & PARAMETERS', margin + 12, currentY + 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      const birthDateString = new Date(dob).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.text(`• Date of Birth: ${birthDateString}`, margin + 12, currentY + 30);
      doc.text(`• Time of Birth: ${birthTime || '00:00 (Standard Local)'}`, margin + 12, currentY + 42);

      const countryObj = regionsList.find(r => r.code === selectedRegion);
      const countryName = countryObj ? (countryObj.names['en'] || countryObj.names[lang] || 'Global Average') : 'Custom Index';
      doc.text(`• Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)}`, margin + 240, currentY + 30);
      doc.text(`• Country Lifespan Context: ${countryName} (${expectancyLevel} Years Expected)`, margin + 240, currentY + 42);

      currentY += 75;

      // Section B: Exact Chronological Age
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('1. ACCURATE CHRONOLOGICAL AGE BREAKDOWN', margin, currentY);

      // Horizontal separator line
      currentY += 6;
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(1);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      currentY += 15;

      // 3 Giant displays for Years, Months, Days
      const colWidth3 = usableWidth / 3;
      
      // Years box
      doc.setFillColor(243, 244, 246); // gray-100
      doc.rect(margin, currentY, colWidth3 - 6, 48, 'F');
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(margin, currentY, colWidth3 - 6, 48, 'S');
      
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(`${result.years}`, margin + (colWidth3 - 6) / 2, currentY + 24, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text('YEARS ACCUMULATED', margin + (colWidth3 - 6) / 2, currentY + 38, { align: 'center' });

      // Months box
      doc.setFillColor(243, 244, 246);
      doc.rect(margin + colWidth3, currentY, colWidth3 - 6, 48, 'F');
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(margin + colWidth3, currentY, colWidth3 - 6, 48, 'S');

      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(`${result.months}`, margin + colWidth3 + (colWidth3 - 6) / 2, currentY + 24, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text('MONTHS COMPLETED', margin + colWidth3 + (colWidth3 - 6) / 2, currentY + 38, { align: 'center' });

      // Days box
      doc.setFillColor(243, 244, 246);
      doc.rect(margin + (colWidth3 * 2), currentY, colWidth3, 48, 'F');
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(margin + (colWidth3 * 2), currentY, colWidth3, 48, 'S');

      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(`${result.days}`, margin + (colWidth3 * 2) + colWidth3 / 2, currentY + 24, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text('EXTRA DAYS LIVED', margin + (colWidth3 * 2) + colWidth3 / 2, currentY + 38, { align: 'center' });

      currentY += 65;

      // Section C: Lifetime Statistics Grid
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('CHRONOLOGICAL LIFETIME CONVERSION METRICS', margin, currentY);

      currentY += 5;
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 12;

      // 4 Column Stats: Weeks, Days, Hours, Seconds
      const colWidth4 = usableWidth / 4;
      const lifetimeMetrics = [
        { label: 'Total Weeks', value: result.totalWeeks.toLocaleString() },
        { label: 'Total Days', value: result.totalDays.toLocaleString() },
        { label: 'Total Hours', value: result.totalHours.toLocaleString() },
        { label: 'Total Seconds', value: result.totalSeconds.toLocaleString() }
      ];

      lifetimeMetrics.forEach((metric, index) => {
        const xPos = margin + (index * colWidth4);
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(xPos, currentY, colWidth4 - 6, 32, 'F');
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.rect(xPos, currentY, colWidth4 - 6, 32, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        doc.text(metric.label.toUpperCase(), xPos + 6, currentY + 11);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(metric.value, xPos + 6, currentY + 23);
      });

      currentY += 50;

      // Section D: Expected Lifespan, Ticking Years Left & Visual bar
      if (lifespanMetrics) {
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.text('2. EXPECTED LIFESPAN & THE SANDS OF TIME COUNTDOWN', margin, currentY);

        currentY += 6;
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 14;

        // Draw a highlighted status card for remaining lifespan
        doc.setFillColor(254, 242, 242); // soft red/rose background
        doc.setDrawColor(251, 113, 133); // rose-400
        doc.rect(margin, currentY, usableWidth, 80, 'FD');

        // Sands of Time heading
        doc.setTextColor(159, 18, 57); // rose-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text('THE SANDS OF TIME ARE SLIPPING', margin + 12, currentY + 18);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(190, 24, 74); // rose-700
        doc.text(`• Context Lifespan Threshold: ${expectancyLevel} Years (Region Average)`, margin + 12, currentY + 34);
        doc.text(`• Accumulated Time Elapsed: ${lifespanMetrics.percentLived.toFixed(2)}% of Expected Lifespan`, margin + 12, currentY + 48);
        doc.text(`• Remaining Estimated Lifespan: ${lifespanMetrics.percentLeft.toFixed(2)}% of Expected Lifespan`, margin + 12, currentY + 62);

        // Highlight Box with Years Remaining Ticking Value
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin + 280, currentY + 10, usableWidth - 292, 60, 'FD');

        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('ESTIMATED REMAINING LIFE:', margin + 288, currentY + 22);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`${lifespanMetrics.yearsLeftFloating.toFixed(8)} yrs`, margin + 288, currentY + 41);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        doc.text(`Equivalent to ~${lifespanMetrics.totalDaysLeft.toLocaleString()} active days left`, margin + 288, currentY + 53);

        currentY += 98;
      }

      // Section E: Category Bucket-List Active Recommendations
      if (lifespanMetrics && lifeSuggestions[lifespanMetrics.era]) {
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('3. PERSPECTIVE MINDFULNESS LIFE BUCKET-LIST SUGGESTIONS', margin, currentY);

        currentY += 5;
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 12;

        const suggestionsList = lifeSuggestions[lifespanMetrics.era].slice(0, 3);
        suggestionsList.forEach((sug, i) => {
          const itemY = currentY + (i * 35);
          doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
          doc.rect(margin, itemY, usableWidth, 29, 'F');
          doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
          doc.rect(margin, itemY, usableWidth, 29, 'S');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text(`${sug.icon}  ${sug.titles['en'] || sug.titles[lang]}`, margin + 8, itemY + 11);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
          doc.text(sug.descs['en'] || sug.descs[lang], margin + 20, itemY + 21);
        });

        currentY += 120;
      }

      // Section F: Deep Emotional Wisdom Box
      doc.setFillColor(250, 245, 255); // light purple
      doc.setDrawColor(216, 180, 254); // purple-300
      doc.rect(margin, currentY, usableWidth, 54, 'FD');

      doc.setTextColor(107, 33, 168); // purple-800
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('💝 PHILOSOPHICAL INSIGHT & MINDFULNESS TRUTH', margin + 12, currentY + 16);

      doc.setFont('helvetica', 'oblique');
      doc.setFontSize(8.2);
      doc.setTextColor(88, 28, 135); // purple-900

      const wisdomQuoteText = '“Life is an incredible and rare gift, but its chapters are finite. Our days are finishing one by one. Do not save your joy for tomorrow; love warmly, laugh deeply, forgive quickly, and cherish every single second of today.”';
      
      const wrappedLines = doc.splitTextToSize(wisdomQuoteText, usableWidth - 24);
      wrappedLines.forEach((line: string, i: number) => {
        doc.text(line, margin + 12, currentY + 28 + (i * 10));
      });

      // Section G: Legal & Security Disclaimer Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('Calculated locally on-device. Absolute confidentiality guaranteed. No data is stored, transmitted, or shared on external servers.', pageWidth / 2, pageHeight - 34, { align: 'center' });
      doc.text('© Precision Chronological Tracker Applet. All rights reserved. Live-updating Millisecond Algorithmic Calibration.', pageWidth / 2, pageHeight - 25, { align: 'center' });

      // Save output
      doc.save(`Age_Chronological_Report_${dob}.pdf`);
      console.log(`[Google Analytics] PDF report successfully generated.`);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    }
  };

  // Dedicated download of Birth Information Sheet with Celebrities
  const downloadBirthInfoSheet = () => {
    if (!result) return;
    try {
      const dobDate = new Date(dob);
      const birthMonth = dobDate.getMonth() + 1;
      const birthDay = dobDate.getDate();
      const celebs = getCelebritiesForDate(birthMonth, birthDay);
      
      const birthDateString = dobDate.toLocaleDateString(lang === 'bn' ? 'bn-BD' : lang === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const title = lang === 'bn' ? 'প্রিসিশন ক্রোনোলজিক্যাল বার্থ সার্টিফিকেট' : lang === 'es' ? 'CERTIFICADO DE NACIMIENTO CRONOLÓGICO DE PRECISIÓN' : 'PRECISION CHRONOLOGICAL BIRTH & COMPANION PROFILE';
      
      let txt = `================================================================================
${title}
================================================================================

`;

      if (lang === 'bn') {
        txt += `• জন্ম তারিখ: ${birthDateString}
• জন্ম সময়: ${birthTime || '০০:০০ (স্ট্যান্ডার্ড লোকাল)'}
• জেন্ডার এভাটার: ${gender === 'male' ? 'ছেলে' : gender === 'female' ? 'মেয়ে' : 'সাধারণ'} (${result.category === 'child' ? 'শিশু' : result.category === 'boy' ? 'যুবক' : result.category === 'teenage' ? 'কিশোর' : result.category === 'adult' ? 'প্রাপ্তবয়স্ক' : 'প্রবীণ'})

--------------------------------------------------------------------------------
ক্রোনোলজিক্যাল বয়স ও হিসাব
--------------------------------------------------------------------------------
• বর্তমান বয়স: ${result.years} বছর, ${result.months} মাস, ${result.days} দিন
• মোট অতিক্রান্ত সপ্তাহ: ${result.totalWeeks.toLocaleString('bn-BD')} সপ্তাহ
• মোট অতিক্রান্ত দিন: ${result.totalDays.toLocaleString('bn-BD')} দিন
• মোট অতিক্রান্ত ঘন্টা: ${result.totalHours.toLocaleString('bn-BD')} ঘন্টা
• মোট অতিক্রান্ত সেকেন্ড: ${result.totalSeconds.toLocaleString('bn-BD')} সেকেন্ড

• পরবর্তী জন্মদিন: আর মাত্র ${result.nextBirthdayDays.toLocaleString('bn-BD')} দিন বাকি!
  (বার: ${result.nextBirthdayWeekday})

--------------------------------------------------------------------------------
আপনার জন্মদিনের বিখ্যাত ব্যক্তিত্ব ও ঐতিহাসিক সঙ্গী
--------------------------------------------------------------------------------
`;
        celebs.forEach((c, idx) => {
          txt += `${idx + 1}. ${c.icon} ${c.name} (জন্মসাল: ${c.year > 0 ? c.year : Math.abs(c.year) + ' খ্রিস্টপূর্ব'})\n`;
          txt += `   - কৃতিত্ব: ${c.achievement.bn}\n`;
          txt += `   - পরিচিতি: ${c.descriptions.bn}\n\n`;
        });

      } else if (lang === 'es') {
        txt += `• Fecha de Nacimiento: ${birthDateString}
• Hora de Nacimiento: ${birthTime || '00:00 (Estándar Local)'}
• Género / Categoría de Vida: ${gender.toUpperCase()} (${result.category.toUpperCase()})

--------------------------------------------------------------------------------
MÉTRICAS DE EDAD CRONOLÓGICA
--------------------------------------------------------------------------------
• Edad Exacta: ${result.years} años, ${result.months} meses y ${result.days} días
• Total Semanas: ${result.totalWeeks.toLocaleString()} semanas
• Total Días Lividos: ${result.totalDays.toLocaleString()} días
• Total Horas: ${result.totalHours.toLocaleString()} horas
• Total Segundos: ${result.totalSeconds.toLocaleString()} segundos

• Próximo Cumpleaños: ¡Faltan ${result.nextBirthdayDays} días!
  (Día de la semana: ${result.nextBirthdayWeekday})

--------------------------------------------------------------------------------
CELEBRIDADES Y COMPAÑEROS HISTÓRICOS QUE COMPARTEN TU CUMPLEAÑOS
--------------------------------------------------------------------------------
`;
        celebs.forEach((c, idx) => {
          txt += `${idx + 1}. ${c.icon} ${c.name} (Año de nacimiento: ${c.year > 0 ? c.year : Math.abs(c.year) + ' a.C.'})\n`;
          txt += `   - Logro clave: ${c.achievement.es}\n`;
          txt += `   - Detalles: ${c.descriptions.es}\n\n`;
        });

      } else {
        // English Default
        txt += `• Date of Birth: ${birthDateString}
• Time of Birth: ${birthTime || '00:00 (Standard Local)'}
• Gender / Life Avatar: ${gender.toUpperCase()} (${result.category.toUpperCase()})

--------------------------------------------------------------------------------
CHRONOLOGICAL LIFETIME CONVERSION METRICS
--------------------------------------------------------------------------------
• Current Precise Age: ${result.years} Years, ${result.months} Months, ${result.days} Days
• Total Weeks Lived: ${result.totalWeeks.toLocaleString()} Weeks
• Total Days Lived: ${result.totalDays.toLocaleString()} Days
• Total Hours Lived: ${result.totalHours.toLocaleString()} Hours
• Total Seconds Lived: ${result.totalSeconds.toLocaleString()} Seconds

• Next Birthday: Only ${result.nextBirthdayDays} days remaining!
  (Falls on a: ${result.nextBirthdayWeekday})

--------------------------------------------------------------------------------
FAMOUS CELEBRITIES & HISTORICAL COMPANIONS BORN ON YOUR BIRTHDAY
--------------------------------------------------------------------------------
`;
        celebs.forEach((c, idx) => {
          txt += `${idx + 1}. ${c.icon} ${c.name} (Birth Year: ${c.year > 0 ? c.year : Math.abs(c.year) + ' BC'})\n`;
          txt += `   - Key Achievement: ${c.achievement.en}\n`;
          txt += `   - Biography: ${c.descriptions.en}\n\n`;
        });
      }

      txt += `================================================================================
Generated securely by Precision Chronological Calculator on ${new Date().toLocaleString()}
Calculated locally on-device • 100% safe, secure & private
================================================================================`;

      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Precision_Birth_Companion_Profile_${dob}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('[Google Analytics] Celebrities Birth information text sheet downloaded');
    } catch (err) {
      console.error('Error generating Birth Info Sheet:', err);
    }
  };

  const isDark = false;
  const glassContainerClass = isDark 
    ? 'bg-zinc-950/75 border-zinc-800 shadow-[0_15px_50px_rgba(0,0,0,0.65)]' 
    : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50';
  const glassCardClass = isDark 
    ? 'bg-zinc-900/40 border-zinc-800/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
    : 'glass-card-liquid border-white/65';
  const glassInputClass = isDark 
    ? 'bg-zinc-950/90 border-zinc-800 text-white focus:border-zinc-500 focus:ring-zinc-500/10 placeholder-zinc-500' 
    : 'glass-input-liquid border-slate-200/50 text-slate-900';
  const textTitleClass = isDark ? 'text-zinc-100' : 'text-slate-900';
  const textSubtitleClass = isDark ? 'text-zinc-400' : 'text-slate-650';
  const textMutedClass = isDark ? 'text-zinc-500' : 'text-slate-500';
  const accentTextClass = isDark ? 'text-zinc-350' : 'text-slate-900';
  const accentBgClass = isDark ? 'bg-zinc-900/40 text-zinc-300 border-zinc-800/60' : 'bg-slate-100 text-slate-900 border-slate-200';

  return (
    <div id="calculator-application-container" className={`min-h-screen font-sans antialiased flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-zinc-950 text-slate-100 selection:bg-zinc-850 selection:text-white dark' 
        : 'bg-slate-50 text-slate-800 selection:bg-slate-100 selection:text-slate-900'
    }`}>
      
      {/* iOS 27 Liquid Underlay Orbs */}
      {isDark ? (
        <>
          <div className="absolute top-[5%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-transparent filter blur-[100px] pointer-events-none animate-liquid-1" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-pink-500/15 filter blur-[120px] pointer-events-none animate-liquid-2" />
          <div className="absolute top-[35%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tl from-purple-700/15 via-indigo-600/20 to-transparent filter blur-[95px] pointer-events-none animate-liquid-3" />
        </>
      ) : (
        <>
          <div className="absolute top-[5%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-pink-400/20 via-purple-300/15 to-transparent filter blur-[100px] pointer-events-none animate-liquid-1" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-cyan-300/25 via-sky-450/20 to-indigo-400/15 filter blur-[120px] pointer-events-none animate-liquid-2" />
          <div className="absolute top-[35%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tl from-purple-300/15 via-pink-300/20 to-yellow-200/15 filter blur-[95px] pointer-events-none animate-liquid-3" />
        </>
      )}

      {/* Floating Header area with premium Language bar */}
      <header className={`max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between rounded-2xl px-6 py-4 mb-8 relative z-20 shadow-sm border transition-all duration-300 ${
        isDark 
          ? 'bg-[#120a22]/70 border-purple-900/50 shadow-purple-950/20' 
          : 'glass-container-liquid border-white/60'
      }`}>
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-inner ${
            isDark ? 'bg-purple-900/20' : 'bg-indigo-600/5'
          }`}>
            <Calendar className={`w-4.5 h-4.5 font-bold ${
              isDark ? 'text-purple-400' : 'text-indigo-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-lg sm:text-xl font-display font-black tracking-tight m-0 leading-none ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {t.title}
            </h1>
            <p className={`text-[9px] uppercase tracking-wider font-mono font-black leading-none mt-1 ${
              isDark ? 'text-purple-400' : 'text-pink-600'
            }`}>
              {isDark ? 'Chrono Dark V2.6' : 'Premium Spec V2.6'}
            </p>
          </div>
        </div>

        {/* Responsive Header Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 my-3 md:my-0">
          {[
            { id: 'single', label: lang === 'bn' ? 'বয়স ক্যালকুলেটর' : lang === 'es' ? 'Edad' : 'Age Calc', icon: Calendar },
            { id: 'compare', label: lang === 'bn' ? 'বয়স তুলনা' : lang === 'es' ? 'Comparar' : 'Compare', icon: User },
            { id: 'time', label: lang === 'bn' ? 'সময় ক্যালকুলেটর' : lang === 'es' ? 'Tiempo' : 'Time Calc', icon: Clock },
            { id: 'anniversary', label: lang === 'bn' ? 'বার্ষিকী' : lang === 'es' ? 'Aniversario' : 'Anniversary', icon: Heart }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = calcMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCalcMode(tab.id as any);
                  setErrorText('');
                  console.log(`[Navigation] Switched mode to: ${tab.id}`);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? isDark
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30 font-extrabold'
                      : 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-650/20 font-extrabold'
                    : isDark
                      ? 'bg-purple-950/40 border-purple-900/30 text-purple-300 hover:text-white hover:bg-purple-900/20'
                      : 'bg-white/40 border-slate-200/50 text-slate-700 hover:bg-white'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions bar (Language Swapper) */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all shadow-sm ${
                isDark
                  ? 'bg-purple-950/65 border-purple-900/40 text-purple-300 hover:text-white'
                  : 'bg-white/40 border-white/60 text-slate-700 hover:bg-white/70'
              }`}
              aria-label={t.languageSelect}
            >
              <Globe className={`w-3.5 h-3.5 animate-spin-slow ${
                isDark ? 'text-purple-400' : 'text-indigo-600'
              }`} />
              <span className="uppercase">{lang}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${
                isDark ? 'text-purple-400' : 'text-slate-500'
              } ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl p-2 z-50 border ${
                    isDark
                      ? 'bg-[#150f29] border-purple-900/60 text-slate-200'
                      : 'glass-container-liquid border-white/60'
                  }`}
                >
                  <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
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
                          console.log(`[Google Analytics event] Language switched to: ${item.code}`);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium w-full text-left transition-all cursor-pointer ${
                          lang === item.code 
                            ? isDark
                              ? 'bg-purple-900/20 text-white font-bold'
                              : 'bg-indigo-600/10 text-indigo-950 font-bold' 
                            : isDark
                              ? 'text-purple-300 hover:bg-purple-900/10 hover:text-white'
                              : 'text-slate-700 hover:bg-white/50 hover:text-slate-950'
                        }`}
                      >
                        <span>{item.label}</span>
                        {lang === item.code && (
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isDark ? 'bg-purple-400' : 'bg-indigo-650'
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Content Hub */}
      <main className="max-w-7xl mx-auto w-full flex-grow relative z-10 select-none px-4 sm:px-6">
        
        {/* Two-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Column (col-span-8): holds the Prompt controller card and Results section sequentially */}
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Top Input controller card (Landscape Glassmorphic slab) */}
          <section className={`rounded-[32px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
            isDark 
              ? 'bg-zinc-950/75 border-zinc-800 shadow-[0_15px_50px_rgba(0,0,0,0.65)] text-slate-100' 
              : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50 text-slate-800'
          }`}>
            
            {/* Soft top lighting */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/10 pb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
                    isDark 
                      ? 'bg-zinc-800/55 text-zinc-300 border-zinc-700/50' 
                      : 'bg-indigo-55/65 text-indigo-600 border-indigo-100/50'
                  }`}>
                    {lang === 'bn' ? 'অনলাইন টুল' : lang === 'es' ? 'Herramienta gratuita' : 'Global Application'}
                  </span>
                  <p className={`font-medium text-sm mt-2 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-650'}`}>
                    {t.subtitle}
                  </p>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-400">
                  UTC Standard Algorithm • Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
              </div>

              {calcMode === 'time' ? (
                <form onSubmit={handleTimeCalculate} id="time-calculator-form" className="space-y-6">
                  
                  {/* Landscape layout for Time calculation */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left">
                    
                    {/* Starting Time Box */}
                    <div className={`lg:col-span-5 p-4 rounded-3xl border space-y-3 ${
                      isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/40 border-slate-200/40 shadow-inner'
                    }`}>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === 'bn' ? 'প্রারম্ভিক সময়' : lang === 'es' ? 'Tiempo Inicial' : 'Starting Time'}</span>
                      </span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'ঘণ্টা' : lang === 'es' ? 'Horas' : 'Hours'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={timeH1 || ''}
                            onChange={(e) => setTimeH1(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full glass-input-liquid rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'মিনিট' : lang === 'es' ? 'Minutos' : 'Minutes'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="0"
                            value={timeM1 || ''}
                            onChange={(e) => setTimeM1(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="w-full glass-input-liquid rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'সেকেন্ড' : lang === 'es' ? 'Segundos' : 'Seconds'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="0"
                            value={timeS1 || ''}
                            onChange={(e) => setTimeS1(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="w-full glass-input-liquid rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Operator Box */}
                    <div className="lg:col-span-2 flex flex-col justify-center items-center gap-1.5 py-1">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 leading-none">
                        {lang === 'bn' ? 'ক্রিয়া' : lang === 'es' ? 'Operación' : 'Action'}
                      </span>
                      <div className="flex lg:flex-col gap-2 w-full max-w-[140px]">
                        <button
                          type="button"
                          onClick={() => setTimeOp('+')}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                            timeOp === '+'
                              ? 'bg-slate-950 text-white border-slate-950 shadow-sm shadow-slate-950/20'
                              : 'bg-white/40 text-slate-650 hover:bg-white border-slate-200'
                          }`}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimeOp('-')}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                            timeOp === '-'
                              ? 'bg-slate-950 text-white border-slate-950 shadow-sm shadow-slate-950/20'
                              : 'bg-white/40 text-slate-650 hover:bg-white border-slate-200'
                          }`}
                        >
                          -
                        </button>
                      </div>
                    </div>

                    {/* Adjustment Time Box */}
                    <div className={`lg:col-span-5 p-4 rounded-3xl border space-y-3 ${
                      isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/40 border-slate-200/40 shadow-inner'
                    }`}>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === 'bn' ? 'সমন্বয় করার সময়' : lang === 'es' ? 'Tiempo de Ajuste' : 'Adjustment Time'}</span>
                      </span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'ঘণ্টা' : lang === 'es' ? 'Horas' : 'Hours'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={timeH2 || ''}
                            onChange={(e) => setTimeH2(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full glass-input-liquid rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'মিনিট' : lang === 'es' ? 'Minutos' : 'Minutes'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="0"
                            value={timeM2 || ''}
                            onChange={(e) => setTimeM2(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="w-full glass-input-liquid rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'সেকেন্ড' : lang === 'es' ? 'Segundos' : 'Seconds'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="0"
                            value={timeS2 || ''}
                            onChange={(e) => setTimeS2(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            className="w-full glass-input-liquid rounded-xl py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submissions Action triggers */}
                  <div className="flex gap-2.5 pt-2 max-w-xs mx-auto">
                    <button
                      type="submit"
                      className="flex-grow flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold transition-all cursor-pointer text-xs tracking-wide shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>{lang === 'bn' ? 'হিসাব করুন' : lang === 'es' ? 'Calcular Tiempo' : 'Calculate Duration'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTimeReset}
                      className="p-3 rounded-2xl bg-white/40 hover:bg-slate-100/80 border border-slate-200/60 text-slate-705 transition-all cursor-pointer shadow-sm"
                      title="Reset parameters"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-650" />
                    </button>
                  </div>
                </form>
              ) : calcMode === 'compare' ? (
                <form onSubmit={handleCompareCalculate} id="age-comparison-form" className="space-y-6">
                  
                  {/* Age Comparison landscape inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    
                    {/* Person A Card */}
                    <div className={`p-5 rounded-3xl border space-y-4 ${
                      isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/40 border-slate-200/40 shadow-inner'
                    }`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200/10">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500">
                          {lang === 'bn' ? 'প্রথম ব্যক্তি (Person A)' : lang === 'es' ? 'Persona A' : 'Person A'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'নাম' : lang === 'es' ? 'Nombre' : 'Name'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Liam"
                            value={compName1}
                            onChange={(e) => setCompName1(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'জন্ম তারিখ' : lang === 'es' ? 'Fecha de Nacimiento' : 'Date of Birth'} *
                          </label>
                          <input
                            type="date"
                            value={compDob1}
                            onChange={(e) => setCompDob1(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'জন্ম সময় (ঐচ্ছিক)' : lang === 'es' ? 'Hora (Opcional)' : 'Birth Time (Optional)'}
                          </label>
                          <input
                            type="time"
                            value={compTime1}
                            onChange={(e) => setCompTime1(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Person B Card */}
                    <div className={`p-5 rounded-3xl border space-y-4 ${
                      isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/40 border-slate-200/40 shadow-inner'
                    }`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200/10">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500">
                          {lang === 'bn' ? 'দ্বিতীয় ব্যক্তি (Person B)' : lang === 'es' ? 'Persona B' : 'Person B'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'নাম' : lang === 'es' ? 'Nombre' : 'Name'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Olivia"
                            value={compName2}
                            onChange={(e) => setCompName2(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'জন্ম তারিখ' : lang === 'es' ? 'Fecha de Nacimiento' : 'Date of Birth'} *
                          </label>
                          <input
                            type="date"
                            value={compDob2}
                            onChange={(e) => setCompDob2(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'জন্ম সময় (ঐচ্ছিক)' : lang === 'es' ? 'Hora (Opcional)' : 'Birth Time (Optional)'}
                          </label>
                          <input
                            type="time"
                            value={compTime2}
                            onChange={(e) => setCompTime2(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Error Banner */}
                  {errorText && (
                    <p className="text-xs text-rose-750 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-medium max-w-md mx-auto">
                      {errorText}
                    </p>
                  )}

                  {/* Submissions Action triggers for Compare Mode */}
                  <div className="flex gap-2.5 pt-2 max-w-xs mx-auto">
                    <button
                      type="submit"
                      className="flex-grow flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold transition-all cursor-pointer text-xs tracking-wide shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>{lang === 'bn' ? 'বয়স তুলনা করুন' : lang === 'es' ? 'Comparar Edades' : 'Compare Ages'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCompDob1('');
                        setCompDob2('');
                        setCompTime1('00:00');
                        setCompTime2('00:00');
                        setCompName1('Person A');
                        setCompName2('Person B');
                        setComparisonResult(null);
                        setErrorText('');
                      }}
                      className="p-3 rounded-2xl bg-white/40 hover:bg-slate-100/80 border border-slate-200/60 text-slate-705 transition-all cursor-pointer shadow-sm"
                      title="Reset parameters"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-650" />
                    </button>
                  </div>
                </form>
              ) : calcMode === 'anniversary' ? (
                <form onSubmit={handleAnniversaryCalculate} id="anniversary-calculator-form" className="space-y-6">
                  
                  {/* Anniversary Landscape inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className={`p-5 rounded-3xl border space-y-4 md:col-span-2 ${
                      isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/40 border-slate-200/40 shadow-inner'
                    }`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200/10">
                        <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                        <span className="text-xs font-black tracking-wider uppercase text-slate-500">
                          {lang === 'bn' ? 'বার্ষিকী বিবরণ' : lang === 'es' ? 'Detalles del Aniversario' : 'Anniversary Details'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'বার্ষিকীর শিরোনাম (যেমন: আমাদের বিয়ে)' : lang === 'es' ? 'Título (ej. Nuestra Boda)' : 'Anniversary Title (e.g. Wedding)'}
                          </label>
                          <input
                            type="text"
                            placeholder="Our Wedding, Career Start..."
                            value={anniversaryTitle}
                            onChange={(e) => setAnniversaryTitle(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'বার্ষিকীর ধরন' : lang === 'es' ? 'Tipo' : 'Event Type'}
                          </label>
                          <select
                            value={anniversaryType}
                            onChange={(e) => setAnniversaryType(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm border border-slate-200/50 cursor-pointer"
                          >
                            <option value="wedding">Wedding 💍</option>
                            <option value="relationship">Relationship ❤️</option>
                            <option value="career">Career Start 💼</option>
                            <option value="other">Other Milestone 🎉</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'তারিখ' : lang === 'es' ? 'Fecha' : 'Date'} *
                          </label>
                          <input
                            type="date"
                            value={anniversaryDate}
                            onChange={(e) => setAnniversaryDate(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm border border-slate-200/50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                            {lang === 'bn' ? 'সময় (ঐচ্ছিক)' : lang === 'es' ? 'Hora (Opcional)' : 'Time (Optional)'}
                          </label>
                          <input
                            type="time"
                            value={anniversaryTime}
                            onChange={(e) => setAnniversaryTime(e.target.value)}
                            className="w-full glass-input-liquid rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm border border-slate-200/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {errorText && (
                    <p className="text-xs text-rose-750 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-medium max-w-md mx-auto">
                      {errorText}
                    </p>
                  )}

                  <div className="flex gap-2.5 pt-2 max-w-xs mx-auto">
                    <button
                      type="submit"
                      className="flex-grow flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold transition-all cursor-pointer text-xs tracking-wide shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>{lang === 'bn' ? 'বার্ষিকী হিসাব করুন' : lang === 'es' ? 'Calcular Aniversario' : 'Calculate Anniversary'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAnniversaryReset}
                      className="p-3 rounded-2xl bg-white/40 hover:bg-slate-100/80 border border-slate-200/60 text-slate-705 transition-all cursor-pointer shadow-sm"
                      title="Reset parameters"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-650" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCalculate} id="age-selector-form" className="space-y-6">
                  
                  {/* Cohesive Prompt input bar for Date of Birth & Voice control */}
                  <div className="space-y-3 text-left">
                    <label className="block text-[10px] font-black tracking-widest text-slate-500 dark:text-zinc-400 uppercase">
                      {t.birthDateLabel} *
                    </label>
                    
                    <div className="relative flex flex-col sm:flex-row sm:items-center w-full gap-3 bg-white/40 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800 rounded-3xl p-3 shadow-md focus-within:ring-2 focus-within:ring-indigo-500/25 dark:focus-within:ring-purple-500/25 transition-all">
                      {/* Left icon */}
                      <div className="flex items-center gap-2 pl-1.5 justify-center sm:justify-start">
                        <Calendar className="w-5 h-5 text-indigo-500 dark:text-purple-400" />
                      </div>

                      {/* Day, Month, Year dropdown selects */}
                      <div className="flex-grow flex items-center justify-center sm:justify-start gap-1">
                        <select
                          value={selectedDay}
                          onChange={(e) => {
                            setSelectedDay(e.target.value);
                            handleDropdownDateChange(selectedYear, selectedMonth, e.target.value);
                          }}
                          className="bg-transparent border-none outline-none text-sm font-bold text-slate-805 dark:text-zinc-100 focus:ring-0 p-1 cursor-pointer w-auto"
                          required
                        >
                          <option value="" className="text-slate-400 bg-white dark:bg-zinc-900">
                            {lang === 'ko' ? '일' : lang === 'zh' ? '日' : lang === 'es' ? 'Día' : 'Day'}
                          </option>
                          {Array.from(
                            { length: getDaysInMonth(selectedYear, selectedMonth) },
                            (_, i) => (i + 1).toString().padStart(2, '0')
                          ).map((v) => (
                            <option key={v} value={v} className="text-slate-900 bg-white dark:bg-zinc-900 dark:text-zinc-150">
                              {parseInt(v)}
                            </option>
                          ))}
                        </select>

                        <span className="text-slate-300 dark:text-zinc-700 font-medium">/</span>

                        <select
                          value={selectedMonth}
                          onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            handleDropdownDateChange(selectedYear, e.target.value, selectedDay);
                          }}
                          className="bg-transparent border-none outline-none text-sm font-bold text-slate-805 dark:text-zinc-100 focus:ring-0 p-1 cursor-pointer w-auto"
                          required
                        >
                          <option value="" className="text-slate-400 bg-white dark:bg-zinc-900">
                            {lang === 'ko' ? '월' : lang === 'zh' ? '月' : lang === 'es' ? 'Mes' : 'Month'}
                          </option>
                          {getMonthNames().map((name, i) => {
                            const val = (i + 1).toString().padStart(2, '0');
                            return (
                              <option key={val} value={val} className="text-slate-900 bg-white dark:bg-zinc-900 dark:text-zinc-150">
                                {name}
                              </option>
                            );
                          })}
                        </select>

                        <span className="text-slate-300 dark:text-zinc-700 font-medium">/</span>

                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            setSelectedYear(e.target.value);
                            handleDropdownDateChange(e.target.value, selectedMonth, selectedDay);
                          }}
                          className="bg-transparent border-none outline-none text-sm font-bold text-slate-805 dark:text-zinc-100 focus:ring-0 p-1 cursor-pointer w-auto"
                          required
                        >
                          <option value="" className="text-slate-400 bg-white dark:bg-zinc-900">
                            {lang === 'ko' ? '연도' : lang === 'zh' ? '年' : lang === 'es' ? 'Año' : 'Year'}
                          </option>
                          {yearsList.map((y) => (
                            <option key={y} value={y} className="text-slate-900 bg-white dark:bg-zinc-900 dark:text-zinc-150">
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Divider */}
                      <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-zinc-800" />

                      {/* Voice Microphone icon */}
                      <div className="flex items-center gap-2 justify-center sm:justify-end">
                        {isSpeechSupported ? (
                          <div className="relative group/tooltip">
                            {!isListening ? (
                              <button
                                type="button"
                                onClick={startSpeechRecognition}
                                className="p-2 rounded-full hover:bg-slate-105 dark:hover:bg-zinc-800 text-slate-500 hover:text-indigo-600 dark:hover:text-purple-400 transition-all cursor-pointer relative"
                                title="Start voice DOB input"
                              >
                                <Mic className="w-5 h-5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={stopSpeechRecognition}
                                className="p-2 rounded-full bg-rose-500 text-white animate-pulse cursor-pointer shadow-md relative"
                                title="Stop voice listening"
                              >
                                <MicOff className="w-5 h-5" />
                              </button>
                            )}

                            {/* Tooltip hovering saying speaking format */}
                            <div className="pointer-events-none absolute bottom-full right-1/2 translate-x-1/2 mb-2.5 w-max max-w-xs scale-90 opacity-0 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 transition-all duration-200 z-50">
                              <div className="bg-slate-950 text-white text-[10px] font-black py-1 px-3 rounded-lg shadow-xl border border-slate-800">
                                {lang === 'bn' ? 'বলুন: "২৫ ডিসেম্বর ১৯৯৫"' : lang === 'es' ? 'Diga: "25 de diciembre de 1995"' : 'Say: "25 December 1995"'}
                              </div>
                              <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-800 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[5px]" />
                            </div>
                          </div>
                        ) : (
                          <Mic className="w-5 h-5 text-slate-350 dark:text-zinc-650 opacity-40" />
                        )}

                        {/* Speech Equalizer wave animation */}
                        {isListening && (
                          <div className="flex items-center gap-0.5 h-4 px-1">
                            <span className="w-0.75 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                            <span className="w-0.75 h-4 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <span className="w-0.75 h-3 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Speech transcript status banners */}
                  {isSpeechSupported && voiceStatus && (
                    <div className="flex items-center justify-start px-2 pb-3">
                      {voiceStatus === 'listening' && (
                        <p className="text-xs text-indigo-600 dark:text-purple-400 italic font-semibold animate-pulse">
                          {t.voiceListening}
                        </p>
                      )}
                      {voiceStatus === 'success' && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-450 font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span>{t.voiceSuccess}: "{spokenText}"</span>
                        </p>
                      )}
                      {voiceStatus === 'error' && (
                        <p className="text-xs text-rose-605 font-semibold font-mono">
                          {errorText}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Collapsible settings for Time of birth and region */}
                  <div className={`rounded-2xl border text-left ${isDark ? 'border-zinc-850 bg-zinc-900/25' : 'border-slate-200/60 bg-slate-50/50'}`}>
                    <details className="group">
                      <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-bold text-xs text-slate-705 dark:text-zinc-350 hover:text-slate-900 dark:hover:text-white transition-all list-none">
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-indigo-500" />
                          {lang === 'bn' ? 'অতিরিক্ত সেটিংস (ঐচ্ছিক)' : lang === 'es' ? 'Ajustes Adicionales (Opcional)' : 'Advanced Settings (Optional)'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                      </summary>
                      <div className="p-4 pt-0 border-t border-slate-200/30 dark:border-zinc-800/30 space-y-4 text-left">
                        {/* Time of Birth */}
                        <div>
                          <label className="block text-[9px] font-bold text-slate-505 dark:text-zinc-405 mb-1.5 uppercase">
                            {t.birthTimeLabel}
                          </label>
                          <input
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className={`rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 ${
                              isDark ? 'bg-zinc-950 border-zinc-850 text-white focus:ring-purple-500/20 shadow-sm' : 'bg-white border-slate-200 text-slate-800 focus:ring-indigo-500/20 shadow-sm'
                            }`}
                          />
                        </div>

                        {/* Expected lifespan region */}
                        <div className="space-y-2">
                          <label className="block text-[9px] font-bold text-slate-505 dark:text-zinc-405 uppercase">
                            {lang === 'bn' ? 'অঞ্চল ও গড় আয়ুষ্কাল' : lang === 'es' ? 'Región y Esperanza de Vida' : 'Region & Lifespan Expectancy'}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={selectedRegion}
                              onChange={(e) => {
                                const code = e.target.value;
                                setSelectedRegion(code);
                                if (code !== 'custom') {
                                  const found = regionsList.find(r => r.code === code);
                                  if (found) {
                                    setExpectancyLevel(found.expectancy);
                                  }
                                }
                              }}
                              className={`rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 ${
                                isDark ? 'bg-zinc-950 border-zinc-850 text-white focus:ring-purple-500/20' : 'bg-white border-slate-200 text-slate-850 focus:ring-indigo-500/20'
                              }`}
                            >
                              {regionsList.map((r) => (
                                <option key={r.code} value={r.code} className="text-slate-900 bg-white">
                                  {r.flag} {r.names[lang] || r.names['en']} ({r.expectancy} yrs)
                                </option>
                              ))}
                              <option value="custom" className="text-slate-900 bg-white">
                                ⚙️ Custom Expectancy
                              </option>
                            </select>

                            {selectedRegion === 'custom' && (
                              <input
                                type="number"
                                min="1"
                                max="150"
                                step="0.1"
                                value={expectancyLevel}
                                onChange={(e) => {
                                  setSelectedRegion('custom');
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val)) {
                                    setExpectancyLevel(val);
                                  }
                                }}
                                className={`w-24 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 ${
                                  isDark ? 'bg-zinc-950 border-zinc-850 text-white focus:ring-purple-500/20 shadow-sm' : 'bg-white border-slate-200 text-slate-850 focus:ring-indigo-500/20 shadow-sm'
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>

                  {/* Error Banner */}
                  {errorText && voiceStatus !== 'error' && (
                    <p className="text-xs text-rose-750 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-medium max-w-md mx-auto">
                      {errorText}
                    </p>
                  )}

                  {/* Submissions Action triggers */}
                  <div className="flex gap-2.5 pt-2 max-w-xs mx-auto">
                    <button
                      type="submit"
                      className="flex-grow flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold transition-all cursor-pointer text-xs tracking-wide shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>{t.calculateBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-3 rounded-2xl bg-white/40 hover:bg-slate-100/80 border border-slate-200/60 text-slate-705 transition-all cursor-pointer shadow-sm"
                      title="Reset parameters"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-650" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Static footer message for SEO indexing */}
            <div className="pt-6 mt-6 border-t border-slate-200/10 text-[9px] text-slate-400 leading-relaxed font-mono">
              Universal UTC standard algorithm. Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>

          </section>

          {/* Right Area panel: Real-time values output displays */}
          <section ref={resultsSectionRef} className="lg:col-span-7 flex flex-col gap-6">
            
            <AnimatePresence mode="wait">
              {calcMode === 'time' && timeResult ? (
                <motion.div
                  key="time-results-panel"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout="position"
                  className={`rounded-[40px] p-6 sm:p-8 space-y-6 relative overflow-hidden border transition-all duration-300 ${
                    isDark 
                      ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100 shadow-xl' 
                      : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50 text-slate-800'
                  }`}
                >
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-zinc-500/5 rounded-full filter blur-2xl" />

                  <motion.div variants={itemVariants} className="pb-6 border-b border-slate-200/30 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 font-mono">
                      {lang === 'bn' ? 'ফলাফল' : lang === 'es' ? 'Resultado' : 'Time Computation Result'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight mt-1">
                      {timeResult.formatted}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2">
                      {lang === 'bn' 
                        ? 'প্রারম্ভিক সময় এবং সমন্বয় করার সময় যোগ/বিয়োগ করে নিরূপিত মান' 
                        : lang === 'es' 
                        ? 'La diferencia o suma exacta de los tiempos ingresados' 
                        : 'Exact computed duration based on your specified input values'}
                    </p>
                  </motion.div>

                  {/* Detailed breakdowns */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-450 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{lang === 'bn' ? 'বিস্তারিত পরিসংখ্যান' : lang === 'es' ? 'Desglose Detallado' : 'Detailed breakdown'}</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-slate-800 dark:text-zinc-200">
                      <div className={`p-4 rounded-2xl border text-center sm:text-left shadow-sm ${
                        isDark ? 'bg-zinc-850/50 border-zinc-800' : 'bg-white/60 border-slate-150'
                      }`}>
                        <span className="text-slate-400 uppercase text-[9px] block leading-none font-bold">
                          {lang === 'bn' ? 'মোট দিন' : lang === 'es' ? 'Días Totales' : 'Total Days'}
                        </span>
                        <span className="text-slate-950 dark:text-white font-extrabold text-xs block mt-1">
                          {timeResult.totalDays.toLocaleString()} {lang === 'bn' ? 'দিন' : 'days'}
                        </span>
                      </div>
                      <div className={`p-4 rounded-2xl border text-center sm:text-left shadow-sm ${
                        isDark ? 'bg-zinc-850/50 border-zinc-800' : 'bg-white/60 border-slate-150'
                      }`}>
                        <span className="text-slate-400 uppercase text-[9px] block leading-none font-bold">
                          {lang === 'bn' ? 'মোট ঘণ্টা' : lang === 'es' ? 'Horas Totales' : 'Total Hours'}
                        </span>
                        <span className="text-slate-950 dark:text-white font-extrabold text-xs block mt-1">
                          {timeResult.totalHours.toLocaleString()} {lang === 'bn' ? 'ঘণ্টা' : 'hrs'}
                        </span>
                      </div>
                      <div className={`p-4 rounded-2xl border text-center sm:text-left shadow-sm ${
                        isDark ? 'bg-zinc-850/50 border-zinc-800' : 'bg-white/60 border-slate-150'
                      }`}>
                        <span className="text-slate-400 uppercase text-[9px] block leading-none font-bold">
                          {lang === 'bn' ? 'মোট মিনিট' : lang === 'es' ? 'Minutos Totales' : 'Total Minutes'}
                        </span>
                        <span className="text-slate-950 dark:text-white font-extrabold text-xs block mt-1">
                          {timeResult.totalMinutes.toLocaleString()} {lang === 'bn' ? 'মিনিট' : 'mins'}
                        </span>
                      </div>
                      <div className={`p-4 rounded-2xl border text-center sm:text-left shadow-sm ${
                        isDark ? 'bg-zinc-850/50 border-zinc-800' : 'bg-white/60 border-slate-150'
                      }`}>
                        <span className="text-slate-400 uppercase text-[9px] block leading-none font-bold">
                          {lang === 'bn' ? 'মোট সেকেন্ড' : lang === 'es' ? 'Segundos Totales' : 'Total Seconds'}
                        </span>
                        <span className="text-slate-950 dark:text-white font-extrabold text-xs block mt-1">
                          {timeResult.totalSeconds.toLocaleString()} {lang === 'bn' ? 'সেকেন্ড' : 'secs'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key={`results-panel-${singleCalcCount}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout="position"
                  className={`rounded-[40px] p-6 sm:p-8 space-y-6 relative overflow-hidden border transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#120a22]/70 border-purple-900/40 shadow-[0_15px_50px_rgba(0,0,0,0.5)] text-slate-100' 
                      : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50 text-slate-800'
                  }`}
                >
                  {/* Decorative glowing back light */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500/5 rounded-full filter blur-2xl" />

                  {/* Top results header card: Avatar + Big Age categories */}
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-indigo-100/50">
                    
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
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-slate-900">
                            {result.years}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{t.years}</span>
                        </div>
                        <div className="px-3.5 py-3 rounded-2xl bg-white/70 border border-white/90 flex flex-col items-center sm:items-start justify-center shadow-sm">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-slate-900">
                            {result.months}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{t.months}</span>
                        </div>
                        <div className="px-3.5 py-3 rounded-2xl bg-white/70 border border-white/90 flex flex-col items-center sm:items-start justify-center shadow-sm">
                          <span className="font-display text-2xl sm:text-3.5xl font-black text-slate-900">
                            {result.days}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{t.days}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Chronological Breakdown Stats */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-650 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                      {t.statsTitle}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px] text-slate-800">
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm text-center sm:text-left">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.weeks}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalWeeks.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm text-center sm:text-left">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.days}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalDays.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm text-center sm:text-left">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.hours}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalHours.toLocaleString()}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/55 border border-white/80 space-y-1 shadow-sm text-center sm:text-left">
                        <span className="text-slate-500 uppercase text-[9px] block leading-none font-bold">{t.seconds}</span>
                        <span className="text-slate-950 font-extrabold text-xs">{result.totalSeconds.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Zodiac and Astrology Section */}
                  {(() => {
                    const dobDate = new Date(dob);
                    if (!isNaN(dobDate.getTime())) {
                      const western = getWesternZodiac(dobDate);
                      const chinese = getChineseZodiac(dobDate.getFullYear());
                      return (
                        <motion.div variants={itemVariants} className="space-y-4">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{lang === 'bn' ? 'রাশি ও ব্যক্তিত্ব' : lang === 'es' ? 'ZODIACO Y PERSONALIDAD' : 'ZODIAC & ASTROLOGY'}</span>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Western Zodiac */}
                            <div className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                              isDark 
                                ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-100' 
                                : 'bg-white/60 border-slate-100/80 shadow-sm text-slate-800'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                                  {lang === 'bn' ? 'পাশ্চাত্য রাশি' : lang === 'es' ? 'Signo Occidental' : 'Western Sign'}
                                </span>
                                <span className="text-2xl" role="img" aria-label={western.sign}>{western.emoji}</span>
                              </div>
                              <div className="mt-3 text-left">
                                <h4 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                                  {lang === 'bn' ? western.sign : lang === 'es' ? western.sign : western.sign}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
                                  "{western.personality[lang] || western.personality['en']}"
                                </p>
                              </div>
                            </div>

                            {/* Chinese Zodiac */}
                            <div className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                              isDark 
                                ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-100' 
                                : 'bg-white/60 border-slate-100/80 shadow-sm text-slate-800'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                                  {lang === 'bn' ? 'চীনা রাশি' : lang === 'es' ? 'Signo Chino' : 'Chinese Sign'}
                                </span>
                                <span className="text-2xl" role="img" aria-label={chinese.sign}>{chinese.emoji}</span>
                              </div>
                              <div className="mt-3 text-left">
                                <h4 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                                  {lang === 'bn' ? chinese.sign : lang === 'es' ? chinese.sign : chinese.sign}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
                                  "{chinese.personality[lang] || chinese.personality['en']}"
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })()}

                  {/* Next Birthday Details display */}
                  <motion.div variants={itemVariants} className="p-5 rounded-[30px] bg-slate-50/40 backdrop-blur-md border border-slate-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-900 font-bold block">
                        {t.nextBirthday}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                        {t.birthdayCountdown}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="font-display text-xl sm:text-2xl font-black text-slate-900 block leading-none mb-1">
                          {result.nextBirthdayDays} {t.days.toLowerCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          {t.nextBirthdayDay}: <span className="text-slate-900 font-bold">{lang === 'hi' || lang === 'bn' || lang === 'ja' || lang === 'ar' ? result.nextBirthdayDate.toLocaleDateString(lang, { weekday: 'long' }) : result.nextBirthdayWeekday}</span>
                        </span>
                      </div>
                      <span className="p-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                        <Award className="w-5 h-5" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Celebrities & Historical Figures born on this Date */}
                  {(() => {
                    const dobDate = new Date(dob);
                    const birthMonth = dobDate.getMonth() + 1;
                    const birthDay = dobDate.getDate();
                    const celebs = getCelebritiesForDate(birthMonth, birthDay);
                    
                    const titleText = lang === 'bn' 
                      ? '🌟 একই জন্মদিনের বিখ্যাত ব্যক্তিত্ব' 
                      : lang === 'es' 
                      ? '🌟 Celebridades nacidas en tu cumpleaños' 
                      : '🌟 Celebrities Born on Your Birthday';
                      
                    const subtitleText = lang === 'bn'
                      ? 'আপনার জন্মতারিখের শুভ ক্ষণে ইতিহাস কাঁপানো যেসকল মনীষীরা জন্মেছিলেন:'
                      : lang === 'es'
                      ? 'Figuras históricas e iconos inspiradores que comparten tu fecha de nacimiento:'
                      : 'Inspirational historical figures & icons who share your exact calendar birth date:';

                    return (
                      <motion.div 
                        variants={itemVariants} 
                        className="p-6 rounded-[35px] bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-pink-500/5 border border-amber-500/15 shadow-sm space-y-4 relative overflow-hidden"
                      >
                        {/* Decorative floating star background glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full filter blur-2xl" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/20 pb-3">
                          <div className="space-y-0.5 text-left">
                            <h4 className="font-display font-black text-slate-900 text-base flex items-center gap-1.5">
                              {titleText}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                              {subtitleText}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              downloadBirthInfoSheet();
                            }}
                            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20 hover:bg-amber-500/20 active:scale-[0.98] transition-all cursor-pointer shadow-sm ml-auto sm:ml-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'bn' 
                                ? 'জন্ম তথ্য ও তারকা তালিকা ডাউনলোড' 
                                : lang === 'es' 
                                ? 'Descargar Ficha' 
                                : 'Download Birth Info Sheet'}
                            </span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {celebs.map((c, idx) => {
                            const desc = c.descriptions[lang] || c.descriptions['en'];
                            const achievement = c.achievement[lang] || c.achievement['en'];
                            const bornYearText = c.year > 0 ? `${c.year} AD` : `${Math.abs(c.year)} BC`;

                            return (
                              <div 
                                key={idx} 
                                className={`p-4 rounded-2xl flex flex-col justify-between space-y-2.5 transition-all text-left border shadow-sm ${
                                  isDark
                                    ? 'bg-purple-950/40 border-purple-900/35 hover:border-amber-500/50 hover:bg-purple-900/10 text-slate-100'
                                    : 'bg-white/70 backdrop-blur-sm border-slate-100 hover:border-amber-350 hover:bg-white/95 text-slate-800'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xl">{c.icon}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold font-mono border ${
                                      isDark
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                        : 'bg-amber-500/10 text-amber-800 border-amber-500/10'
                                    }`}>
                                      {bornYearText}
                                    </span>
                                  </div>
                                  <h5 className={`font-display font-black text-xs tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {c.name}
                                  </h5>
                                  <p className={`text-[10px] leading-relaxed font-semibold ${isDark ? 'text-purple-300/80' : 'text-slate-500'}`}>
                                    {desc}
                                  </p>
                                </div>
                                <div className={`pt-2 border-t flex items-center justify-between gap-1 ${isDark ? 'border-purple-900/30' : 'border-slate-100/50'}`}>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-pink-500 block truncate max-w-[60%]">
                                    {achievement}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCelebrity(c);
                                      setIsSocialCardOpen(true);
                                    }}
                                    className={`px-2 py-1 rounded-lg transition-all text-[8.5px] font-bold cursor-pointer flex items-center gap-1 shadow-sm active:scale-[0.98] ${
                                      isDark
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                                        : 'bg-indigo-600 hover:bg-indigo-750 text-white'
                                    }`}
                                  >
                                    <Share2 className="w-2.5 h-2.5" />
                                    <span>Twin Card</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* Sands of Time Hourglass Interactive Animation */}
                  <motion.div variants={itemVariants}>
                    <SandsOfTime lang={lang} isDark={isDark} birthDate={dob} />
                  </motion.div>

                  {/* Emotional Countdown and Country Lifespan Index Container */}
                  {lifespanMetrics && (
                    <motion.div variants={itemVariants} className="p-6 rounded-[35px] bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border border-indigo-500/20 shadow-2xl space-y-6 relative overflow-hidden">
                      {/* Ambient floating star particles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse" />

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping inline-block" />
                            {lang === 'bn' ? 'আয়ুষ্কাল কাউন্টডাউন' : lang === 'es' ? 'Cuenta Regresiva de Vida' : 'Life Expectancy Countdown'}
                          </span>
                          <h4 className="font-display font-black text-base text-slate-100">
                            {lang === 'bn' 
                              ? 'আমাদের সময় কিন্তু ফুরিয়ে আসছে...' 
                              : lang === 'es' 
                              ? 'Nuestros días están contados...' 
                              : 'The Sands of Time are Slipping...'}
                          </h4>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-wider">
                          {selectedRegion === 'custom' 
                            ? (lang === 'bn' ? '⚙️ কাস্টম সূচক' : lang === 'es' ? '⚙️ Personalizado' : '⚙️ Custom Index')
                            : `${regionsList.find(r => r.code === selectedRegion)?.flag || '🌐'} ${regionsList.find(r => r.code === selectedRegion)?.names[lang] || regionsList.find(r => r.code === selectedRegion)?.names['en'] || 'Global'}`
                          }
                        </div>
                      </div>

                      {/* Decimals Live-Ticking display */}
                      <div className="text-center space-y-2 py-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold block">
                          {lang === 'bn' ? 'গড় আয়ু অনুযায়ী অবশিষ্ট সময় (বছর)' : lang === 'es' ? 'Años estimados restantes (Tiempo real)' : 'Estimated Years Remaining (Ticking Real-time)'}
                        </span>
                        
                        <div className="font-mono font-black text-3xl sm:text-4.5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-yellow-300 select-all leading-none py-1 drop-shadow-sm">
                          {lifespanMetrics.yearsLeftFloating.toFixed(9)}
                        </div>

                        <p className="text-[11px] text-slate-350 leading-relaxed font-mono">
                          {lifespanMetrics.totalDaysLeft.toLocaleString()} {lang === 'bn' ? 'দিন' : lang === 'es' ? 'días' : 'days'}, {lifespanMetrics.monthsLeft} {lang === 'bn' ? 'মাস' : lang === 'es' ? 'meses' : 'months'}, {lifespanMetrics.daysLeft} {lang === 'bn' ? 'দিন' : lang === 'es' ? 'días' : 'days'} {lang === 'bn' ? 'বাকি আছে' : lang === 'es' ? 'restantes' : 'left'}
                        </p>
                      </div>

                      {/* Fluid progress completed vs remaining bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                          <span>{lang === 'bn' ? 'অতিক্রান্ত সময়' : lang === 'es' ? 'Lived' : 'Time Elapsed'}: {lifespanMetrics.percentLived.toFixed(2)}%</span>
                          <span>{lang === 'bn' ? 'বাকি সময়' : lang === 'es' ? 'Restante' : 'Remaining'}: {lifespanMetrics.percentLeft.toFixed(2)}%</span>
                        </div>
                        <div className="h-3.5 w-full bg-white/10 rounded-full p-0.5 overflow-hidden border border-white/5 relative">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md relative transition-all duration-1000"
                            style={{ width: `${lifespanMetrics.percentLived}%` }}
                          >
                            <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-lg animate-ping" />
                          </div>
                        </div>
                      </div>

                      {/* Warm and emotional wisdom quote card */}
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs leading-relaxed space-y-2 relative group hover:bg-white/8 transition-all">
                        <div className="absolute top-2.5 right-3 text-pink-400/40">
                          <Heart className="w-5 h-5 fill-current animate-pulse" />
                        </div>
                        <p className="text-slate-100 font-bold">
                          {lang === 'bn' ? '💝 জীবনের চিরন্তন সত্য' : lang === 'es' ? '💝 Sabiduría para Vivir' : '💝 Mindfulness Insight'}
                        </p>
                        <p className="text-slate-300 italic font-medium">
                          {lang === 'bn' 
                            ? '“জীবন একটি অনন্য সুন্দর উপহার, তবে এর প্রতিটি মুহূর্ত সীমিত। আমাদের সময় দিন দিন ফুরিয়ে আসছে। আগামীকালের জন্য আনন্দ জমিয়ে রাখবেন না। ভালোবাসুন, হাসুন, ক্ষমা করুন এবং প্রতি মুহূর্ত মনভরে উপভোগ করুন!”'
                            : lang === 'es'
                            ? '“La vida es un regalo hermoso pero finito. Nuestro tempo se termina día a día. No guardes tu felicidad para mañana; ama, ríe, perdona y disfruta plenamente cada segundo del presente.”'
                            : lang === 'hi'
                            ? '“जीवन एक सुंदर उपहार है, लेकिन इसके क्षण सीमित हैं। हमारा समय दिन-ब-दिन कम हो रहा है। कल के लिए खुशियों को न टालें; खुलकर प्यार करें, हँसें, माफ करें और आज के हर पल का भरपूर आनंद लें!”'
                            : lang === 'ja'
                            ? '「人生は美しい贈り物ですが、その時間は有限です।一日一日と、私たちの時間は確かに終わりへと近づいています।幸せを明日に先送りしないでください।愛し、笑い、許し、今この瞬間を心から楽しみましょう。」'
                            : '“Life is an incredible gift, but its chapters are finite. Our days are finishing one by one. Do not save your joy for tomorrow; love warmly, laugh deeply, forgive quickly, and cherish every single second of today.”'
                          }
                        </p>
                      </div>

                      {/* Dynamic Interactive Bucket-List based on Lifespan Category */}
                      {lifeSuggestions[lifespanMetrics.era] && (
                        <div className="space-y-3.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">
                              {lang === 'bn' ? '🎯 আপনার জীবন সংকল্প (বকেট লিস্ট)' : lang === 'es' ? '🎯 Tu Lista de Deseos de Vida' : '🎯 Your Active Life Bucket-List'}
                            </span>
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-bold font-mono">
                              {lifespanMetrics.era === 'long' ? (lang === 'bn' ? 'সক্রিয় অনুসন্ধান' : 'Active Exploration') : lifespanMetrics.era === 'short' ? (lang === 'bn' ? 'মননশীল অনুচিন্তন' : 'Mindful Reflection') : (lang === 'bn' ? 'উত্তরাধিকার সৃষ্টি' : 'Legacy Building')}
                            </span>
                          </div>

                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {lifeSuggestions[lifespanMetrics.era].map((sug) => {
                              const isChecked = checkedSuggestions.includes(sug.id);
                              return (
                                <div 
                                  key={sug.id}
                                  onClick={() => {
                                    setCheckedSuggestions(prev => 
                                      isChecked ? prev.filter(id => id !== sug.id) : [...prev, sug.id]
                                    );
                                    console.log(`[Google Analytics] bucket list item toggled: ${sug.id}, checked: ${!isChecked}`);
                                  }}
                                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-left ${
                                    isChecked 
                                      ? 'bg-slate-900/45 border-slate-500/40 opacity-75' 
                                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex-shrink-0 pt-0.5">
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                      isChecked 
                                        ? 'bg-slate-905 border-slate-905 text-white' 
                                        : 'border-white/30 bg-transparent'
                                    }`}>
                                      {isChecked && (
                                        <svg className="w-3 h-3 stroke-[3.5] text-white stroke-current" fill="none" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-0.5">
                                    <h5 className={`text-xs font-bold flex items-center gap-1.5 ${
                                      isChecked ? 'text-slate-400 line-through' : 'text-white'
                                    }`}>
                                      <span>{sug.icon}</span>
                                      <span>{sug.titles[lang] || sug.titles['en']}</span>
                                    </h5>
                                    <p className={`text-[10px] leading-relaxed ${
                                      isChecked ? 'text-slate-500' : 'text-slate-350 font-medium'
                                    }`}>
                                      {sug.descs[lang] || sug.descs['en']}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Export and Share Actions */}
                  <motion.div variants={itemVariants} className="pt-4 border-t border-slate-200/50 flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={exportToPDF}
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 hover:shadow-lg active:scale-[0.99] text-white font-extrabold transition-all cursor-pointer text-sm shadow-md"
                      >
                        <Download className="w-4.5 h-4.5 text-white" />
                        <span>
                          {lang === 'bn' 
                            ? 'পিডিএফ রিপোর্ট' 
                            : lang === 'es' 
                            ? 'Descargar PDF' 
                            : 'Download PDF'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShareClick}
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-white/40 border border-slate-200 hover:bg-white/80 active:scale-[0.99] text-slate-900 font-extrabold transition-all cursor-pointer text-sm shadow-md"
                      >
                        <Share2 className="w-4.5 h-4.5 text-slate-800" />
                        <span>
                          {lang === 'bn' 
                            ? 'শেয়ার করুন' 
                            : lang === 'es' 
                            ? 'Compartir Resultados' 
                            : 'Share Results'}
                        </span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold text-center font-mono">
                      {lang === 'bn' 
                        ? 'অন-ডিভাইস প্রসেসিং • ১০০% নিরাপদ ও ব্যক্তিগত এক্সপোর্ট ও শেয়ার' 
                        : lang === 'es' 
                        ? 'Procesamiento local • Exportación y compartir 100% seguros y privados' 
                        : 'On-device computation • 100% safe & private export & share'}
                    </p>
                  </motion.div>

                </motion.div>
              ) : calcMode === 'anniversary' && anniversaryResult ? (
                <motion.div
                  key={`anniversary-panel-${anniversaryCalcCount}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout="position"
                  className={`rounded-[40px] p-6 sm:p-8 space-y-6 relative overflow-hidden border transition-all duration-300 ${
                    isDark 
                      ? 'bg-zinc-950/70 border-zinc-800/40 shadow-[0_15px_50px_rgba(0,0,0,0.65)] text-slate-100' 
                      : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50 text-slate-800'
                  }`}
                >
                  {/* Decorative glowing back light */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500/5 rounded-full filter blur-2xl" />

                  {/* Header */}
                  <motion.div variants={itemVariants} className="flex items-center gap-3.5 pb-5 border-b border-slate-200/50">
                    <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100 text-pink-600">
                      <Heart className="w-5 h-5 text-pink-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-slate-900 tracking-tight">
                        {anniversaryResult.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest font-mono font-black">
                        {lang === 'bn' ? 'বার্ষিকী বিশ্লেষণ ও মাইলস্টোন' : 'Anniversary Analysis & Milestones'}
                      </p>
                    </div>
                  </motion.div>

                  {/* Core Duration Cards */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-5 rounded-3xl border text-center relative ${
                      isDark ? 'bg-zinc-900/40 border-zinc-850' : 'bg-gradient-to-br from-pink-50/40 to-white/80 border-pink-100/60 shadow-sm'
                    }`}>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase tracking-wider font-mono font-black block mb-1">
                        {lang === 'bn' ? 'মোট অতিক্রান্ত সময়' : 'Time Elapsed'}
                      </span>
                      <span className="text-3xl font-black text-slate-900 font-display block">
                        {anniversaryResult.precise.years} <span className="text-sm font-semibold text-slate-500 uppercase">years</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 block mt-1">
                        {anniversaryResult.precise.months} {lang === 'bn' ? 'মাস' : 'months'} • {anniversaryResult.precise.days} {lang === 'bn' ? 'দিন' : 'days'}
                      </span>
                    </div>

                    <div className={`p-5 rounded-3xl border text-center relative ${
                      isDark ? 'bg-zinc-900/40 border-zinc-850' : 'bg-gradient-to-br from-indigo-50/40 to-white/80 border-indigo-100/60 shadow-sm'
                    }`}>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-400 uppercase tracking-wider font-mono font-black block mb-1">
                        {lang === 'bn' ? 'পরবর্তী বার্ষিকী আসতে বাকি' : 'Next Anniversary Countdown'}
                      </span>
                      <span className="text-3xl font-black text-indigo-650 font-display block animate-bounce">
                        {anniversaryResult.nextAnnDays} <span className="text-sm font-semibold text-slate-500 uppercase">days</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 block mt-1">
                        {lang === 'bn' ? `আসবে ${anniversaryResult.nextAnnWeekday}-বারে` : `Occurring on a ${anniversaryResult.nextAnnWeekday}`}
                      </span>
                    </div>
                  </motion.div>

                  {/* Traditional and Modern Gift Recommendations */}
                  <motion.div variants={itemVariants} className={`p-5 rounded-3xl border text-left ${
                    isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/60 border-slate-150 shadow-sm'
                  }`}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      <span>{lang === 'bn' ? `${anniversaryResult.nextMilestoneYear}-তম বার্ষিকীর উপহার পরামর্শ` : `Year ${anniversaryResult.nextMilestoneYear} Gift Ideas`}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[9px] block tracking-wider">{lang === 'bn' ? 'ঐতিহ্যগত উপহার (Traditional)' : 'Traditional Gift'}</span>
                        <p className="font-semibold text-slate-850">{anniversaryResult.traditionalGift}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400 uppercase text-[9px] block tracking-wider">{lang === 'bn' ? 'আধুনিক উপহার (Modern)' : 'Modern Gift'}</span>
                        <p className="font-semibold text-slate-850">{anniversaryResult.modernGift}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Forecast List of upcoming years */}
                  <motion.div variants={itemVariants} className="space-y-3 text-left">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                      {lang === 'bn' ? 'আসন্ন বার্ষিকী মাইলস্টোন' : 'Upcoming Milestones Forecast'}
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {anniversaryResult.milestonesForecast.map((m: any) => (
                        <div
                          key={m.year}
                          className={`p-3.5 rounded-2xl border text-center transition-all ${
                            isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-slate-50/50 border-slate-100 hover:border-pink-200'
                          }`}
                        >
                          <span className="block text-xs font-black text-pink-600 mb-1">
                            Year {m.year}
                          </span>
                          <span className="block text-[10px] font-mono text-slate-400 leading-none">
                            {m.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="block text-[11px] font-extrabold text-slate-700 mt-2">
                            {m.daysRemaining.toLocaleString()} days
                          </span>
                          <span className="block text-[8px] font-mono text-slate-405 font-bold uppercase tracking-widest mt-0.5">
                            {m.weekday}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : comparisonResult ? (
                <motion.div
                  key={`comparison-panel-${compareCalcCount}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout="position"
                  className={`rounded-[40px] p-6 sm:p-8 space-y-6 relative overflow-hidden border transition-all duration-300 ${
                    isDark 
                      ? 'bg-zinc-950/70 border-zinc-800/40 shadow-[0_15px_50px_rgba(0,0,0,0.65)] text-slate-100' 
                      : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50 text-slate-800'
                  }`}
                >
                  {/* Decorative glowing back light */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-slate-500/5 rounded-full filter blur-2xl" />

                  {/* Header */}
                  <motion.div variants={itemVariants} className="flex items-center gap-3.5 pb-5 border-b border-slate-200/50">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/50 text-slate-900">
                      <User className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-slate-900 tracking-tight">
                        {lang === 'bn' ? 'বয়স তুলনা এবং ক্রোনোলজিক্যাল বন্ধন' : 'Age Comparison & Chrono Bond'}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest font-mono font-black">
                        {lang === 'bn' ? 'রিয়েল-টাইম সম্পর্ক বিশ্লেষণ' : 'Real-time relationship analysis'}
                      </p>
                    </div>
                  </motion.div>

                  {/* Side-by-side Age Cards */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Person 1 Details */}
                    <div className="p-5 rounded-3xl bg-slate-50/45 border border-slate-200/30 space-y-3 shadow-sm relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-10">
                        <User className="w-12 h-12" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {compGender1 === 'male' ? '👦' : compGender1 === 'female' ? '👧' : '👤'}
                        </span>
                        <h4 className="font-display font-black text-slate-900 text-sm truncate max-w-[120px]">
                          {compName1 || 'Person A'}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-slate-950 tracking-tight">
                          {comparisonResult.age1.years} <span className="text-xs font-bold text-slate-500 uppercase">yrs</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-550 leading-relaxed">
                          {comparisonResult.age1.months} {lang === 'bn' ? 'মাস' : 'months'} • {comparisonResult.age1.days} {lang === 'bn' ? 'দিন' : 'days'}
                        </p>
                        <p className="text-[10px] font-mono text-slate-650 font-bold">
                          {comparisonResult.age1.totalDays.toLocaleString()} {lang === 'bn' ? 'মোট দিন' : 'total days'}
                        </p>
                      </div>
                    </div>

                    {/* Person 2 Details */}
                    <div className="p-5 rounded-3xl bg-slate-50/45 border border-slate-200/30 space-y-3 shadow-sm relative overflow-hidden">
                      <div className="absolute top-2 right-2 opacity-10">
                        <User className="w-12 h-12" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {compGender2 === 'male' ? '👦' : compGender2 === 'female' ? '👧' : '👤'}
                        </span>
                        <h4 className="font-display font-black text-slate-900 text-sm truncate max-w-[120px]">
                          {compName2 || 'Person B'}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-slate-950 tracking-tight">
                          {comparisonResult.age2.years} <span className="text-xs font-bold text-slate-500 uppercase">yrs</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-550 leading-relaxed">
                          {comparisonResult.age2.months} {lang === 'bn' ? 'মাস' : 'months'} • {comparisonResult.age2.days} {lang === 'bn' ? 'দিন' : 'days'}
                        </p>
                        <p className="text-[10px] font-mono text-slate-650 font-bold">
                          {comparisonResult.age2.totalDays.toLocaleString()} {lang === 'bn' ? 'মোট দিন' : 'total days'}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Precise Comparison Statement */}
                  <motion.div variants={itemVariants} className="p-5 rounded-[30px] bg-slate-50 border border-slate-200/50 space-y-3.5 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                      <h4 className="font-display font-black text-xs uppercase text-slate-700 tracking-wider">
                        {lang === 'bn' ? 'ক্রোনোলজিক্যাল বৈপরীত্য' : 'Chronological Variance'}
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {comparisonResult.isOlder === 'same' ? (
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">
                          {lang === 'bn'
                            ? `উভয়ই ঠিক একই দিন এবং সময়ে জন্মগ্রহণ করেছেন! এটি একটি বিরল মহাজাগতিক সংযোগ!`
                            : `Both were born on the exact same day! This is a rare, cosmic chronological alignment!`}
                        </p>
                      ) : (
                        <div className="space-y-2 text-slate-800 leading-relaxed">
                          <p className="text-sm font-black text-indigo-950 leading-snug font-sans">
                            {lang === 'bn'
                              ? `🥇 ${comparisonResult.olderName}, ${comparisonResult.youngerName}-এর চেয়ে বড়!`
                              : `🥇 ${comparisonResult.olderName} is older than ${comparisonResult.youngerName}!`}
                          </p>
                          <div className="grid grid-cols-3 gap-2 bg-white/70 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/30 text-center shadow-inner">
                            <div>
                              <span className="block text-lg font-black text-indigo-950 tracking-tight">
                                {comparisonResult.diffYears}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                {lang === 'bn' ? 'বছর' : 'Years'}
                              </span>
                            </div>
                            <div>
                              <span className="block text-lg font-black text-indigo-950 tracking-tight">
                                {comparisonResult.diffMonths}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                {lang === 'bn' ? 'মাস' : 'Months'}
                              </span>
                            </div>
                            <div>
                              <span className="block text-lg font-black text-indigo-950 tracking-tight">
                                {comparisonResult.diffRemainingDays}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                                {lang === 'bn' ? 'দিন' : 'Days'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Detailed breakdowns in sub-units */}
                          <div className="pt-2.5 space-y-1.5 border-t border-slate-200/40 text-[11px] font-semibold text-slate-600 font-mono">
                            <p className="flex items-center justify-between">
                              <span>🗓️ {lang === 'bn' ? 'মোট দিনের ব্যবধান:' : 'Total Days Gap:'}</span>
                              <span className="text-slate-900 font-bold">{comparisonResult.diffDays.toLocaleString()} days</span>
                            </p>
                            <p className="flex items-center justify-between">
                              <span>⏰ {lang === 'bn' ? 'মোট ঘন্টার ব্যবধান:' : 'Total Hours Gap:'}</span>
                              <span className="text-slate-900 font-bold">{comparisonResult.diffHours.toLocaleString()} hours</span>
                            </p>
                            <p className="flex items-center justify-between">
                              <span>⏱️ {lang === 'bn' ? 'মোট সেকেন্ডের ব্যবধান:' : 'Total Seconds Gap:'}</span>
                              <span className="text-slate-900 font-bold">{comparisonResult.diffSeconds.toLocaleString()} seconds</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Overlap & compatibility index */}
                  <motion.div variants={itemVariants} className="p-5 rounded-[30px] bg-gradient-to-r from-slate-900 to-zinc-950 text-white space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-350 flex items-center gap-1.5 font-mono">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        {lang === 'bn' ? 'সম্পর্ক সূচক এবং ওভারল্যাপ' : 'Lifespan Overlap & Chemistry'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-white/10 text-white border border-white/20">
                        {comparisonResult.compatibilityScore}% Compatibility
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>⏱️ {lang === 'bn' ? 'আয়ুষ্কাল ওভারল্যাপ অনুপাত' : 'Lifespan Shared Overlap'}</span>
                          <span className="font-mono text-slate-300">{comparisonResult.overlapPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-1000"
                            style={{ width: `${comparisonResult.overlapPercentage}%` }}
                          />
                        </div>
                        <p className="text-[9.5px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
                          {lang === 'bn'
                            ? `তরুণ ব্যক্তিটি বয়োজ্যেষ্ট ব্যক্তিটির পার্থিব আয়ুষ্কালের ${comparisonResult.overlapPercentage}% শেয়ার করেছেন।`
                            : `The younger person has coexisted for ${comparisonResult.overlapPercentage}% of the older person's terrestrial lifespan.`}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Joint Milestone Countdown */}
                  <motion.div variants={itemVariants} className="p-5 rounded-[30px] bg-amber-50/45 border border-amber-200/40 text-amber-950 space-y-3 relative overflow-hidden">
                    <div className="absolute top-2 right-2 opacity-5">
                      <Calendar className="w-16 h-16 text-amber-600" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">🎉</span>
                      <h4 className="font-display font-black text-slate-900 text-xs uppercase tracking-wider">
                        {lang === 'bn' ? 'যৌথ মাইলফলক ট্র্যাকার' : 'Joint Life Milestone'}
                      </h4>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="leading-relaxed font-semibold">
                        {lang === 'bn'
                          ? `আপনাদের দুজনের মোট বেঁচে থাকা দিনের যোগফল হল `
                          : `Together, you have lived a combined total of `}
                        <strong className="font-black text-slate-950 text-sm font-mono">{comparisonResult.combinedDays.toLocaleString()}</strong>
                        {lang === 'bn' ? ` দিন।` : ` days.`}
                      </p>
                      <p className="leading-relaxed font-semibold">
                        {lang === 'bn'
                          ? `আপনাদের পরবর্তী বড় যৌথ মাইলফলক হল `
                          : `Your next joint chronological milestone is `}
                        <strong className="font-black text-slate-950 text-sm font-mono">{comparisonResult.nextMilestoneDays.toLocaleString()}</strong>
                        {lang === 'bn' ? ` দিন, যা আসবে ` : ` days, occurring on `}
                        <strong className="font-bold text-slate-900 font-mono">{comparisonResult.milestoneDate.toLocaleDateString()}</strong>!
                      </p>
                    </div>
                  </motion.div>

                  {/* Social Sharing trigger button inside Comparison */}
                  <motion.div variants={itemVariants} className="pt-4 border-t border-slate-200/40">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSocialCardOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold transition-all cursor-pointer text-sm shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>{lang === 'bn' ? 'শেয়ার কার্ড ডাউনলোড করুন' : 'Generate Shareable Card'}</span>
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="results-placeholder"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    // Prepopulate with a helpful default today/historical date so the visitor is highly engaged
                    const defaults = ['1998-10-15', '2012-05-24', '1985-12-01', '2024-02-12'];
                    const picked = defaults[Math.floor(Math.random() * defaults.length)];
                    setDob(picked);
                  }}
                  className={`rounded-[40px] p-10 h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-4 cursor-pointer transition-all relative group border ${
                    isDark 
                      ? 'bg-[#120a22]/70 border-purple-900/40 shadow-[0_15px_50px_rgba(0,0,0,0.5)] text-slate-100 hover:border-purple-500/50 hover:bg-[#1a1130]/60' 
                      : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/40 text-slate-800 hover:border-indigo-300 hover:bg-white/50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm border ${
                    isDark
                      ? 'bg-purple-950/40 border-purple-900/40 text-purple-300'
                      : 'bg-indigo-55/65 border-indigo-100 text-indigo-650 group-hover:scale-110 group-hover:bg-indigo-600/25'
                  }`}>
                    <Info className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h4 className={`font-display font-black text-lg ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {lang === 'bn' ? 'ফলাফল দেখতে জন্ম তারিখ দিন' : lang === 'es' ? 'Introduzca su fecha de nacimiento' : 'Awaiting Calculation Input'}
                    </h4>
                    <p className={`text-xs max-w-sm mt-1.5 leading-relaxed font-semibold ${isDark ? 'text-purple-300/80' : 'text-slate-500'}`}>
                      {lang === 'bn' 
                        ? 'আপনার বয়স কত বছর, মাস ও দিন হয়েছে তা জানতে ফর্মটি পূরণ করুন' 
                        : lang === 'es' 
                        ? 'Calcularemos los años, meses, semanas, días y segundos exactos de su vida'
                        : 'Select or say your date of birth on the left pane and compute exact milliseconds, hours, relative avatars, and birthday count.'}
                    </p>
                  </div>

                  <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wide group-hover:scale-105 transition-all mt-2 shadow-sm border ${
                    isDark
                      ? 'bg-purple-900/25 text-purple-350 border-purple-850'
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {lang === 'bn' ? 'অটো-সাজেশন দিতে ক্লিক করুন' : 'Click frame to auto-suggest birthdate'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Analytics Simulated Engagement Trend Dashboard */}
            <div className={`rounded-[40px] p-6 relative overflow-hidden border transition-all duration-300 ${
              isDark 
                ? 'bg-[#120a22]/70 border-purple-900/40 shadow-[0_15px_50px_rgba(0,0,0,0.5)] text-slate-100' 
                : 'glass-container-liquid border-white/60 shadow-xl shadow-slate-200/50 text-slate-800'
            }`}>
              <div className={`flex items-center justify-between gap-4 mb-4 pb-3 border-b ${isDark ? 'border-purple-900/30' : 'border-indigo-100/50'}`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Activity className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-indigo-600'}`} />
                    <h3 className={`font-display font-black text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {t.analyticsTitle}
                    </h3>
                  </div>
                  <p className={`text-[10px] font-medium ${isDark ? 'text-purple-300/70' : 'text-slate-500'}`}>
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

          {/* Right Column: Sticky Sidebar with Premium Adsterra Ads */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6 w-full">
            <AdSenseBlock t={t} isDark={isDark} />
            <AdSenseBlock t={t} isDark={isDark} />
          </aside>

        </div>

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
      <footer className="max-w-5xl mx-auto w-full mt-10 pt-6 border-t border-slate-200 text-center flex flex-col gap-4 relative z-10 selection:bg-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-505">
            <span>© 2026 Age Calculator App. Verified secure sandbox.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans font-black text-slate-600 text-xs">
            <button
              onClick={() => {
                setActiveLegalTab('about');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : lang === 'es' ? 'Sobre Nosotros' : 'About Us'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setActiveLegalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'গোপনীয়তা নীতি' : lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setActiveLegalTab('terms');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : lang === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setActiveLegalTab('growth');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-indigo-650 text-indigo-600 font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
              <span>{lang === 'bn' ? 'গ্রোথ টিপস' : lang === 'es' ? 'Consejos de Crecimiento' : 'Growth Tips'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-505">
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Web Accessibility AAA Compliance
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 font-sans font-black text-[11px] text-pink-600 hover:text-pink-700 cursor-pointer transition-colors">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Built for the World</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Premium Social Sharing Modal Backdrop & Window */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white border border-slate-100 shadow-2xl p-6 sm:p-7 text-left space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-display font-black text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-600" />
                    <span>
                      {lang === 'bn' ? 'ফলাফল শেয়ার করুন' : lang === 'es' ? 'Compartir Resultados' : 'Share Results'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold font-mono">
                    {lang === 'bn' 
                      ? 'আপনার প্রিসিশন বয়স রিপোর্ট শেয়ার করুন' 
                      : lang === 'es' 
                      ? 'Comparte tu reporte de edad de precisión' 
                      : 'Distribute your precise chronological biometrics'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Text Preview Box */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-mono block">
                  {lang === 'bn' ? 'রিপোর্ট প্রিভিউ' : lang === 'es' ? 'Vista previa del reporte' : 'Report Text Preview'}
                </span>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-[11px] sm:text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto shadow-inner select-all">
                  {getShareText()}
                </div>
              </div>

              {/* Major Social Networks Sharing Buttons Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                {/* Twitter (X) */}
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, '_blank');
                    console.log('[Google Analytics] Share Twitter clicked');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-sky-600 text-slate-700 transition-all group border border-slate-100 cursor-pointer shadow-sm active:scale-95"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform text-sky-500" />
                  <span className="text-[9px] font-bold mt-1.5">Twitter</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
                    console.log('[Google Analytics] Share Facebook clicked');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-all group border border-slate-100 cursor-pointer shadow-sm active:scale-95"
                >
                  <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform text-blue-600" />
                  <span className="text-[9px] font-bold mt-1.5">Facebook</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText())}`, '_blank');
                    console.log('[Google Analytics] Share WhatsApp clicked');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 transition-all group border border-slate-100 cursor-pointer shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-500" />
                  <span className="text-[9px] font-bold mt-1.5">WhatsApp</span>
                </button>

                {/* Email */}
                <button
                  onClick={() => {
                    const subject = lang === 'bn' ? 'আমার নির্ভুল বয়স রিপোর্ট' : lang === 'es' ? 'Mi reporte de edad exacta' : 'My Precise Age Report';
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getShareText())}`, '_self');
                    console.log('[Google Analytics] Share Email clicked');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-700 transition-all group border border-slate-100 cursor-pointer shadow-sm active:scale-95"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform text-purple-500" />
                  <span className="text-[9px] font-bold mt-1.5">Email</span>
                </button>
              </div>

              {/* Copy Report to Clipboard Button */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getShareText());
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                  console.log('[Google Analytics] Share copy to clipboard clicked');
                }}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black transition-all cursor-pointer text-xs sm:text-sm shadow-sm border ${
                  isCopied 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-indigo-600/10'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-white animate-bounce" />
                    <span>
                      {lang === 'bn' ? 'সফলভাবে কপি হয়েছে!' : lang === 'es' ? '¡Copiado con éxito!' : 'Copied to Clipboard!'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span>
                      {lang === 'bn' ? 'রিপোর্ট কপি করুন' : lang === 'es' ? 'Copiar Reporte' : 'Copy Report Summary'}
                    </span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Legal & About Modal Hub */}
      <LegalAboutModals
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        activeTab={activeLegalTab}
        setActiveTab={setActiveLegalTab}
        lang={lang}
      />

      {/* Elegant Social Card Generator Popup */}
      <SocialCardGenerator
        isOpen={isSocialCardOpen}
        onClose={() => {
          setIsSocialCardOpen(false);
          setSelectedCelebrity(null);
        }}
        result={result}
        comparisonResult={comparisonResult}
        celebrity={selectedCelebrity}
        gender={gender}
        lang={lang}
        translations={translations}
      />

    </div>
  );
}
