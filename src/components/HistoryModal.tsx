import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Trash2, History, ArrowRight, User } from 'lucide-react';
import { HistoryItem, LanguageCode } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
  lang: LanguageCode;
}

export default function HistoryModal({
  isOpen,
  onClose,
  historyList,
  onSelectHistory,
  onDeleteHistory,
  onClearHistory,
  lang,
}: HistoryModalProps) {
  
  // Localized texts inside modal
  const getModalTexts = () => {
    switch (lang) {
      case 'es':
        return {
          title: 'Historial de Cálculos',
          empty: 'No hay reportes guardados aún.',
          emptySub: 'Realiza un cálculo para verlo aquí.',
          clearAll: 'Borrar Todo',
          load: 'Cargar Reporte',
          weeks: 'semanas',
          days: 'días',
          years: 'años',
          months: 'meses',
          born: 'Fecha:',
          time: 'Hora:',
          gender: 'Género:',
        };
      case 'bn':
        return {
          title: 'হিসাবের ইতিহাস',
          empty: 'এখনো কোনো রেকর্ড সংরক্ষিত নেই।',
          emptySub: 'ইতিহাসে যোগ করতে একটি বয়স হিসাব করুন।',
          clearAll: 'সব মুছে ফেলুন',
          load: 'রিপোর্ট লোড করুন',
          weeks: 'সপ্তাহ',
          days: 'দিন',
          years: 'বছর',
          months: 'মাস',
          born: 'জন্মদিন:',
          time: 'সময়:',
          gender: 'লিঙ্গ:',
        };
      default:
        return {
          title: 'Calculation History',
          empty: 'No saved reports yet.',
          emptySub: 'Run a calculation to save the report here automatically.',
          clearAll: 'Clear All',
          load: 'Load Report',
          weeks: 'weeks',
          days: 'days',
          years: 'years',
          months: 'months',
          born: 'Born:',
          time: 'Time:',
          gender: 'Gender:',
        };
    }
  };

  const texts = getModalTexts();

  // Helper to format gender strings
  const formatGender = (g: string) => {
    if (g === 'male') return lang === 'es' ? 'Masculino' : lang === 'bn' ? 'পুরুষ' : 'Male';
    if (g === 'female') return lang === 'es' ? 'Femenino' : lang === 'bn' ? 'নারী' : 'Female';
    return lang === 'es' ? 'Neutro' : lang === 'bn' ? 'অন্যান্য' : 'Neutral';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-2xl z-10 flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <History className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  {texts.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable history items list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {historyList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3.5">
                    <History className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">
                    {texts.empty}
                  </h3>
                  <p className="text-[11px] text-slate-400 max-w-[240px] mt-1 font-sans">
                    {texts.emptySub}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <AnimatePresence initial={false}>
                    {historyList.map((item, index) => {
                      const dateObj = new Date(item.dob);
                      const formattedDate = !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString(lang, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : item.dob;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.04 }}
                          whileHover={{ scale: 1.015, y: -2 }}
                          className="group relative flex flex-col p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all text-left"
                        >
                          {/* Inner info grid */}
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="space-y-1">
                              {/* Display summary of age */}
                              <div className="flex items-baseline gap-1">
                                <span className="text-base font-black text-slate-900 font-display">
                                  {item.result.years}
                                </span>
                                <span className="text-[10px] text-slate-500 font-semibold mr-1.5">
                                  {texts.years}
                                </span>
                                <span className="text-base font-black text-slate-900 font-display">
                                  {item.result.months}
                                </span>
                                <span className="text-[10px] text-slate-500 font-semibold mr-1.5">
                                  {texts.months}
                                </span>
                                <span className="text-base font-black text-slate-900 font-display">
                                  {item.result.days}
                                </span>
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  {texts.days}
                                </span>
                              </div>

                              {/* Input details row */}
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 font-mono">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  <span>{formattedDate}</span>
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.birthTime}</span>
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span>{formatGender(item.gender)}</span>
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onSelectHistory(item)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                              >
                                <span>{texts.load}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteHistory(item.id)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete from history"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {historyList.length > 0 && (
              <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end">
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{texts.clearAll}</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
