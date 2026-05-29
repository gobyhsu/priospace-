"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "guideCompleted";

export function GuideOverlay({ onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState(null);
  const overlayRef = useRef(null);

  const steps = [
    { selector: ".settings-btn, [data-guide='settings']", tip: t('guide.step1') },
    { selector: "[data-guide='add-task']", tip: t('guide.step2') },
    { selector: "[data-guide='calendar']", tip: t('guide.step3') },
    { selector: "[data-guide='timer']", tip: t('guide.step4') },
    { selector: "[data-guide='habits']", tip: t('guide.habits') },
    { selector: "[data-guide='search']", tip: t('guide.step6') },
    { selector: "[data-guide='statistics']", tip: t('guide.step7') },
  ];

  useEffect(() => {
    if (step >= steps.length) {
      localStorage.setItem(STORAGE_KEY, "true");
      onComplete();
      return;
    }
    measureSpotlight();
  }, [step]);

  const measureSpotlight = () => {
    if (step >= steps.length) return;
    const selector = steps[step].selector;
    const el = document.querySelector(selector);
    if (!el) {
      // Skip step if element not found
      setStep((s) => s + 1);
      return;
    }
    const rect = el.getBoundingClientRect();
    setSpotlight({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    });
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    onComplete();
  };

  if (step >= steps.length) return null;

  const isWelcome = step === 0;
  const tipText = steps[step]?.tip || "";
  const isBelow = spotlight && spotlight.centerY < window.innerHeight / 2;

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200]"
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Spotlight cutout */}
      {spotlight && (
        <motion.div
          initial={{
            top: spotlight.top - 8,
            left: spotlight.left - 8,
            width: spotlight.width + 16,
            height: spotlight.height + 16,
          }}
          animate={{
            top: spotlight.top - 8,
            left: spotlight.left - 8,
            width: spotlight.width + 16,
            height: spotlight.height + 16,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute rounded-2xl border-2 border-white/30 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* Welcome screen (step 0) */}
      {isWelcome && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/75">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center px-8 max-w-sm"
          >
            <img src="/logo.png" alt="PrioSpace" className="w-24 h-24 rounded-2xl mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-2 tracking-wide">
              {t('guide.welcomeTitle')}
            </h2>
            <p className="text-base font-bold text-white/85 mb-1">
              {t('guide.welcomeSubtitle')}
            </p>
            <p className="text-sm font-semibold text-white/55">
              {t('guide.welcomeTagline')}
            </p>
          </motion.div>
          <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center gap-3">
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-3 bg-primary text-white rounded-full font-bold text-base shadow-lg"
            >
              {t('guide.welcomeStart')}
            </motion.button>
            <button
              onClick={handleSkip}
              className="text-white/50 font-semibold text-sm hover:text-white/80 transition-colors"
            >
              {t('guide.skip')}
            </button>
          </div>
        </div>
      )}

      {/* Step tip bubble */}
      {!isWelcome && spotlight && (
        <motion.div
          initial={{ opacity: 0, y: isBelow ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-[300px]"
          style={{
            left: Math.max(16, Math.min(spotlight.centerX - 150, window.innerWidth - 316)),
            top: isBelow
              ? spotlight.top + spotlight.height + 20
              : Math.max(16, spotlight.top - 120),
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {tipText}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">
                {step}/{steps.length - 1}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {t('guide.skip')}
                </button>
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold"
                >
                  {step === steps.length - 1 ? t('guide.start') : t('guide.next')}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function isGuideCompleted() {
  if (typeof window === "undefined") return true;
  return !!localStorage.getItem(STORAGE_KEY);
}
