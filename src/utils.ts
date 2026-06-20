import { AgeCalculationResult, AgeCategory } from './types';

/**
 * Calculates exact age down to years, months, days, weeks, hours, minutes, and seconds,
 * as well as countdown stats for the next birthday.
 */
export function calculatePreciseAge(birthDate: Date, birthTime: string = '00:00'): AgeCalculationResult {
  const [timeHours, timeMinutes] = birthTime.split(':').map(Number);
  
  // Construct full birth datetime
  const birthDateTime = new Date(birthDate);
  birthDateTime.setHours(timeHours || 0, timeMinutes || 0, 0, 0);

  const now = new Date();
  
  if (birthDateTime > now) {
    throw new Error('Date of birth cannot be in the future!');
  }

  // Milliseconds difference
  const diffMs = now.getTime() - birthDateTime.getTime();

  // Basic total values
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  // Calendar calculations (Years, Months, Days breakdown)
  let years = now.getFullYear() - birthDateTime.getFullYear();
  let months = now.getMonth() - birthDateTime.getMonth();
  let days = now.getDate() - birthDateTime.getDate();

  // Handle hours/minutes shift in current day
  const currentHourShift = now.getHours() - birthDateTime.getHours();
  const currentMinShift = now.getMinutes() - birthDateTime.getMinutes();
  
  let hourAdjust = 0;
  if (currentHourShift < 0 || (currentHourShift === 0 && currentMinShift < 0)) {
    hourAdjust = -1;
  }

  // Adjust days if negative or offset by hours
  if (days + (hourAdjust < 0 ? -1 : 0) < 0) {
    months--;
    // Find previous month's days limit
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
    days = prevMonthDate.getDate() + days;
  }

  // Adjust months if negative
  if (months < 0) {
    years--;
    months = 12 + months;
  }

  // Calculate life threshold category
  let category: AgeCategory = 'adult';
  if (years < 5) {
    category = 'child';
  } else if (years < 13) {
    category = 'boy';
  } else if (years < 20) {
    category = 'teenage';
  } else if (years < 60) {
    category = 'adult';
  } else {
    category = 'senior';
  }

  // Calculate Next Birthday details
  const nextBirthdayDate = new Date(birthDateTime);
  nextBirthdayDate.setFullYear(now.getFullYear());
  
  // If birthday already passed this year, set to next year
  if (nextBirthdayDate < now) {
    nextBirthdayDate.setFullYear(now.getFullYear() + 1);
  }

  // Total milliseconds till next birthday
  const nextBirthdayDiffMs = nextBirthdayDate.getTime() - now.getTime();
  const nextBirthdayDays = Math.ceil(nextBirthdayDiffMs / (1000 * 60 * 60 * 24));
  
  // Calculate exact month difference for next birthday
  let nextBirthdayMonths = nextBirthdayDate.getMonth() - now.getMonth();
  if (nextBirthdayMonths < 0) {
    nextBirthdayMonths = 12 + nextBirthdayMonths;
  }

  // Weekday name indicator mapping index
  const weekdaysIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayWeekday = weekdaysIndex[nextBirthdayDate.getDay()];

  // Calculate days since last birthday
  const lastBirthdayDate = new Date(birthDateTime);
  lastBirthdayDate.setFullYear(nextBirthdayDate.getFullYear() - 1);
  const diffSinceLastBirthdayMs = now.getTime() - lastBirthdayDate.getTime();
  const daysSinceLastBirthday = Math.floor(diffSinceLastBirthdayMs / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days: Math.max(0, days),
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthdayDays,
    nextBirthdayMonths,
    nextBirthdayDate,
    nextBirthdayWeekday,
    daysSinceLastBirthday,
    category
  };
}

/**
 * Text parsing algorithm for multilingual Date of Birth spoken phrases.
 * Supports various languages and extracts matching Month Day Year numbers.
 */
export function parseSpokenDOB(text: string, currentLang: string): Date | null {
  const normalized = text.toLowerCase().trim();
  
  const monthsMap: Record<string, number> = {
    // Unique keys mapping across english, spanish, french, german, hindi, bengali, japanese
    january: 0, enero: 0, janvier: 0, januar: 0, জানুয়ারি: 0, জানুয়ারী: 0, जनवरी: 0,
    february: 1, feb: 1, febrero: 1, fevrier: 1, februar: 1, ফেব্রুয়ারি: 1, ফেব্রুয়ারী: 1, फरवरी: 1,
    march: 2, mar: 2, marzo: 2, mars: 2, marz: 2, märz: 2, মার্চ: 2, मार्च: 2,
    april: 3, apr: 3, abril: 3, এপ্রিল: 3, अप्रैल: 3,
    may: 4, mayo: 4, mai: 4, মে: 4, मई: 4,
    june: 5, jun: 5, junio: 5, juin: 5, juni: 5, জুন: 5, जून: 5,
    july: 6, jul: 6, julio: 6, juillet: 6, juli: 6, জুলাই: 6,
    august: 7, aug: 7, agosto: 7, aout: 7, আগস্ট: 7, अगस्त: 7,
    september: 8, sep: 8, septiembre: 8, সেপ্টেম্বর: 8, सितंबर: 8,
    october: 9, oct: 9, octubre: 9, octobre: 9, oktober: 9, অক্টোবর: 9, अक्टूबर: 9,
    november: 10, nov: 10, noviembre: 10, novembre: 10, নভেম্বর: 10, नवंबर: 10,
    december: 11, dec: 11, diciembre: 11, decembre: 11, dezember: 11, ডিসেম্বর: 11, दिसंबर: 11,
    // Japanese
    '1月': 0, '2月': 1, '3月': 2, '4月': 3, '5月': 4, '6月': 5, '7月': 6, '8月': 7, '9月': 8, '10月': 9, '11月': 10, '12月': 11
  };

  // Find if any Month keyword fits
  let monthIndex = -1;
  for (const [key, value] of Object.entries(monthsMap)) {
    if (normalized.includes(key)) {
      monthIndex = value;
      break;
    }
  }

  // Regular expression to isolate digits inside string expression (e.g. "1st", "15th", "1995")
  const numbers = normalized.match(/\d+/g)?.map(Number) || [];

  if (numbers.length >= 1) {
    let year = 1990; // Default fallback year
    let day = 1;     // Default fallback day

    // If month found first by text:
    if (monthIndex !== -1) {
      if (numbers.length >= 2) {
        // e.g. "October 21 1995" -> numbers [21, 1995]
        // Determine which is year vs day:
        const candidateYear = numbers.find(n => n > 100);
        const candidateDay = numbers.find(n => n <= 31);
        if (candidateYear) year = candidateYear;
        if (candidateDay) day = candidateDay;
      } else if (numbers.length === 1) {
        // e.g. "October 1995"
        if (numbers[0] > 100) {
          year = numbers[0];
          day = 1;
        } else {
          day = numbers[0];
        }
      }
    } else {
      // Numerical structures e.g. "21 10 1995" or "1995 10 21"
      if (numbers.length >= 3) {
        const potentialYearIndex = numbers.findIndex(n => n > 100);
        if (potentialYearIndex !== -1) {
          year = numbers[potentialYearIndex];
          const remaining = numbers.filter((_, idx) => idx !== potentialYearIndex);
          // Standard day vs month layout
          if (remaining[0] <= 31) day = remaining[0];
          if (remaining[1] <= 12) monthIndex = remaining[1] - 1;
        } else {
          // Fallback parsing
          day = numbers[0];
          monthIndex = Math.min(11, Math.max(0, numbers[1] - 1));
          year = numbers[2];
        }
      }
    }

    // Perform sanitation checks
    if (year < 100) {
      // 2-digit years e.g. "95" -> "1995"
      year = year < 30 ? 2000 + year : 1900 + year;
    }

    if (monthIndex === -1) {
      // Default to January if no keyword text matched
      monthIndex = 0;
    }

    const parsedDate = new Date(year, monthIndex, day);
    if (!isNaN(parsedDate.getTime()) && parsedDate <= new Date()) {
      return parsedDate;
    }
  }

  // Attempt raw JavaScript Date parse as ultimate fall-back
  const rawParsed = new Date(normalized);
  if (!isNaN(rawParsed.getTime()) && rawParsed <= new Date()) {
    return rawParsed;
  }

  return null;
}
