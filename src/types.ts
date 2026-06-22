export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ja' | 'bn' | 'ar' | 'pt' | 'ru' | 'zh' | 'it' | 'tr' | 'ko' | 'vi' | 'id' | 'nl' | 'pl';

export interface TranslationDict {
  title: string;
  subtitle: string;
  birthDateLabel: string;
  birthTimeLabel: string;
  calculateBtn: string;
  voiceBtnLabel: string;
  voiceListening: string;
  voiceProcessing: string;
  voiceError: string;
  voiceSuccess: string;
  voiceStopBtn: string;
  themeToggle: string;
  languageSelect: string;
  years: string;
  months: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  weeks: string;
  nextBirthday: string;
  birthdayCountdown: string;
  nextBirthdayDay: string;
  ageCategory: string;
  child: string;
  boy: string;
  teenage: string;
  adult: string;
  senior: string;
  statsTitle: string;
  faqTitle: string;
  seoDescription: string;
  adsTitle: string;
  adsSub: string;
  adsPlaceholder: string;
  genderMale: string;
  genderFemale: string;
  genderNeutral: string;
  genderSelect: string;
  dobPlaceholder: string;
  analyticsTitle: string;
  analyticsSubtitle: string;
  analyticsActiveUsers: string;
  analyticsTotalCalc: string;
  analyticsVoiceSuccessRate: string;
}

export type AgeCategory = 'child' | 'boy' | 'teenage' | 'adult' | 'senior';
export type Gender = 'male' | 'female' | 'neutral';

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthdayDays: number;
  nextBirthdayMonths: number;
  nextBirthdayDate: Date;
  nextBirthdayWeekday: string;
  daysSinceLastBirthday: number;
  category: AgeCategory;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
