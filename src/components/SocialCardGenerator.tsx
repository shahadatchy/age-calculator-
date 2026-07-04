import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Sparkles, User, Palette, Image as ImageIcon, Check, Upload, Trash2, Mail } from 'lucide-react';
import { AgeCalculationResult, Gender, LanguageCode } from '../types';

interface SocialCardGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  result: AgeCalculationResult | null;
  comparisonResult?: any;
  gender: Gender;
  lang: LanguageCode;
  translations: any;
  celebrity?: any;
}

type TemplateTheme = 'darkMono' | 'lightMono' | 'silver' | 'carbon';

export default function SocialCardGenerator({
  isOpen,
  onClose,
  result,
  comparisonResult,
  gender,
  lang,
  translations,
  celebrity,
}: SocialCardGeneratorProps) {
  const [userName, setUserName] = useState('');
  const [activeTheme, setActiveTheme] = useState<TemplateTheme>('darkMono');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang] || translations['en'];

  // Recover state values from comparison context if available
  const compName1 = comparisonResult?.name1 || 'Person A';
  const compName2 = comparisonResult?.name2 || 'Person B';
  const compGender1 = comparisonResult?.gender1 || 'neutral';
  const compGender2 = comparisonResult?.gender2 || 'neutral';

  // Theme configuration for rendering - STRIKTLY BLACK AND WHITE / GRAYSCALE
  const themes = {
    darkMono: {
      name: 'Obsidian Matte (B&W)',
      bgGradients: ['#09090b', '#18181b', '#27272a'],
      borderColor: '#ffffff',
      accentColor: '#f4f4f5',
      textColor: '#ffffff',
      subtextColor: '#a1a1aa',
      cardBg: 'rgba(255, 255, 255, 0.08)',
    },
    lightMono: {
      name: 'Chalk White (B&W)',
      bgGradients: ['#ffffff', '#f4f4f5', '#e4e4e7'],
      borderColor: '#09090b',
      accentColor: '#18181b',
      textColor: '#09090b',
      subtextColor: '#71717a',
      cardBg: 'rgba(0, 0, 0, 0.05)',
    },
    silver: {
      name: 'Liquid Silver (B&W)',
      bgGradients: ['#18181b', '#27272a', '#09090b'],
      borderColor: '#d4d4d8',
      accentColor: '#ffffff',
      textColor: '#ffffff',
      subtextColor: '#a1a1aa',
      cardBg: 'rgba(255, 255, 255, 0.12)',
    },
    carbon: {
      name: 'Carbon Fiber (B&W)',
      bgGradients: ['#000000', '#09090b', '#1c1c1e'],
      borderColor: '#71717a',
      accentColor: '#e4e4e7',
      textColor: '#ffffff',
      subtextColor: '#a1a1aa',
      cardBg: 'rgba(255, 255, 255, 0.05)',
    },
  };

  const currentTheme = themes[activeTheme];
  const isDark = false;

  const getMailtoUrl = () => {
    let subject = '';
    let body = '';

    if (comparisonResult) {
      if (lang === 'bn') {
        subject = 'আমাদের নিখুঁত বয়স ব্যবধান ও তুলনা রিপোর্ট 🤝';
        body = `প্রিয়,

এখানে আমাদের নিখুঁত বয়স বিবরণী ও ব্যবধান রিপোর্ট দেওয়া হলো:

--------------------------------------------------
বয়সের ব্যবধান বিশ্লেষণ (Age Gap Summary)
--------------------------------------------------
• ${comparisonResult.olderName} এবং ${comparisonResult.youngerName}-এর মধ্যকার তুলনা
• নিখুঁত ব্যবধান: ${comparisonResult.diffYears} বছর, ${comparisonResult.diffMonths} মাস, ${comparisonResult.diffRemainingDays} দিন
• মোট ব্যবধান দিন হিসেবে: ${comparisonResult.diffDays.toLocaleString()} দিন
• মোট ব্যবধান ঘণ্টা হিসেবে: ${comparisonResult.diffHours.toLocaleString()} ঘণ্টা
• মোট ব্যবধান সেকেন্ড হিসেবে: ${comparisonResult.diffSeconds.toLocaleString()} সেকেন্ড
• সম্পর্কের সামঞ্জস্যতা (Compatibility): ${comparisonResult.compatibilityScore}%

--------------------------------------------------
${comparisonResult.name1}-এর বয়স বিবরণী:
--------------------------------------------------
• বয়স: ${comparisonResult.age1.years} বছর, ${comparisonResult.age1.months} মাস, ${comparisonResult.age1.days} দিন
• জীবন ক্যাটাগরি: ${comparisonResult.age1.category}
• মোট দিন: ${comparisonResult.age1.totalDays.toLocaleString()} দিন

--------------------------------------------------
${comparisonResult.name2}-এর বয়স বিবরণী:
--------------------------------------------------
• বয়স: ${comparisonResult.age2.years} বছর, ${comparisonResult.age2.months} মাস, ${comparisonResult.age2.days} দিন
• জীবন ক্যাটাগরি: ${comparisonResult.age2.category}
• মোট দিন: ${comparisonResult.age2.totalDays.toLocaleString()} দিন

--------------------------------------------------
নিখুঁত বয়স ক্যালকুলেটর (Precision Age Calculator) অ্যাপ থেকে শেয়ার করা হয়েছে ⏳
`;
      } else if (lang === 'es') {
        subject = 'Nuestro Informe de Compatibilidad y Brecha de Edad 🤝';
        body = `¡Hola!

Aquí está nuestro informe detallado de comparación cronológica de precisión:

--------------------------------------------------
RESUMEN DE LA BRECHA DE EDAD
--------------------------------------------------
• Comparación entre: ${comparisonResult.olderName} y ${comparisonResult.youngerName}
• Brecha precisa: ${comparisonResult.diffYears} años, ${comparisonResult.diffMonths} meses, ${comparisonResult.diffRemainingDays} días
• Brecha total en días: ${comparisonResult.diffDays.toLocaleString()} días
• Brecha total en horas: ${comparisonResult.diffHours.toLocaleString()} horas
• Brecha total en segundos: ${comparisonResult.diffSeconds.toLocaleString()} segundos
• Puntuación de compatibilidad: ${comparisonResult.compatibilityScore}%

--------------------------------------------------
Perfil de edad de ${comparisonResult.name1}:
--------------------------------------------------
• Edad: ${comparisonResult.age1.years} años, ${comparisonResult.age1.months} meses, ${comparisonResult.age1.days} días
• Categoría de vida: ${comparisonResult.age1.category}
• Total de días: ${comparisonResult.age1.totalDays.toLocaleString()} días

--------------------------------------------------
Perfil de edad de ${comparisonResult.name2}:
--------------------------------------------------
• Edad: ${comparisonResult.age2.years} años, ${comparisonResult.age2.months} meses, ${comparisonResult.age2.days} días
• Categoría de vida: ${comparisonResult.age2.category}
• Total de días: ${comparisonResult.age2.totalDays.toLocaleString()} días

--------------------------------------------------
Compartido a través de la aplicación Calculadora de Edad de Precisión ⏳
`;
      } else {
        subject = 'Our Age Compatibility & Gap Report 🤝';
        body = `Hi there!

Here is our precise chronological comparison and age-gap report:

--------------------------------------------------
AGE DIFFERENCE SUMMARY
--------------------------------------------------
• Comparison between: ${comparisonResult.olderName} and ${comparisonResult.youngerName}
• Precise age gap: ${comparisonResult.diffYears} Years, ${comparisonResult.diffMonths} Months, ${comparisonResult.diffRemainingDays} Days
• Total gap in days: ${comparisonResult.diffDays.toLocaleString()} Days
• Total gap in hours: ${comparisonResult.diffHours.toLocaleString()} Hours
• Total gap in seconds: ${comparisonResult.diffSeconds.toLocaleString()} Seconds
• Compatibility score: ${comparisonResult.compatibilityScore}%

--------------------------------------------------
${comparisonResult.name1}'s Age Profile:
--------------------------------------------------
• Age: ${comparisonResult.age1.years} Years, ${comparisonResult.age1.months} Months, ${comparisonResult.age1.days} Days
• Life category: ${comparisonResult.age1.category}
• Total earthly days: ${comparisonResult.age1.totalDays.toLocaleString()} Days

--------------------------------------------------
${comparisonResult.name2}'s Age Profile:
--------------------------------------------------
• Age: ${comparisonResult.age2.years} Years, ${comparisonResult.age2.months} Months, ${comparisonResult.age2.days} Days
• Life category: ${comparisonResult.age2.category}
• Total earthly days: ${comparisonResult.age2.totalDays.toLocaleString()} Days

--------------------------------------------------
Shared via Precision Age Calculator App ⏳
`;
      }
    } else if (result) {
      let celebrityMatchInfo = '';
      if (celebrity) {
        const celebDesc = celebrity.descriptions?.[lang] || celebrity.descriptions?.[ 'en' ] || '';
        if (lang === 'bn') {
          celebrityMatchInfo = `
--------------------------------------------------
আপনার জন্মদিন যমজ সেলিব্রিটি 🌟
--------------------------------------------------
• নাম: ${celebrity.name} (${celebrity.year > 0 ? `জন্ম ${celebrity.year}` : `জন্ম ${Math.abs(celebrity.year)} খ্রিষ্টপূর্ব`})
• পরিচিতি: ${celebDesc}
`;
        } else if (lang === 'es') {
          celebrityMatchInfo = `
--------------------------------------------------
TU MELLIZO DE CUMPLEAÑOS FAMOSO 🌟
--------------------------------------------------
• Nombre: ${celebrity.name} (${celebrity.year > 0 ? `Nacido en ${celebrity.year}` : `Nacido en ${Math.abs(celebrity.year)} a.C.`})
• Descripción: ${celebDesc}
`;
        } else {
          celebrityMatchInfo = `
--------------------------------------------------
YOUR CELEBRITY BIRTHDAY TWIN 🌟
--------------------------------------------------
• Name: ${celebrity.name} (${celebrity.year > 0 ? `Born ${celebrity.year}` : `Born ${Math.abs(celebrity.year)} BC`})
• Description: ${celebDesc}
`;
        }
      }

      if (lang === 'bn') {
        subject = 'আমার নিখুঁত বয়স বিবরণী রিপোর্ট 📅';
        body = `প্রিয়,

এখানে আমার অতি নিখুঁত বয়স বিবরণী ও সময় পরিসংখ্যান দেওয়া হলো:

--------------------------------------------------
নিখুঁত বয়স বিশ্লেষণ (Chronological Breakdown)
--------------------------------------------------
• বয়স: ${result.years} বছর, ${result.months} মাস, ${result.days} দিন
• জীবন ক্যাটাগরি: ${result.category}

--------------------------------------------------
পার্থিব সময়ের অতিবাহিত রেকর্ড (Time Metrics)
--------------------------------------------------
• মোট দিন: ${result.totalDays.toLocaleString()} দিন
• মোট সপ্তাহ: ${result.totalWeeks.toLocaleString()} সপ্তাহ
• মোট ঘণ্টা: ${result.totalHours.toLocaleString()} ঘণ্টা
• মোট মিনিট: ${result.totalMinutes.toLocaleString()} মিনিট
• মোট সেকেন্ড: ${result.totalSeconds.toLocaleString()} সেকেন্ড

--------------------------------------------------
পরবর্তী জন্মদিন বিবরণী (Next Birthday)
--------------------------------------------------
• পরবর্তী জন্মদিন: ${result.nextBirthdayMonths} মাস এবং ${result.nextBirthdayDays} দিন পর!
• দিনটি হবে: ${result.nextBirthdayWeekday}
${celebrityMatchInfo}
--------------------------------------------------
নিখুঁত বয়স ক্যালকুলেটর (Precision Age Calculator) অ্যাপ থেকে শেয়ার করা হয়েছে ⏳
`;
      } else if (lang === 'es') {
        subject = 'Mi Informe de Perfil de Edad de Precisión 📅';
        body = `¡Hola!

Aquí está mi informe detallado de edad cronológica de alta precisión y estadísticas:

--------------------------------------------------
DESGLOSE DE EDAD CRONOLÓGICA
--------------------------------------------------
• Edad: ${result.years} años, ${result.months} meses, ${result.days} días
• Categoría de vida: ${result.category}

--------------------------------------------------
MÉTRICAS DE TIEMPO TERRENAL TRANSCURRIDO
--------------------------------------------------
• Total de días: ${result.totalDays.toLocaleString()} días
• Total de semanas: ${result.totalWeeks.toLocaleString()} semanas
• Total de horas: ${result.totalHours.toLocaleString()} horas
• Total de minutos: ${result.totalMinutes.toLocaleString()} minutos
• Total de segundos: ${result.totalSeconds.toLocaleString()} segundos

--------------------------------------------------
INFORMACIÓN DE TU PRÓXIMO CUMPLEAÑOS
--------------------------------------------------
• Cuenta regresiva: ¡Faltan ${result.nextBirthdayMonths} meses y ${result.nextBirthdayDays} días!
• Día de la semana: ${result.nextBirthdayWeekday}
${celebrityMatchInfo}
--------------------------------------------------
Compartido a través de la aplicación Calculadora de Edad de Precisión ⏳
`;
      } else {
        subject = 'My Precision Age Profile Report 📅';
        body = `Hi there!

Here is my highly precise chronological age profile and lifetime statistics report:

--------------------------------------------------
CHRONOLOGICAL AGE BREAKDOWN
--------------------------------------------------
• Age: ${result.years} Years, ${result.months} Months, ${result.days} Days
• Life category: ${result.category}

--------------------------------------------------
ELAPSED EARTHLY TIME METRICS
--------------------------------------------------
• Total days experienced: ${result.totalDays.toLocaleString()} Days
• Total weeks experienced: ${result.totalWeeks.toLocaleString()} Weeks
• Total hours experienced: ${result.totalHours.toLocaleString()} Hours
• Total minutes experienced: ${result.totalMinutes.toLocaleString()} Minutes
• Total seconds experienced: ${result.totalSeconds.toLocaleString()} Seconds

--------------------------------------------------
UPCOMING BIRTHDAY INFORMATION
--------------------------------------------------
• Countdown: ${result.nextBirthdayMonths} Months, ${result.nextBirthdayDays} Days left!
• Weekday: Falls on a ${result.nextBirthdayWeekday}
${celebrityMatchInfo}
--------------------------------------------------
Shared via Precision Age Calculator App ⏳
`;
      }
    } else {
      subject = lang === 'bn' ? 'বয়স বিবরণী রিপোর্ট 📅' : (lang === 'es' ? 'Informe de Edad 📅' : 'Age Report 📅');
      body = 'No data available.';
    }

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Draw the actual image on a high-res 1080x1080 canvas and download
  const renderAndDownload = async () => {
    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Enable premium image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Load custom image if present
      let uploadedImgEl: HTMLImageElement | null = null;
      if (customImage) {
        try {
          uploadedImgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = customImage;
          });
        } catch (err) {
          console.error("Failed to load uploaded image on canvas:", err);
        }
      }

      // ==========================================
      // IF WE ARE IN CELEBRITY TWIN MODE
      // ==========================================
      if (celebrity) {
        // Draw Radial background
        const grad = ctx.createRadialGradient(540, 540, 50, 540, 540, 760);
        grad.addColorStop(0, currentTheme.bgGradients[1]);
        grad.addColorStop(0.5, currentTheme.bgGradients[0]);
        grad.addColorStop(1, currentTheme.bgGradients[2] || currentTheme.bgGradients[0]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Circular background lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let r = 200; r <= 800; r += 150) {
          ctx.beginPath();
          ctx.arc(540, 540, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Outer neon glow ring
        ctx.shadowBlur = 40;
        ctx.shadowColor = currentTheme.borderColor;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(540, 540, 480, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Watermark
        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '4px';
        ctx.fillText('PRECISION CHRONOLOGICAL BIRTHDAY TWIN', 540, 1015);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = '16px sans-serif';
        ctx.letterSpacing = '1px';
        ctx.fillText('precision-age-calculator.app', 540, 1040);

        // Header Section
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 24px sans-serif';
        ctx.letterSpacing = '6px';
        ctx.fillText('COSMIC BIRTHDAY TWIN', 540, 110);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'black 54px sans-serif';
        const displayCompTitle = userName.trim() ? userName.trim() : (lang === 'bn' ? 'আমার জন্মদিনের জমজ তারকা' : 'MY BIRTHDAY TWIN');
        ctx.fillText(displayCompTitle.toUpperCase(), 540, 180);

        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.letterSpacing = '4px';
        const achievementText = celebrity.achievement[lang] || celebrity.achievement['en'] || '';
        ctx.fillText(`${achievementText.toUpperCase()}`, 540, 230);

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(340, 260);
        ctx.lineTo(740, 260);
        ctx.stroke();

        // Draw Avatars Side-By-Side (User at 380, Celebrity at 700)
        // User Avatar Frame
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(380, 390, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw Emoji
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        const userEmoji = gender === 'male' ? '👦' : gender === 'female' ? '👧' : '👤';
        ctx.fillText(userEmoji, 380, 408);

        // Sparkle symbol in middle
        ctx.fillStyle = '#f59e0b'; // amber-500
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText('✨', 540, 405);

        // Celebrity Avatar Frame
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(700, 390, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '48px sans-serif';
        ctx.fillText(celebrity.icon || '🌟', 700, 408);

        // Column 1: User details (X = 300)
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(140, 520, 360, 280, 24);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 20px sans-serif';
        const uLabel = userName.trim() ? userName : (lang === 'bn' ? 'আপনি' : 'YOU');
        ctx.fillText(uLabel.toUpperCase(), 170, 570);

        if (result) {
          ctx.fillStyle = currentTheme.textColor;
          ctx.font = 'bold 46px sans-serif';
          ctx.fillText(`${result.years} Years`, 170, 640);

          ctx.fillStyle = currentTheme.subtextColor;
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(`${result.months} Months • ${result.days} Days`, 170, 690);

          ctx.fillStyle = currentTheme.subtextColor;
          ctx.font = '16px monospace';
          ctx.fillText(`${result.totalDays.toLocaleString()} Days Lived`, 170, 740);
        } else {
          ctx.fillStyle = currentTheme.textColor;
          ctx.font = 'bold 36px sans-serif';
          ctx.fillText(`BIRTHDAY MATE`, 170, 640);

          ctx.fillStyle = currentTheme.subtextColor;
          ctx.font = '16px monospace';
          ctx.fillText('Sharing our special day!', 170, 695);
        }

        // Column 2: Celebrity details (X = 780)
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(580, 520, 360, 280, 24);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(celebrity.name.toUpperCase(), 610, 570);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 46px sans-serif';
        const celebBornText = celebrity.year > 0 ? `Born ${celebrity.year}` : `Born ${Math.abs(celebrity.year)} BC`;
        ctx.fillText(celebBornText, 610, 640);

        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 16px sans-serif';
        const celebDesc = celebrity.descriptions[lang] || celebrity.descriptions['en'] || '';
        // Wrap description text helper
        const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
          const words = text.split(' ');
          let line = '';
          let currentY = y;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, x, currentY);
              line = words[n] + ' ';
              currentY += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, x, currentY);
        };
        
        ctx.font = '14px sans-serif';
        wrapText(celebDesc, 610, 690, 300, 20);

        // Bottom Banner for overlap & variance
        const bottomBoxY = 840;
        const bottomBoxWidth = 800;
        const bottomBoxHeight = 120;
        const bottomBoxX = 540 - bottomBoxWidth / 2;

        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bottomBoxX, bottomBoxY, bottomBoxWidth, bottomBoxHeight, 24);
        ctx.fill();
        ctx.stroke();

        // Overlap stat (left side)
        ctx.textAlign = 'center';
        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 24px sans-serif';
        const mText = lang === 'bn' 
          ? 'আমরা একই ক্যালেন্ডার দিনে জন্ম নিয়েছি!' 
          : lang === 'es' 
          ? '¡Compartimos el mismo día de nacimiento!' 
          : 'WE SHARE THE SAME CALENDAR BIRTH DATE!';
        ctx.fillText(mText, 540, bottomBoxY + 70);

        // Convert and Download
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `PrecisionChrono_BirthdayTwin_${celebrity.name.replace(/\s+/g, '_')}_${activeTheme}.png`;
        link.href = imgData;
        link.click();

        console.log('[Google Analytics] Celebrity Twin Social Card generated and downloaded');
        setIsGenerating(false);
        return;
      }

      // ==========================================
      // IF WE ARE IN COMPARISON MODE
      // ==========================================
      if (!result && comparisonResult) {
        // Draw Radial background
        const grad = ctx.createRadialGradient(540, 540, 50, 540, 540, 760);
        grad.addColorStop(0, currentTheme.bgGradients[1]);
        grad.addColorStop(0.5, currentTheme.bgGradients[0]);
        grad.addColorStop(1, currentTheme.bgGradients[2] || currentTheme.bgGradients[0]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Circular background lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let r = 200; r <= 800; r += 150) {
          ctx.beginPath();
          ctx.arc(540, 540, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Outer neon glow ring
        ctx.shadowBlur = 40;
        ctx.shadowColor = currentTheme.borderColor;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(540, 540, 480, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Watermark
        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '4px';
        ctx.fillText('PRECISION CHRONOLOGICAL CALCULATOR', 540, 1015);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = '16px sans-serif';
        ctx.letterSpacing = '1px';
        ctx.fillText('precision-age-calculator.app', 540, 1040);

        // Header Section
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 24px sans-serif';
        ctx.letterSpacing = '6px';
        ctx.fillText('CHRONO RELATIONSHIP BOND', 540, 110);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'black 54px sans-serif';
        const displayCompTitle = userName.trim() ? userName.trim() : (lang === 'bn' ? 'ক্রোনোলজিক্যাল বন্ধন রিপোর্ট' : 'OUR CHRONO RELATIONSHIP');
        ctx.fillText(displayCompTitle.toUpperCase(), 540, 180);

        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillText(`COMPATIBILITY SCORE: ${comparisonResult.compatibilityScore}% CHEMISTRY`, 540, 230);

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(340, 260);
        ctx.lineTo(740, 260);
        ctx.stroke();

        // Draw Avatars Side-By-Side (Person 1 at 380, Person 2 at 700)
        // Person 1 Avatar Frame
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(380, 390, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw Emoji
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(compGender1 === 'male' ? '👦' : compGender1 === 'female' ? '👧' : '👤', 380, 408);

        // Heart symbol in middle
        ctx.fillStyle = '#f43f5e'; // rose-500
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText('❤️', 540, 405);

        // Person 2 Avatar Frame
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(700, 390, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '48px sans-serif';
        ctx.fillText(compGender2 === 'male' ? '👦' : compGender2 === 'female' ? '👧' : '👤', 700, 408);

        // Column 1: Person 1 details (X = 300)
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(140, 520, 360, 280, 24);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText((compName1 || 'Person A').toUpperCase(), 170, 570);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 46px sans-serif';
        ctx.fillText(`${comparisonResult.age1.years} Years`, 170, 640);

        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${comparisonResult.age1.months} Months • ${comparisonResult.age1.days} Days`, 170, 690);

        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = '16px monospace';
        ctx.fillText(`${comparisonResult.age1.totalDays.toLocaleString()} Total Days`, 170, 740);

        // Column 2: Person 2 details (X = 780)
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(580, 520, 360, 280, 24);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText((compName2 || 'Person B').toUpperCase(), 610, 570);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 46px sans-serif';
        ctx.fillText(`${comparisonResult.age2.years} Years`, 610, 640);

        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${comparisonResult.age2.months} Months • ${comparisonResult.age2.days} Days`, 610, 690);

        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = '16px monospace';
        ctx.fillText(`${comparisonResult.age2.totalDays.toLocaleString()} Total Days`, 610, 740);

        // Bottom Banner for overlap & variance
        const bottomBoxY = 840;
        const bottomBoxWidth = 800;
        const bottomBoxHeight = 120;
        const bottomBoxX = 540 - bottomBoxWidth / 2;

        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bottomBoxX, bottomBoxY, bottomBoxWidth, bottomBoxHeight, 24);
        ctx.fill();
        ctx.stroke();

        // Overlap stat (left side)
        ctx.textAlign = 'left';
        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 15px sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('LIFESPAN CO-EXISTENCE', bottomBoxX + 40, bottomBoxY + 45);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`${comparisonResult.overlapPercentage}% Overlap`, bottomBoxX + 40, bottomBoxY + 85);

        // Variance / Gap (right side)
        ctx.textAlign = 'right';
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 15px sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('CHRONO GAP DIFFERENCE', bottomBoxX + bottomBoxWidth - 40, bottomBoxY + 45);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 24px sans-serif';
        const gapText = comparisonResult.isOlder === 'same' 
          ? 'Born on same day' 
          : `${comparisonResult.diffYears}Y ${comparisonResult.diffMonths}M ${comparisonResult.diffRemainingDays}D`;
        ctx.fillText(gapText, bottomBoxX + bottomBoxWidth - 40, bottomBoxY + 85);

        // Convert and Download
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `PrecisionChrono_RelationshipCard_${activeTheme}.png`;
        link.href = imgData;
        link.click();

        console.log('[Google Analytics] Relationship Social Card generated and downloaded');
        setIsGenerating(false);
        return;
      }

      // ==========================================
      // OTHERWISE: SINGLE PERSON MODE (original logic)
      // ==========================================
      if (result) {
        // 1. Background Gradient drawing
        const grad = ctx.createRadialGradient(540, 540, 50, 540, 540, 760);
        grad.addColorStop(0, currentTheme.bgGradients[1]);
        grad.addColorStop(0.5, currentTheme.bgGradients[0]);
        grad.addColorStop(1, currentTheme.bgGradients[2] || currentTheme.bgGradients[0]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Decorative elements (Planetary/Chronological abstract lines)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let r = 200; r <= 800; r += 150) {
          ctx.beginPath();
          ctx.arc(540, 540, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw stylized glowing circles
        ctx.shadowBlur = 40;
        ctx.shadowColor = currentTheme.borderColor;
        ctx.strokeStyle = currentTheme.borderColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(540, 540, 480, 0, Math.PI * 2);
        ctx.stroke();

        // Reset shadows
        ctx.shadowBlur = 0;

        // 3. Draw Watermark Branding at the bottom
        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '4px';
        ctx.fillText('PRECISION CHRONOLOGICAL TRACKER', 540, 1015);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = '16px sans-serif';
        ctx.letterSpacing = '1px';
        ctx.fillText('precision-age-calculator.app', 540, 1040);

        // 4. Header Section: Title & Name
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 24px sans-serif';
        ctx.letterSpacing = '6px';
        ctx.fillText('AGE ANALYSIS PROFILE', 540, 120);

        // Display name
        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'black 62px system-ui, -apple-system, sans-serif';
        ctx.letterSpacing = '1px';
        const displayName = userName.trim() ? userName.trim() : (lang === 'bn' ? 'আমার বয়স প্রোফাইল' : lang === 'es' ? 'Mi Perfil de Edad' : 'My Age Profile');
        ctx.fillText(displayName.toUpperCase(), 540, 200);

        // Category badge
        const displayCategory = t[result.category] || result.category;
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 22px sans-serif';
        ctx.letterSpacing = '4px';
        ctx.fillText(`CATEGORY: ${displayCategory.toUpperCase()}`, 540, 245);

        // Draw an elegant decorative horizontal separator
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(340, 280);
        ctx.lineTo(740, 280);
        ctx.stroke();

        // 5. Draw Avatar circular illustration inside a frame
        const avatarX = 540;
        const avatarY = 440;
        const avatarRadius = 90;

        // Draw shadow and background for avatar frame
        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = currentTheme.accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (uploadedImgEl) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
          ctx.clip();
          const aspect = uploadedImgEl.width / uploadedImgEl.height;
          let drawW = avatarRadius * 2;
          let drawH = avatarRadius * 2;
          let drawX = avatarX - avatarRadius;
          let drawY = avatarY - avatarRadius;
          if (aspect > 1) {
            drawW = avatarRadius * 2 * aspect;
            drawX = avatarX - drawW / 2;
          } else {
            drawH = (avatarRadius * 2) / aspect;
            drawY = avatarY - drawH / 2;
          }
          ctx.drawImage(uploadedImgEl, drawX, drawY, drawW, drawH);
          ctx.restore();
        } else {
          // Simple, beautiful geometric icon/avatar drawn on canvas based on category
          ctx.fillStyle = '#ffedd5'; // default skin tone
          ctx.beginPath();
          ctx.arc(avatarX, avatarY + 10, 50, 0, Math.PI * 2);
          ctx.fill();

          // Hair & features based on category and gender
          if (result.category === 'child') {
            ctx.fillStyle = '#38bdf8'; // Sky cap
            ctx.beginPath();
            ctx.arc(avatarX, avatarY - 20, 35, Math.PI, 0);
            ctx.fill();
            // Rosy cheeks
            ctx.fillStyle = 'rgba(244, 63, 94, 0.5)';
            ctx.beginPath();
            ctx.arc(avatarX - 25, avatarY + 15, 10, 0, Math.PI * 2);
            ctx.arc(avatarX + 25, avatarY + 15, 10, 0, Math.PI * 2);
            ctx.fill();
          } else if (result.category === 'boy' || result.category === 'teenage') {
            ctx.fillStyle = '#1e293b'; // Slate locks
            ctx.beginPath();
            ctx.arc(avatarX, avatarY - 22, 45, Math.PI * 1.1, Math.PI * 1.9);
            ctx.lineTo(avatarX + 45, avatarY);
            ctx.lineTo(avatarX - 45, avatarY);
            ctx.closePath();
            ctx.fill();
          } else if (result.category === 'senior') {
            ctx.fillStyle = '#e2e8f0'; // Gray hair
            ctx.beginPath();
            ctx.arc(avatarX - 35, avatarY - 15, 25, 0, Math.PI * 2);
            ctx.arc(avatarX + 35, avatarY - 15, 25, 0, Math.PI * 2);
            ctx.arc(avatarX, avatarY - 30, 30, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Adult
            ctx.fillStyle = '#3f3f46'; // Dark gray/zinc locks
            ctx.beginPath();
            ctx.arc(avatarX, avatarY - 24, 45, Math.PI * 1.05, Math.PI * 1.95);
            ctx.fill();
          }

          // Drawing cute eyes & smiley
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(avatarX - 16, avatarY, 6, 0, Math.PI * 2);
          ctx.arc(avatarX + 16, avatarY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#27272a';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(avatarX, avatarY + 14, 18, 0, Math.PI);
          ctx.stroke();
        }

        // 6. Draw Big Core Age Numbers (Bento boxes)
        const boxWidth = 240;
        const boxHeight = 160;
        const gap = 30;
        const startX = 540 - (boxWidth * 1.5 + gap);
        const boxY = 600;

        const stats = [
          { value: result.years, label: t.years.toUpperCase() },
          { value: result.months, label: t.months.toUpperCase() },
          { value: result.days, label: t.days.toUpperCase() },
        ];

        stats.forEach((item, index) => {
          const x = startX + index * (boxWidth + gap);

          // Box shadow glow in templates
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          
          // Render box
          ctx.fillStyle = currentTheme.cardBg;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 2;
          
          // Round rect drawing helper
          ctx.beginPath();
          ctx.roundRect(x, boxY, boxWidth, boxHeight, 24);
          ctx.fill();
          ctx.stroke();
          
          ctx.shadowBlur = 0;

          // Draw Value
          ctx.fillStyle = currentTheme.textColor;
          ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(item.value.toString(), x + boxWidth / 2, boxY + 80);

          // Draw Label
          ctx.fillStyle = currentTheme.subtextColor;
          ctx.font = 'bold 16px sans-serif';
          ctx.letterSpacing = '2px';
          ctx.fillText(item.label, x + boxWidth / 2, boxY + 125);
        });

        // 7. Draw bottom breakdown box
        const bottomBoxY = 800;
        const bottomBoxWidth = 780;
        const bottomBoxHeight = 120;
        const bottomBoxX = 540 - bottomBoxWidth / 2;

        ctx.fillStyle = currentTheme.cardBg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.roundRect(bottomBoxX, bottomBoxY, bottomBoxWidth, bottomBoxHeight, 24);
        ctx.fill();
        ctx.stroke();

        // Chronological details inside bottom banner
        ctx.textAlign = 'left';
        ctx.fillStyle = currentTheme.subtextColor;
        ctx.font = 'bold 15px sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('TOTAL TIME LIVED', bottomBoxX + 40, bottomBoxY + 45);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 28px monospace';
        ctx.fillText(`${result.totalDays.toLocaleString()} Days`, bottomBoxX + 40, bottomBoxY + 85);

        // Next Birthday on the right
        ctx.textAlign = 'right';
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = 'bold 15px sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('NEXT BIRTHDAY', bottomBoxX + bottomBoxWidth - 40, bottomBoxY + 45);

        ctx.fillStyle = currentTheme.textColor;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`In ${result.nextBirthdayDays} Days`, bottomBoxX + bottomBoxWidth - 40, bottomBoxY + 85);

        // 8. Convert to Image and trigger dynamic browser download
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `PrecisionAge_SocialCard_${activeTheme}.png`;
        link.href = imgData;
        link.click();

        console.log('[Google Analytics] Precision Age Social Card image generated and downloaded');
      }
    } catch (err) {
      console.error('Error generating social card:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-2xl overflow-hidden rounded-[32px] p-6 shadow-2xl border flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto ${
            isDark 
              ? 'glass-container-liquid-dark text-slate-100 border-zinc-800' 
              : 'bg-white text-slate-800 border-slate-150'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer z-10 ${
              isDark 
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-450 hover:text-zinc-100' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-505 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left panel: Live mockup preview */}
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-2xl relative min-h-[300px] select-none">
            {celebrity ? (
              /* Dynamic Celebrity Twin Mockup */
              <div
                className="w-full aspect-square rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden text-center shadow-lg transition-all duration-300 border border-white/10 text-white"
                style={{
                  background: `radial-gradient(circle, ${currentTheme.bgGradients[1]} 0%, ${currentTheme.bgGradients[0]} 100%)`,
                }}
              >
                {/* Outer border highlight */}
                <div
                  className="absolute inset-1 rounded-[14px] border-2 pointer-events-none"
                  style={{ borderColor: currentTheme.borderColor, opacity: 0.7 }}
                />

                {/* Title Header */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold tracking-widest block opacity-85" style={{ color: currentTheme.accentColor }}>
                    {lang === 'bn' ? 'কসমিক জন্মদিনের জমজ' : 'COSMIC BIRTHDAY TWIN'}
                  </span>
                  <h3 className="text-sm font-black tracking-tight" style={{ color: currentTheme.textColor }}>
                    {userName.trim() ? userName.toUpperCase() : (lang === 'bn' ? 'আমার জন্মদিনের জমজ' : 'MY BIRTHDAY TWIN')}
                  </h3>
                  <span className="text-[9px] uppercase font-mono tracking-wider opacity-75 block truncate" style={{ color: currentTheme.subtextColor }}>
                    {celebrity.achievement[lang] || celebrity.achievement['en']}
                  </span>
                </div>

                {/* Central Twin Badge */}
                <div className="flex justify-center items-center my-1 gap-4 relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border text-lg bg-slate-900/45" style={{ borderColor: currentTheme.borderColor }}>
                    {gender === 'male' ? '👦' : gender === 'female' ? '👧' : '👤'}
                  </div>
                  <div className="text-xl animate-pulse">✨</div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border text-lg bg-slate-900/45" style={{ borderColor: currentTheme.borderColor }}>
                    {celebrity.icon || '🌟'}
                  </div>
                </div>

                {/* Two columns ages */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2 rounded-xl border border-white/5 bg-white/5">
                    <span className="text-[8.5px] font-bold block truncate" style={{ color: currentTheme.accentColor }}>
                      {userName.trim() ? userName : (lang === 'bn' ? 'আপনি' : 'YOU')}
                    </span>
                    {result ? (
                      <>
                        <span className="text-xs font-black block" style={{ color: currentTheme.textColor }}>
                          {result.years} yrs
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 block">
                          {result.months}m • {result.days}d
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400 block py-1">Birthday Mate</span>
                    )}
                  </div>
                  <div className="p-2 rounded-xl border border-white/5 bg-white/5">
                    <span className="text-[8.5px] font-bold block truncate" style={{ color: currentTheme.accentColor }}>
                      {celebrity.name}
                    </span>
                    <span className="text-xs font-black block" style={{ color: currentTheme.textColor }}>
                      {celebrity.year > 0 ? `Born ${celebrity.year}` : `Born ${Math.abs(celebrity.year)} BC`}
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 block truncate">
                      {celebrity.descriptions[lang] || celebrity.descriptions['en']}
                    </span>
                  </div>
                </div>

                {/* Bottom statistics */}
                <div className="p-2 rounded-xl border border-white/5 flex flex-col justify-center text-[8.5px] font-mono text-center bg-white/5">
                  <div className="text-[9px] font-bold text-center leading-none" style={{ color: currentTheme.textColor }}>
                    {lang === 'bn' 
                      ? 'আমরা একই ক্যালেন্ডার দিনে জন্ম নিয়েছি!' 
                      : lang === 'es' 
                      ? '¡Compartimos el mismo día de nacimiento!' 
                      : 'WE SHARE THE SAME CALENDAR BIRTH DATE!'}
                  </div>
                </div>
              </div>
            ) : result ? (
              /* Dynamic Single Card Mockup */
              <div
                className="w-full aspect-square rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden text-center shadow-lg transition-all duration-300 border border-white/10"
                style={{
                  background: `radial-gradient(circle, ${currentTheme.bgGradients[1]} 0%, ${currentTheme.bgGradients[0]} 100%)`,
                }}
              >
                {/* Outer border highlight */}
                <div
                  className="absolute inset-1 rounded-[14px] border-2 pointer-events-none"
                  style={{ borderColor: currentTheme.borderColor, opacity: 0.7 }}
                />

                {/* Title Header */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold tracking-widest block opacity-85 animate-pulse" style={{ color: currentTheme.accentColor }}>
                    {lang === 'bn' ? 'বয়স বিশ্লেষণ প্রোফাইল' : 'AGE ANALYSIS PROFILE'}
                  </span>
                  <h3 className="text-lg font-black tracking-tight" style={{ color: currentTheme.textColor }}>
                    {userName.trim() ? userName.toUpperCase() : (lang === 'bn' ? 'আমার বয়স প্রোফাইল' : lang === 'es' ? 'MI PERFIL DE EDAD' : 'MY AGE PROFILE')}
                  </h3>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-75 block" style={{ color: currentTheme.subtextColor }}>
                    {t[result.category] || result.category}
                  </span>
                </div>

                {/* Central Vector Badge */}
                <div className="flex justify-center items-center my-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to upload custom photo"
                    className="w-20 h-20 rounded-full flex items-center justify-center relative border shadow-inner overflow-hidden cursor-pointer group focus:outline-none transition-transform active:scale-95"
                    style={{ backgroundColor: currentTheme.cardBg, borderColor: currentTheme.accentColor }}
                  >
                    {customImage ? (
                      <img src={customImage} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-2xl transition-transform group-hover:scale-110">
                        {result.category === 'child' ? '👶' : result.category === 'boy' ? '👦' : result.category === 'teenage' ? '🎧' : result.category === 'senior' ? '👵' : '🧑'}
                      </div>
                    )}
                  </button>
                </div>

                {/* Age metrics bento style */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl border border-white/5" style={{ backgroundColor: currentTheme.cardBg }}>
                    <span className="text-xl font-bold block" style={{ color: currentTheme.textColor }}>{result.years}</span>
                    <span className="text-[8px] uppercase tracking-wider block font-medium" style={{ color: currentTheme.subtextColor }}>{t.years}</span>
                  </div>
                  <div className="p-2 rounded-xl border border-white/5" style={{ backgroundColor: currentTheme.cardBg }}>
                    <span className="text-xl font-bold block" style={{ color: currentTheme.textColor }}>{result.months}</span>
                    <span className="text-[8px] uppercase tracking-wider block font-medium" style={{ color: currentTheme.subtextColor }}>{t.months}</span>
                  </div>
                  <div className="p-2 rounded-xl border border-white/5" style={{ backgroundColor: currentTheme.cardBg }}>
                    <span className="text-xl font-bold block" style={{ color: currentTheme.textColor }}>{result.days}</span>
                    <span className="text-[8px] uppercase tracking-wider block font-medium" style={{ color: currentTheme.subtextColor }}>{t.days}</span>
                  </div>
                </div>

                {/* Bottom statistics */}
                <div className="p-2 rounded-xl border border-white/5 flex justify-between text-left text-[9px] font-mono leading-none" style={{ backgroundColor: currentTheme.cardBg }}>
                  <div>
                    <span className="block mb-0.5" style={{ color: currentTheme.subtextColor }}>LIVED</span>
                    <span className="font-bold" style={{ color: currentTheme.textColor }}>{result.totalDays.toLocaleString()} Days</span>
                  </div>
                  <div className="text-right">
                    <span className="block mb-0.5" style={{ color: currentTheme.accentColor }}>NEXT BIRTHDAY</span>
                    <span className="font-bold" style={{ color: currentTheme.textColor }}>In {result.nextBirthdayDays} Days</span>
                  </div>
                </div>
              </div>
            ) : comparisonResult ? (
              /* Dynamic Comparison Card Mockup */
              <div
                className="w-full aspect-square rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden text-center shadow-lg transition-all duration-300 border border-white/10 text-white"
                style={{
                  background: `radial-gradient(circle, ${currentTheme.bgGradients[1]} 0%, ${currentTheme.bgGradients[0]} 100%)`,
                }}
              >
                {/* Outer border highlight */}
                <div
                  className="absolute inset-1 rounded-[14px] border-2 pointer-events-none"
                  style={{ borderColor: currentTheme.borderColor, opacity: 0.7 }}
                />

                {/* Title Header */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold tracking-widest block opacity-85" style={{ color: currentTheme.accentColor }}>
                    {lang === 'bn' ? 'ক্রোনোলজিক্যাল বন্ধন বিশ্লেষণ' : 'CHRONO BOND ANALYSIS'}
                  </span>
                  <h3 className="text-sm font-black tracking-tight" style={{ color: currentTheme.textColor }}>
                    {userName.trim() ? userName.toUpperCase() : (lang === 'bn' ? 'আমাদের বয়স তুলনা' : 'OUR CHRONO CHEMISTRY')}
                  </h3>
                  <span className="text-[9px] uppercase font-mono tracking-wider opacity-75 block" style={{ color: currentTheme.subtextColor }}>
                    {comparisonResult.compatibilityScore}% compatibility score
                  </span>
                </div>

                {/* Central Chemistry Badge */}
                <div className="flex justify-center items-center my-1 gap-4 relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border text-lg bg-slate-900/40" style={{ borderColor: currentTheme.borderColor }}>
                    {compGender1 === 'male' ? '👦' : compGender1 === 'female' ? '👧' : '👤'}
                  </div>
                  <div className="text-xl animate-pulse">❤️</div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border text-lg bg-slate-900/40" style={{ borderColor: currentTheme.borderColor }}>
                    {compGender2 === 'male' ? '👦' : compGender2 === 'female' ? '👧' : '👤'}
                  </div>
                </div>

                {/* Two columns ages */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-2 rounded-xl border border-white/5 bg-white/5">
                    <span className="text-[8.5px] font-bold block truncate" style={{ color: currentTheme.accentColor }}>
                      {compName1}
                    </span>
                    <span className="text-xs font-black block" style={{ color: currentTheme.textColor }}>
                      {comparisonResult.age1.years} yrs
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 block">
                      {comparisonResult.age1.months}m • {comparisonResult.age1.days}d
                    </span>
                  </div>
                  <div className="p-2 rounded-xl border border-white/5 bg-white/5">
                    <span className="text-[8.5px] font-bold block truncate" style={{ color: currentTheme.accentColor }}>
                      {compName2}
                    </span>
                    <span className="text-xs font-black block" style={{ color: currentTheme.textColor }}>
                      {comparisonResult.age2.years} yrs
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 block">
                      {comparisonResult.age2.months}m • {comparisonResult.age2.days}d
                    </span>
                  </div>
                </div>

                {/* Bottom statistics */}
                <div className="p-2 rounded-xl border border-white/5 flex flex-col justify-center text-[8.5px] font-mono text-center gap-0.5 bg-white/5">
                  <div className="flex justify-between items-center text-slate-350 px-1">
                    <span>OVERLAP: {comparisonResult.overlapPercentage}%</span>
                    <span>GAP: {comparisonResult.diffDays.toLocaleString()} D</span>
                  </div>
                  <div className="text-[8px] font-bold text-center border-t border-white/10 pt-1 leading-none truncate max-w-full" style={{ color: currentTheme.textColor }}>
                    {comparisonResult.isOlder === 'same' 
                      ? 'Born on same day!' 
                      : `${comparisonResult.olderName} is older by ${comparisonResult.diffYears}Y ${comparisonResult.diffMonths}M ${comparisonResult.diffRemainingDays}D`}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Mockup Preview (Square 1:1)</span>
            </div>
          </div>

          {/* Right panel: Customisation forms */}
          <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
            <div className="space-y-4">
              <div>
                <h2 className={`text-xl font-display font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  <Palette className={`w-5 h-5 ${isDark ? 'text-zinc-350' : 'text-slate-800'}`} />
                  <span>Share Social Card</span>
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-505'}`}>
                  Generate and download a high-res, beautifully stylized square card perfectly optimized for sharing directly to Instagram or Facebook feeds.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Your Card Title (Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={18}
                  placeholder={result ? "e.g. My Age Profile" : "e.g. Our Bond Profile"}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all font-semibold placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${
                    isDark 
                      ? 'border-zinc-800 bg-zinc-900/60 text-zinc-100 focus:ring-zinc-700 focus:border-zinc-700' 
                      : 'border-slate-200 bg-slate-50 text-slate-800 focus:ring-slate-500 focus:border-slate-500'
                  }`}
                />
              </div>

              {/* Custom Image Upload Drag-and-Drop Area */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Custom Smart Photo</span>
                </label>
                
                <div
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setCustomImage(event.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
                    customImage 
                      ? 'border-emerald-500/40 bg-emerald-50/5' 
                      : isDark
                        ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/30'
                        : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setCustomImage(event.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  {customImage ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg overflow-hidden border ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                          <img src={customImage} alt="Uploaded preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Smart Photo Loaded</p>
                          <p className="text-[10px] text-emerald-500 font-semibold">Ready for age card</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isDark 
                            ? 'bg-zinc-800 hover:bg-red-950/30 text-zinc-400 hover:text-red-400' 
                            : 'bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-505'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 py-1">
                      <Upload className="w-6 h-6 text-slate-450 mx-auto mb-1" />
                      <p className={`text-xs font-bold ${isDark ? 'text-zinc-350' : 'text-slate-700'}`}>Drag & drop your smart photo</p>
                      <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>or click to browse local files</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Theme presets selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Choose Background Template</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themes).map(([key, item]) => {
                    const isSelected = activeTheme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveTheme(key as TemplateTheme)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'border-zinc-200 ring-2 ring-zinc-500/15 bg-zinc-900/60'
                              : 'border-slate-900 ring-2 ring-slate-900/15 bg-slate-50'
                            : isDark
                              ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/20'
                              : 'border-slate-150 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{item.name}</span>
                        {/* Little palette preview circles */}
                        <div className="flex gap-1 mt-1.5">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.bgGradients[0] }} />
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.bgGradients[1] }} />
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: item.borderColor }} />
                        </div>
                        {isSelected && (
                          <span className={`absolute top-2 right-2 p-0.5 rounded-full ${isDark ? 'bg-zinc-100 text-zinc-900' : 'bg-slate-900 text-white'}`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={renderAndDownload}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] text-white font-extrabold transition-all cursor-pointer text-sm shadow-md disabled:opacity-50"
              >
                <Download className="w-4.5 h-4.5 text-white" />
                <span>{isGenerating ? 'Generating...' : 'Download Social Card'}</span>
              </button>

              <a
                href={getMailtoUrl()}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99] text-white font-extrabold transition-all cursor-pointer text-sm shadow-md text-center"
              >
                <Mail className="w-4.5 h-4.5 text-white" />
                <span>{lang === 'bn' ? 'ইমেইল রিপোর্ট পাঠান' : (lang === 'es' ? 'Enviar Reporte por Email' : 'Email Precise Report')}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className={`w-full py-3 text-xs text-center font-semibold transition-all cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-505 hover:text-slate-800'
                }`}
              >
                Close & Return
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
