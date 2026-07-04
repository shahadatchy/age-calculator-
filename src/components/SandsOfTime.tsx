import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Play, Pause, Sparkles, Flame, Clock } from 'lucide-react';
import { LanguageCode } from '../types';

interface SandsOfTimeProps {
  lang: LanguageCode;
  isDark: boolean;
  birthDate: string | Date;
}

export default function SandsOfTime({ lang, isDark, birthDate }: SandsOfTimeProps) {
  const [rotation, setRotation] = useState(0);
  const [isFlowing, setIsFlowing] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sandProgress, setSandProgress] = useState(0.85); // 0 to 1 representing top sand remaining
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);

  // Localizations
  const localTexts = {
    en: {
      title: "Sands of Time",
      subtitle: "Watch life's micro-seconds flow in real-time",
      flipBtn: "Flip Hourglass",
      active: "Ticking Flow Active",
      paused: "Flow Paused",
      totalSeconds: "Total earthly seconds experienced:",
      cosmicWisdom: "Each sand grain represents a passing breath of your cosmic journey."
    },
    bn: {
      title: "সময়ের বালুকণা (Hourglass)",
      subtitle: "বাস্তব সময়ে জীবনের ক্ষুদ্র সেকেন্ডের প্রবাহ দেখুন",
      flipBtn: "ঘণ্টাটি উল্টান (Flip)",
      active: "সময় প্রবাহ সচল",
      paused: "প্রবাহ স্থগিত",
      totalSeconds: "পৃথিবীতে অতিবাহিত মোট সেকেন্ড:",
      cosmicWisdom: "প্রতিটি বালুকণা আপনার মহাজাগতিক যাত্রার একটি অতিবাহিত শ্বাসকে নির্দেশ করে।"
    },
    es: {
      title: "Las Arenas del Tiempo",
      subtitle: "Observa el flujo de los microsegundos de la vida en tiempo real",
      flipBtn: "Girar Reloj de Arena",
      active: "Flujo Activo",
      paused: "Flujo Pausado",
      totalSeconds: "Segundos terrenales totales vividos:",
      cosmicWisdom: "Cada grano de arena representa un suspiro pasajero en tu viaje cósmico."
    }
  };

  const t = localTexts[lang] || localTexts.en;

  // Track elapsed seconds since birth
  useEffect(() => {
    if (!birthDate) return;
    const dob = new Date(birthDate);
    if (isNaN(dob.getTime())) return;

    const updateSeconds = () => {
      const now = new Date();
      const diffMs = now.getTime() - dob.getTime();
      setElapsedSeconds(Math.floor(diffMs / 1000));
    };

    updateSeconds();
    const interval = setInterval(updateSeconds, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  // Handle flow mechanics (sand level emptying/filling and stream particle emissions)
  useEffect(() => {
    if (!isFlowing) return;

    const interval = setInterval(() => {
      // Sand runs out gradually, then auto-flips or stops
      setSandProgress((prev) => {
        if (prev <= 0.01) {
          // Auto-flip or wrap around for continuous aesthetic
          return 0.99;
        }
        return prev - 0.005;
      });

      // Emit sand particles hitting the bottom mound
      setParticles((prev) => {
        const newParticle = {
          id: Math.random(),
          x: 100 + (Math.random() * 8 - 4),
          y: 195 + (Math.random() * 6 - 3),
          scale: Math.random() * 0.6 + 0.4
        };
        return [...prev.slice(-15), newParticle];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isFlowing]);

  const handleFlip = () => {
    // Increment rotation by 180 deg
    setRotation((prev) => prev + 180);
    // Pause stream briefly during rotation to look realistic
    setIsFlowing(false);
    
    setTimeout(() => {
      // Invert progress to represent refilled top glass bulb after flip
      setSandProgress((prev) => Math.max(0.2, 1 - prev));
      setIsFlowing(true);
    }, 600);
  };

  return (
    <div className={`p-6 rounded-[35px] border text-left transition-all duration-300 ${
      isDark 
        ? 'bg-[#180f2b]/80 border-purple-900/40 shadow-xl text-slate-100' 
        : 'glass-container-liquid border-white/60 shadow-lg shadow-slate-150/40 text-slate-800'
    }`}>
      <div className="flex items-center justify-between border-b border-slate-200/20 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 dark:bg-purple-950/40 rounded-xl text-amber-500">
            <Clock className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-slate-900 dark:text-white leading-tight">
              {t.title}
            </h4>
            <p className="text-[10px] font-semibold text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsFlowing(!isFlowing)}
            className={`p-1.5 rounded-lg transition-all border cursor-pointer ${
              isFlowing 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 hover:bg-amber-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 text-slate-500 hover:bg-slate-200'
            }`}
            title={isFlowing ? t.paused : t.active}
          >
            {isFlowing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          
          <button
            onClick={handleFlip}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 border border-indigo-500 text-white cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-[10px] font-bold"
            title={t.flipBtn}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.flipBtn}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive 3D Hourglass Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', damping: 15, stiffness: 80 }}
            className="relative cursor-pointer select-none"
            onClick={handleFlip}
          >
            {/* Hourglass Container SVG */}
            <svg viewBox="0 0 200 240" className="w-36 h-44 drop-shadow-[0_10px_25px_rgba(245,158,11,0.2)]">
              <defs>
                {/* Wood Polish Shading */}
                <linearGradient id="wood-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="50%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>
                {/* Sand Glow Gradient */}
                <linearGradient id="sand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                {/* Highlight Refraction */}
                <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="20%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="90%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
                </linearGradient>
              </defs>

              {/* Wooden Frames (Top & Bottom Bases) */}
              <rect x="40" y="16" width="120" height="14" rx="4" fill="url(#wood-grad)" />
              <rect x="40" y="210" width="120" height="14" rx="4" fill="url(#wood-grad)" />
              
              {/* Pillar Supports */}
              <rect x="46" y="30" width="8" height="180" rx="3" fill="#451a03" />
              <rect x="146" y="30" width="8" height="180" rx="3" fill="#451a03" />

              {/* Inner Vacuum Boundary */}
              <path
                d="M 60,30 
                   L 140,30 
                   C 140,78 114,115 106,120 
                   C 114,125 140,162 140,210 
                   L 60,210 
                   C 60,162 86,125 94,120 
                   C 86,115 60,78 60,30 Z"
                fill="rgba(15, 23, 42, 0.45)"
              />

              {/* TOP BULB SAND (Emptying Level) */}
              <g>
                <clipPath id="top-bulb-clip">
                  <path d="M 60,30 L 140,30 C 140,78 114,115 106,120 L 94,120 C 86,115 60,78 60,30 Z" />
                </clipPath>
                <g clipPath="url(#top-bulb-clip)">
                  <motion.path
                    d={`M 50,120 L 150,120 L 150,${30 + (90 * (1 - sandProgress))} L 50,${30 + (90 * (1 - sandProgress))} Z`}
                    fill="url(#sand-grad)"
                    className="origin-bottom"
                    animate={{ y: [0, 0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  {/* Swirling grains of sand at top surface */}
                  {isFlowing && (
                    <circle cx="100" cy={32 + (88 * (1 - sandProgress))} r="2" fill="#fff" opacity="0.7" className="animate-ping" />
                  )}
                </g>
              </g>

              {/* BOTTOM BULB SAND (Accumulating Mound Level) */}
              <g>
                <clipPath id="bottom-bulb-clip">
                  <path d="M 106,120 C 114,125 140,162 140,210 L 60,210 C 60,162 86,125 94,120 Z" />
                </clipPath>
                <g clipPath="url(#bottom-bulb-clip)">
                  {/* Dynamic Mound shape based on sand filling up */}
                  <motion.path
                    d={`M 55,210 Q 100,${210 - (70 * (1 - sandProgress))} 145,210 Z`}
                    fill="url(#sand-grad)"
                  />
                </g>
              </g>

              {/* Sand Trickling Stream */}
              {isFlowing && (
                <motion.line
                  x1="100"
                  y1="116"
                  x2="100"
                  y2="202"
                  stroke="url(#sand-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="10, 8"
                  animate={{ strokeDashoffset: [0, -36] }}
                  transition={{ ease: 'linear', duration: 0.6, repeat: Infinity }}
                />
              )}

              {/* Particle impacts at the bottom mound */}
              {isFlowing && particles.map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={1.8 * p.scale}
                  fill="#fec34a"
                  opacity={0.9}
                />
              ))}

              {/* Outer Glass Shine / Highlight Frame */}
              <path
                d="M 60,30 
                   L 140,30 
                   C 140,78 114,115 106,120 
                   C 114,125 140,162 140,210 
                   L 60,210 
                   C 60,162 86,125 94,120 
                   C 86,115 60,78 60,30 Z"
                fill="none"
                stroke="url(#glass-grad)"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              
              {/* Soft Refraction lines */}
              <path d="M 65,36 Q 80,75 91,105" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 135,36 Q 120,75 109,105" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 65,204 Q 80,165 91,135" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
          
          <div className="mt-2 text-center">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
              isFlowing 
                ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400' 
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isFlowing ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`} />
              {isFlowing ? t.active : t.paused}
            </span>
          </div>
        </div>

        {/* Right: Dynamic Cosmic Counters & Wisdom quote */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-purple-300 font-mono block">
              {t.totalSeconds}
            </span>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse flex-shrink-0" />
              <span className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight select-all">
                {elapsedSeconds > 0 ? elapsedSeconds.toLocaleString() : "Counting..."}
              </span>
            </div>
          </div>

          {/* Sparkly interactive wisdom card */}
          <div className={`p-4 rounded-2xl border text-xs leading-relaxed relative ${
            isDark ? 'bg-zinc-900/30 border-zinc-850' : 'bg-white/60 border-slate-150'
          }`}>
            <div className="absolute top-2.5 right-3 text-amber-500/30">
              <Sparkles className="w-4 h-4 animate-bounce" />
            </div>
            <p className="font-semibold text-slate-500 dark:text-zinc-400 italic">
              "{t.cosmicWisdom}"
            </p>
          </div>

          {/* Time speed dials or fun indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-zinc-900/40 border-zinc-850' : 'bg-slate-50/50 border-slate-100'}`}>
              <span className="block text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">Breaths Taken (Est.)</span>
              <span className="block text-sm font-black text-slate-800 dark:text-slate-100 font-mono">
                {elapsedSeconds > 0 ? Math.floor(elapsedSeconds * 0.25).toLocaleString() : "..."}
              </span>
            </div>
            <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-zinc-900/40 border-zinc-850' : 'bg-slate-50/50 border-slate-100'}`}>
              <span className="block text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">Heartbeats (Est.)</span>
              <span className="block text-sm font-black text-slate-800 dark:text-slate-100 font-mono">
                {elapsedSeconds > 0 ? Math.floor(elapsedSeconds * 1.16).toLocaleString() : "..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
