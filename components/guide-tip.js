"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GuideTip({ storageKey, icon, title, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (storageKey && !localStorage.getItem(storageKey)) {
      setVisible(true);
    }
  }, [storageKey]);

  const dismiss = () => {
    setVisible(false);
    if (storageKey) localStorage.setItem(storageKey, "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border-2 border-primary/20 mb-4">
            <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
            <div className="flex-1">
              {title && (
                <div className="font-extrabold text-primary text-sm mb-1">
                  {title}
                </div>
              )}
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                {children}
              </div>
            </div>
            <button
              onClick={dismiss}
              className="text-xs font-bold text-primary/60 hover:text-primary px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
            >
              {typeof window !== "undefined" ? "✓" : "OK"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
