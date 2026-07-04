import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Users, Heart, Sparkles, AlertCircle, Terminal, HelpCircle } from 'lucide-react';

interface LegalAboutModalsProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'privacy' | 'terms' | 'about' | 'growth';
  setActiveTab: (tab: 'privacy' | 'terms' | 'about' | 'growth') => void;
  lang: 'en' | 'es' | 'bn' | 'hi' | 'ja' | string;
}

export default function LegalAboutModals({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  lang,
}: LegalAboutModalsProps) {

  // Content for English
  const contentEn = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "100% On-Device • Zero Server Tracking",
      lastUpdated: "Last updated: June 23, 2026",
      sections: [
        {
          title: "1. Zero Data Collection",
          text: "We believe your birthdate, life metrics, and chronological biometrics are deeply personal. This application does not collect, transmit, or store any of your inputs on our servers. All computations occur in real-time directly inside your browser sandbox."
        },
        {
          title: "2. Client-Side Generation",
          text: "When you export results or download your custom PDF report, the entire document is rendered on-device using client-side library engines. No personal data is ever uploaded or processed externally."
        },
        {
          title: "3. No Cookies or Session Logs",
          text: "We do not deploy invasive tracking cookies, user profiling, or session fingerprinting. Standard browser local storage is utilized strictly to persist user preference selections (such as preferred language) if desired."
        },
        {
          title: "4. Third-Party Ads & Services",
          text: "Any integrated contextual advertisement placements (like standard Google AdSense) operate without accessing your calculated chronological profile. We maintain a absolute partition between marketing modules and the core biometric calculation sandbox."
        }
      ]
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Usage Guidelines & Accuracy Disclaimers",
      lastUpdated: "Last updated: June 23, 2026",
      sections: [
        {
          title: "1. Scientific & Informational Scope",
          text: "The Precision Chronological Calculator is designed to provide high-precision age breakdowns in multiple metrics (including years, months, weeks, days, hours, and milliseconds). These calculations are for informational and planning purposes."
        },
        {
          title: "2. Life Expectancy Estimates",
          text: "Any regional life expectancy figures or lifespan countdown metrics displayed within the app are derived from publicly available regional demographic averages and statistical data. They are not clinical predictions and should not be used as medical advice."
        },
        {
          title: "3. Safe Sandbox Performance",
          text: "This software is provided 'as is' without warranty of any kind, express or implied. The developer is not liable for any discrepancies in timezone computations, millisecond syncing, or device-specific rendering errors."
        }
      ]
    },
    about: {
      title: "About Us",
      subtitle: "Precision Engineering & Human Passion",
      author: "Designed & Engineered with Passion by Sahev Chowdhury",
      text: "Welcome to the Precision Chronological Calculator. This tool was born out of a desire to create the absolute finest chronological biometrics dashboard in existence—balancing absolute millisecond mathematical precision with beautiful, fluid motion and user interface aesthetics.",
      pillars: [
        {
          title: "Absolute Precision",
          text: "Calculating time down to the exact millisecond using real-time High-Precision UTC algorithms, adjusting gracefully for leap years and month lengths."
        },
        {
          title: "Uncompromised Privacy",
          text: "Every byte of data is kept safe inside your local device sandbox. We refuse to compromise user trust for analytical profiling."
        },
        {
          title: "Global Accessibility",
          text: "Full multilingual localization (English, Spanish, Bengali, Hindi, Japanese) and AAA accessibility standards ensure anyone, anywhere can explore their journey."
        }
      ]
    }
  };

  // Content for Bengali (বাংলা)
  const contentBn = {
    privacy: {
      title: "গোপনীয়তা নীতি",
      subtitle: "১০০% অন-ডিভাইস প্রসেসিং • কোনো সার্ভার ট্র্যাকিং নেই",
      lastUpdated: "সর্বশেষ আপডেট: ২৩ জুন, ২০২৬",
      sections: [
        {
          title: "১. কোনো তথ্য সংগ্রহ করা হয় না",
          text: "আমরা বিশ্বাস করি আপনার জন্মতারিখ, জীবনযাত্রা ও বয়স সংক্রান্ত তথ্য অত্যন্ত ব্যক্তিগত। এই অ্যাপ্লিকেশনটি আমাদের সার্ভারে আপনার কোনো ইনপুট সংগ্রহ বা সংরক্ষণ করে না। সমস্ত হিসাব সরাসরি আপনার ব্রাউজার স্যান্ডবক্সের ভিতরে রিয়েল-টাইমে সম্পন্ন হয়।"
        },
        {
          title: "২. ক্লায়েন্ট-সাইড প্রসেসিং",
          text: "আপনি যখন ফলাফল বা কাস্টম পিডিএফ রিপোর্ট ডাউনলোড করেন, পুরো ডকুমেন্টটি ক্লায়েন্ট-সাইড লাইব্রেরির মাধ্যমে অন-ডিভাইসে তৈরি করা হয়। কোনো ব্যক্তিগত ডেটা কখনো অন্য কোথাও আপলোড করা হয় না।"
        },
        {
          title: "৩. কোনো কুকি বা সেশন ট্র্যাকিং নেই",
          text: "আমরা কোনো ট্র্যাকিং কুকি, ব্যবহারকারীর প্রোফাইলিং বা সেশন ফিঙ্গারপ্রিন্টিং ব্যবহার করি না। শুধুমাত্র আপনার পছন্দসই সেটিংস (যেমন ভাষা) সংরক্ষণ করতে ব্রাউজার লোকাল স্টোরেজ ব্যবহার করা হয়।"
        }
      ]
    },
    terms: {
      title: "ব্যবহারের শর্তাবলী",
      subtitle: "ব্যবহার নির্দেশিকা ও নির্ভুলতার ঘোষণা",
      lastUpdated: "সর্বশেষ আপডেট: ২৩ জুন, ২০২৬",
      sections: [
        {
          title: "১. তথ্যের পরিধি",
          text: "প্রিসিশন ক্রোনোলজিক্যাল ক্যালকুলেটরটি একাধিক পরিমাপে (বছর, মাস, সপ্তাহ, দিন, ঘন্টা এবং মিলিসেকেন্ড সহ) উচ্চ-নির্ভুলতার সাথে বয়স গণনা করার জন্য ডিজাইন করা হয়েছে। এই হিসাবগুলো সম্পূর্ণ তথ্যগত উদ্দেশ্যে দেওয়া।"
        },
        {
          title: "২. আয়ু প্রত্যাশার হিসাব",
          text: "অ্যাপে প্রদর্শিত আঞ্চলিক গড় আয়ু প্রত্যাশার হিসাবগুলো বিভিন্ন দেশের পাবলিক ডেমোগ্রাফিক ডেটার উপর ভিত্তি করে তৈরি। এটি কোনো চিকিৎসার বিকল্প বা সুনির্দিষ্ট পূর্বাভাস নয়।"
        }
      ]
    },
    about: {
      title: "আমাদের সম্পর্কে",
      subtitle: "নির্ভুল কোডিং ও মানবিক প্রচেষ্টা",
      author: "সাহেব চৌধুরী (Sahev Chowdhury) দ্বারা যত্ন সহকারে তৈরি",
      text: "প্রিসিশন ক্রোনোলজিক্যাল ক্যালকুলেটরে আপনাকে স্বাগতম। এই টুলটি তৈরি করার মূল উদ্দেশ্য ছিল সময়ের সঠিক হিসাব মিলিসেকেন্ড নিখুঁতভাবে সবার সামনে তুলে ধরা—একটি অত্যন্ত সুন্দর, গতিশীল এবং সুরক্ষিত ইন্টারফেসের মাধ্যমে।",
      pillars: [
        {
          title: "শতভাগ নির্ভুলতা",
          text: "বাস্তব সময়ের হাই-প্রিসিশন UTC অ্যালগরিদম ব্যবহার করে মিলিসেকেন্ড পর্যন্ত নিখুঁত হিসাব, যা অধিবর্ষ (Leap Year) এবং মাসের পরিবর্তন স্বয়ংক্রিয়ভাবে সমন্বয় করে।"
        },
        {
          title: "দৃঢ় গোপনীয়তা",
          text: "আপনার ডেটা আপনার ডিভাইসের সুরক্ষাতেই থাকবে। আমরা ব্যবহারকারীর ব্যক্তিগত সুরক্ষায় সর্বোচ্চ প্রাধান্য দিই।"
        }
      ]
    }
  };

  // Content for Spanish (Español)
  const contentEs = {
    privacy: {
      title: "Política de Privacidad",
      subtitle: "100% En el dispositivo • Sin rastreo",
      lastUpdated: "Última actualización: 23 de junio de 2026",
      sections: [
        {
          title: "1. Cero recolección de datos",
          text: "Creemos que su fecha de nacimiento y métricas de vida son profundamente personales. Esta aplicación no recopila, transmite ni almacena ninguna de sus entradas en nuestros servidores."
        },
        {
          title: "2. Generación local",
          text: "Al exportar informes o descargar su PDF personalizado, todo el documento se procesa de forma segura en su propio dispositivo."
        }
      ]
    },
    terms: {
      title: "Términos de Servicio",
      subtitle: "Pautas de uso y descargo de responsabilidad",
      lastUpdated: "Última actualización: 23 de junio de 2026",
      sections: [
        {
          title: "1. Alcance informativo",
          text: "La Calculadora Cronológica de Precisión está diseñada para ofrecer desgloses de edad detallados con alta exactitud (años, meses, días y milisegundos)."
        },
        {
          title: "2. Estimaciones de esperanza de vida",
          text: "Las estimaciones mostradas se basan en promedios demográficos globales y no constituyen asesoramiento médico."
        }
      ]
    },
    about: {
      title: "Sobre Nosotros",
      subtitle: "Ingeniería de precisión y pasión humana",
      author: "Diseñado y desarrollado con pasión por Sahev Chowdhury",
      text: "Bienvenido a la Calculadora Cronológica de Precisión. Este proyecto nace del deseo de construir el mejor tablero métrico de edad, combinando precisión matemática y un diseño moderno e interactivo.",
      pillars: [
        {
          title: "Precisión Absoluta",
          text: "Medición en tiempo real hasta el milisegundo utilizando algoritmos UTC avanzados."
        }
      ]
    }
  };

  // Select appropriate translation based on current language
  const getContent = () => {
    if (lang === 'bn') return contentBn;
    if (lang === 'es') return contentEs;
    return contentEn; // Default to English
  };

  const data = getContent();
  const isDark = false;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glass Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl overflow-hidden rounded-[32px] border shadow-2xl z-10 flex flex-col max-h-[85vh] ${
              isDark 
                ? 'glass-container-liquid-dark text-slate-100 border-zinc-800' 
                : 'bg-white border-slate-100 text-slate-800'
            }`}
          >
            {/* Header tab navigation */}
            <div className={`border-b p-5 sm:p-6 pb-2 ${isDark ? 'bg-zinc-900/30 border-zinc-800/40' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <h2 className={`font-display font-black text-lg sm:text-xl flex items-center gap-2 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <span>
                      {lang === 'bn' ? 'তথ্য ও নীতি কেন্দ্র' : lang === 'es' ? 'Centro de Información y Políticas' : 'Information & Policies'}
                    </span>
                  </h2>
                  <p className={`text-[10px] font-bold font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Precision Chronological Hub
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer shadow-sm ${
                    isDark 
                      ? 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400' 
                      : 'bg-white hover:bg-slate-200 border border-slate-200/60 text-slate-505 hover:text-slate-800'
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className={`flex gap-2 p-1 rounded-2xl border ${isDark ? 'bg-zinc-950/40 border-zinc-800/40' : 'bg-slate-100/80 border-slate-200/50'}`}>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'privacy'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-505 hover:text-slate-800'
                  }`}
                >
                  <Shield className={`w-3.5 h-3.5 ${activeTab === 'privacy' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{lang === 'bn' ? 'গোপনীয়তা' : lang === 'es' ? 'Privacidad' : 'Privacy'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('terms')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'terms'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-505 hover:text-slate-800'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === 'terms' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{lang === 'bn' ? 'শর্তাবলী' : lang === 'es' ? 'Términos' : 'Terms'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'about'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-505 hover:text-slate-800'
                  }`}
                >
                  <Users className={`w-3.5 h-3.5 ${activeTab === 'about' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{lang === 'bn' ? 'আমাদের সম্পর্কে' : lang === 'es' ? 'Nosotros' : 'About Us'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('growth')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'growth'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-505 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'growth' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{lang === 'bn' ? 'ভিজিটর গ্রোথ' : lang === 'es' ? 'Crecimiento' : 'Visitor Growth'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content Pane */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 min-h-[300px]">
              
              {/* Privacy Tab Content */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left space-y-1 pb-4 border-b border-slate-100">
                    <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl">
                      {data.privacy.title}
                    </h3>
                    <p className="text-xs text-indigo-600 font-bold font-mono">
                      {data.privacy.subtitle}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium font-mono pt-1">
                      {data.privacy.lastUpdated}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {data.privacy.sections.map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/30 space-y-2">
                        <h4 className="font-display font-bold text-slate-850 text-sm sm:text-base flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {sec.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                          {sec.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms Tab Content */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left space-y-1 pb-4 border-b border-slate-100">
                    <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl">
                      {data.terms.title}
                    </h3>
                    <p className="text-xs text-indigo-600 font-bold font-mono">
                      {data.terms.subtitle}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium font-mono pt-1">
                      {data.terms.lastUpdated}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {data.terms.sections.map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/50 space-y-2">
                        <h4 className="font-display font-bold text-slate-850 text-sm sm:text-base flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {sec.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                          {sec.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About Us Tab Content */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left space-y-1 pb-4 border-b border-slate-100">
                    <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl">
                      {data.about.title}
                    </h3>
                    <p className="text-xs text-indigo-600 font-bold font-mono">
                      {data.about.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 font-sans font-semibold pt-1">
                      {data.about.author}
                    </p>
                  </div>

                  <div className="space-y-4 text-slate-650 text-xs sm:text-sm leading-relaxed font-medium">
                    <p className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 sm:p-5">
                      {data.about.text}
                    </p>

                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 pt-2 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                      {lang === 'bn' ? 'আমাদের মূল স্তম্ভসমূহ' : lang === 'es' ? 'Nuestros pilares clave' : 'Our Core Pillars'}
                    </h4>

                    <div className="grid grid-cols-1 gap-3 pt-1">
                      {data.about.pillars.map((pil, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/30 space-y-1">
                          <span className="font-display font-bold text-slate-850 text-xs sm:text-sm block">
                            {pil.title}
                          </span>
                          <span className="text-slate-600 text-xs font-sans font-medium block">
                            {pil.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Visitor Growth Tips Tab Content */}
              {activeTab === 'growth' && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left space-y-1 pb-4 border-b border-slate-100">
                    <h3 className="font-display font-black text-slate-900 text-xl sm:text-2xl">
                      {lang === 'bn' ? '🚀 ওয়েবসাইট গ্রোথ ও ভিজিটর বৃদ্ধির কৌশল' : '🚀 Creator Insights & Growth Center'}
                    </h3>
                    <p className="text-xs text-indigo-600 font-bold font-mono">
                      {lang === 'bn' ? 'সাহেব চৌধুরীর জন্য কাস্টমাইজড প্রফেশনাল গাইড' : 'Bespoke Guide for Sahev Chowdhury to scale traffic & maximize AdSense'}
                    </p>
                  </div>

                  <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-650 font-medium">
                    <p className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 sm:p-5 text-slate-800 font-semibold flex gap-3 text-left">
                      <span className="text-xl">💡</span>
                      <span>
                        {lang === 'bn'
                          ? 'আপনার প্রিসিশন বয়স ক্যালকুলেটরটিতে অলরেডি অসাধারণ ইউজার ইন্টারফেস এবং দারুণ ফিচার আছে। আরও বেশি ভিজিটর আকর্ষণ করতে এবং অ্যাডসেন্স থেকে ভালো আয় করতে নিচের সুপার-ফিচারগুলো অ্যাড করতে পারেন:'
                          : 'Your Precision Age Calculator already possesses a state-of-the-art UI and incredible precision. To scale your traffic to thousands of daily users and maximize AdSense earnings, consider implementing the following highly viral features:'}
                      </span>
                    </p>

                    <div className="space-y-4">
                      {/* Tip 1 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-left">
                        <h4 className="font-display font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 font-mono text-xs font-bold">1</span>
                          {lang === 'bn' ? '১. বৈজ্ঞানিক জ্যোতিষশাস্ত্র ও লাইফ পাথ ক্যালকুলেটর (Numerology)' : '1. Numerology & Life Path Numbers'}
                        </h4>
                        <p className="text-slate-600 text-xs pl-8 font-medium leading-relaxed">
                          {lang === 'bn'
                            ? 'জন্ম তারিখ থেকে মানুষের "লাইফ পাথ নাম্বার" বা "ভাগ্যাঙ্ক" গণনা করার একটি ছোট সেকশন তৈরি করুন। জ্যোতিষশাস্ত্র ও নিউমারোলজি নিয়ে মানুষের প্রচণ্ড কৌতূহল থাকে। সোশ্যাল মিডিয়ায় এই নাম্বারগুলো শেয়ার করার সুযোগ দিলে সাইটের ট্রাফিক দ্বিগুণ হবে।'
                            : 'Integrate a localized algorithm that computes the visitor’s Life Path Number (1-9, 11, 22) based on their birth date. Numerology has massive viral sharing appeal across Facebook, Instagram, and WhatsApp.'}
                        </p>
                      </div>

                      {/* Tip 2 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-left">
                        <h4 className="font-display font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-pink-500/10 text-pink-600 font-mono text-xs font-bold">2</span>
                          {lang === 'bn' ? '২. ওই বিশেষ বছরের ও দিনের ঐতিহাসিক ঘটনা (Birth Trivia)' : '2. Historical Birth Trivia'}
                        </h4>
                        <p className="text-slate-600 text-xs pl-8 font-medium leading-relaxed">
                          {lang === 'bn'
                            ? 'ব্যবহারকারী যেদিন জন্মগ্রহণ করেছিলেন, সে বছর বা দিনে বিশ্বের প্রধান প্রধান কী কী ঐতিহাসিক ঘটনা ঘটেছিল বা কোন কোন কালজয়ী সিনেমা/গান মুক্তি পেয়েছিল তা দেখান। মানুষ অতীতে ফিরে যেতে ভালোবাসে, যা সাইটে ভিজিটরদের অবস্থানের সময় বাড়াবে।'
                            : 'Display notable world events, hit movies, or Billboard #1 songs from the exact year and day they were born. Nostalgia is an incredibly powerful psychological trigger that boosts session duration.'}
                        </p>
                      </div>

                      {/* Tip 3 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-left">
                        <h4 className="font-display font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 font-mono text-xs font-bold">3</span>
                          {lang === 'bn' ? '৩. সোশ্যাল মিডিয়ার জন্য ভাইরাল মেডেল বা ব্যাজ (Viral Badges)' : '3. Viral Milestone Sharing Cards'}
                        </h4>
                        <p className="text-slate-600 text-xs pl-8 font-medium leading-relaxed">
                          {lang === 'bn'
                            ? 'ব্যবহারকারীরা যাতে তাদের বিশেষ মাইলফলক যেমন "আমি আজ ১০,০০০ দিন পূর্ণ করলাম!" বা "আমার হার্টবিট ১০০ কোটি বার স্পন্দিত হয়েছে!" - এই লেখা সহ একটি চমৎকার ভিজ্যুয়াল মেডেল কার্ড এক ক্লিকে ফেসবুক, হোয়াটসঅ্যাপ বা টুইটারে শেয়ার করতে পারেন।'
                            : 'Allow visitors to download a beautifully styled visual card or shareable "Badge" commemorating milestones (e.g., "I just completed 10,000 days on Earth!"). Shareable user achievements drive massive organic word-of-mouth referral traffic.'}
                        </p>
                      </div>

                      {/* Tip 4 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-left">
                        <h4 className="font-display font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold">4</span>
                          {lang === 'bn' ? '৪. ভবিষ্যৎ টাইম ক্যাপসুল ইমেল (Future Time Capsule)' : '4. Future Milestone Time Capsule'}
                        </h4>
                        <p className="text-slate-600 text-xs pl-8 font-medium leading-relaxed">
                          {lang === 'bn'
                            ? 'এমন একটি ফিচার যোগ করুন যেখানে ইউজাররা নিজের ভবিষ্যতের উদ্দেশ্যে (যেমন ৩ বছর বা ৫ বছর পরের জন্মদিনে) একটি চিঠি লিখে রাখতে পারবেন। আপনার সাইট স্বয়ংক্রিয়ভাবে ইমেইলের মাধ্যমে নির্দিষ্ট দিনে চিঠিটি পৌঁছে দেবে। এটি ব্যবহারকারীদের আবার ফিরিয়ে আনবে।'
                            : 'Allow users to write a letter to their future self, to be scheduled and automatically emailed to them on a major future milestone birthday (e.g., 30th or 40th birthday). This guarantees repeat, loyal long-term visits.'}
                        </p>
                      </div>

                      {/* Tip 5 */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-left">
                        <h4 className="font-display font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 font-mono text-xs font-bold">5</span>
                          {lang === 'bn' ? '৫. মহাজাগতিক ও মহাকাশ বয়স ক্যালকুলেটর (Space Age)' : '5. Astro-Cosmic Space Age'}
                        </h4>
                        <p className="text-slate-600 text-xs pl-8 font-medium leading-relaxed">
                          {lang === 'bn'
                            ? 'মঙ্গল, বৃহস্পতি বা শুক্র গ্রহে আপনার বয়স কত? মঙ্গলের এক বছর ৬৮৭ দিন হওয়ার কারণে সেখানে আপনার বয়স কত কম হবে তা হিসাব করার কৌতূহলোদ্দীপক মহাজাগতিক ফিচার যোগ করুন। এটি ছাত্র-ছাত্রী ও বিজ্ঞানপ্রেমীদের ব্যাপকভাবে আকৃষ্ট করবে।'
                            : 'Calculate how old the user is on other planets (e.g., Mars, Venus, or Jupiter) based on planetary orbital periods. This educational, high-engagement widget is highly appealing to students and science enthusiasts.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer containing developers tag */}
            <div className={`border-t p-4 text-center text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 ${
              isDark 
                ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-500' 
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>
              <span>Secure sandbox environment</span>
              <span>•</span>
              <span className={`flex items-center gap-0.5 font-sans ${isDark ? 'text-purple-400' : 'text-indigo-600'}`}>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                Sahev Chowdhury
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
