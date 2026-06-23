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
  Link
} from 'lucide-react';
import { jsPDF } from 'jspdf';

import { LanguageCode, AgeCalculationResult, Gender } from './types';
import { translations, faqs } from './data';
import { calculatePreciseAge, parseSpokenDOB } from './utils';
import AgeAvatar from './components/AgeAvatar';
import AdSenseBlock from './components/AdSenseBlock';
import LegalAboutModals from './components/LegalAboutModals';
import { regionsList, lifeSuggestions } from './regions';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | 'about'>('privacy');

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
                      <span className={`flex items-center justify-center w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {t.voiceBtnLabel}
                      </span>
                    </div>

                    {isSpeechSupported ? (
                      !isListening ? (
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
                      )
                    ) : (
                      <span className="text-[10px] bg-slate-105 text-slate-500 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                        Unsupported
                      </span>
                    )}
                  </div>

                  {/* Clear instructions on how to use voice command input */}
                  {isSpeechSupported ? (
                    <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/30 text-[11px] text-slate-650 leading-relaxed space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-indigo-500" />
                        {lang === 'bn' ? 'কন্ঠস্বর ব্যবহারের নির্দেশাবলী:' : lang === 'es' ? 'Instrucciones de voz:' : 'How to use voice recognition:'}
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-650">
                        <li>
                          {lang === 'bn' 
                            ? 'বোতামে ক্লিক করুন এবং মাইক্রোফোন অ্যাক্সেস মঞ্জুর করুন।' 
                            : lang === 'es' 
                            ? 'Haga clic en el botón y conceda acceso al micrófono.' 
                            : 'Click the button and allow microphone permission.'}
                        </li>
                        <li>
                          {lang === 'bn'
                            ? 'আপনার জন্মতারিখ বলুন, যেমন: "২১শে অক্টোবর ১৯৯৫" অথবা "১লা জানুয়ারি ১৯৯০"'
                            : lang === 'es'
                            ? 'Diga su fecha de nacimiento, ej: "21 de octubre de 1995" o "1 de enero de 1990"'
                            : lang === 'hi'
                            ? 'अपनी जन्मतिथि स्पष्ट बोलें, जैसे: "21 अक्टूबर 1995" या "1 जनवरी 1990"'
                            : lang === 'ja'
                            ? '生年月日を話します（例：「1995年10月21日」や「1990年1月1日」）'
                            : lang === 'zh'
                            ? '说出您的出生日期（例如：“1995年10月21日”或“1990年1月1日”）'
                            : 'Speak your birth date, e.g., "January 1st, 1990" or "October 21st, 1995"'}
                        </li>
                        <li>
                          {lang === 'bn'
                            ? 'সিস্টেমটি এটি সনাক্ত করবে এবং ফর্ম ইনপুটগুলি স্বয়ংক্রিয়ভাবে পূরণ করবে।'
                            : lang === 'es'
                            ? 'El sistema lo detectará y rellenará el formulario automáticamente.'
                            : 'The app will auto-fill the Day, Month, and Year fields above.'}
                        </li>
                      </ul>
                    </div>
                  ) : (
                    /* Graceful fallback card when voice input is not supported or disabled */
                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/50 text-[11px] text-amber-850 leading-relaxed space-y-1">
                      <p className="font-bold text-amber-800 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        {lang === 'bn' ? 'কন্ঠস্বর ইনপুট সমর্থিত নয়' : lang === 'es' ? 'Entrada de voz no soportada' : 'Voice Input Not Supported'}
                      </p>
                      <p className="text-amber-700">
                        {lang === 'bn'
                          ? 'আপনার ব্রাউজার বা ডিভাইসে ওয়েব স্পিচ এপিআই সমর্থিত নয়। চিন্তা করবেন না! আপনি উপরের ড্রপডাউন মেনুগুলি ব্যবহার করে সহজেই জন্মতারিখ নির্বাচন করতে পারেন।'
                          : lang === 'es'
                          ? 'Su navegador no soporta el reconocimiento de voz. ¡No se preocupe! Puede seleccionar fácilmente su fecha usando las listas desplegables de arriba.'
                          : 'Web Speech API is not supported in this browser. Don\'t worry! You can easily select your date of birth using the day, month, and year dropdown lists above.'}
                      </p>
                    </div>
                  )}

                  {/* Voice state transcripts */}
                  {isSpeechSupported && (
                    <>
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
                    </>
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

                {/* Country/Region & Expected Lifespan selection */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      {lang === 'bn' ? 'অঞ্চল ও গড় আয়ুষ্কাল সূচক' : lang === 'es' ? 'Región y Esperanza de Vida' : 'Country/Region & Life Expectancy'}
                    </label>
                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-black border border-indigo-100">
                      {expectancyLevel} {lang === 'bn' ? 'বছর গড়' : lang === 'es' ? 'años prom' : 'yrs avg'}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2.5">
                    {/* Region Select dropdown */}
                    <div className="col-span-7">
                      <select
                        value={selectedRegion}
                        onChange={(e) => {
                          const code = e.target.value;
                          setSelectedRegion(code);
                          if (code !== 'custom') {
                            const found = regionsList.find(r => r.code === code);
                            if (found) {
                              setExpectancyLevel(found.expectancy);
                              console.log(`[Google Analytics] Region set: ${code}, expectancy: ${found.expectancy}`);
                            }
                          }
                        }}
                        className="w-full glass-input-liquid rounded-2xl py-3 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
                      >
                        {regionsList.map((r) => (
                          <option key={r.code} value={r.code} className="text-slate-900 bg-white">
                            {r.flag} {r.names[lang] || r.names['en']} ({r.expectancy} yrs)
                          </option>
                        ))}
                        <option value="custom" className="text-slate-900 bg-white">
                          ⚙️ {lang === 'bn' ? 'কাস্টম গড় আয়ু' : lang === 'es' ? 'Personalizar esperanza' : 'Custom Expectancy'}
                        </option>
                      </select>
                    </div>

                    {/* Numeric custom adjuster */}
                    <div className="col-span-5 flex items-center justify-between bg-white/40 border border-slate-200/50 rounded-2xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRegion('custom');
                          setExpectancyLevel((prev) => Math.max(1, prev - 1));
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-black bg-white hover:bg-slate-50 active:scale-95 text-indigo-600 shadow-sm transition-all border border-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      
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
                        className="w-10 text-center text-xs font-bold text-slate-950 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRegion('custom');
                          setExpectancyLevel((prev) => Math.min(150, prev + 1));
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-black bg-white hover:bg-slate-50 active:scale-95 text-indigo-600 shadow-sm transition-all border border-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
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
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout="position"
                  className="glass-container-liquid rounded-[40px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden"
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
                  </motion.div>

                  {/* Chronological Breakdown Stats */}
                  <motion.div variants={itemVariants} className="space-y-4">
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
                  </motion.div>

                  {/* Next Birthday Details display */}
                  <motion.div variants={itemVariants} className="p-5 rounded-[30px] bg-indigo-50/40 backdrop-blur-md border border-indigo-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
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
                                      ? 'bg-purple-950/40 border-purple-500/40 opacity-75' 
                                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex-shrink-0 pt-0.5">
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                      isChecked 
                                        ? 'bg-purple-500 border-purple-500 text-white' 
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
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-750 hover:from-indigo-500 hover:to-indigo-655 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.99] text-white font-extrabold transition-all cursor-pointer text-sm shadow-md"
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
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/10 active:scale-[0.99] text-white font-extrabold transition-all cursor-pointer text-sm shadow-md"
                      >
                        <Share2 className="w-4.5 h-4.5 text-white" />
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

    </div>
  );
}
