"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const helpCards = [
  { emoji: "👋", titleKey: "help.welcome", descKey: "help.welcomeDesc" },
  { emoji: "📝", titleKey: "help.tasks", descKey: "help.tasksDesc" },
  { emoji: "📅", titleKey: "help.calendar", descKey: "help.calendarDesc" },
  { emoji: "🔁", titleKey: "help.recurring", descKey: "help.recurringDesc" },
  { emoji: "⏱", titleKey: "help.timer", descKey: "help.timerDesc" },
  { emoji: "✅", titleKey: "help.habits", descKey: "help.habitsDesc" },
  { emoji: "🔍", titleKey: "help.search", descKey: "help.searchDesc" },
  { emoji: "⚙", titleKey: "help.settings", descKey: "help.settingsDesc" },
  { emoji: "🔒", titleKey: "help.data", descKey: "help.dataDesc" },
];

export function HelpModal({ onClose }) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const goTo = (index) => {
    if (index < 0 || index >= helpCards.length) return;
    setCurrent(index);
  };

  const card = helpCards[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl border-t border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
            {t('help.title')}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="dark:text-white rounded-xl p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Card content */}
        <div className="px-6 pb-6 overflow-hidden" style={{ minHeight: 280 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-center"
            >
              <div className="text-5xl mb-4">{card.emoji}</div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                {t(card.titleKey)}
              </h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                {t(card.descKey)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="dark:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {helpCards.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? "bg-primary w-4"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo(current + 1)}
            disabled={current === helpCards.length - 1}
            className="dark:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
