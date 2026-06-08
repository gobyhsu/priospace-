"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, CheckCircle2, Clock, CalendarDays, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ActivityLog({ dailyTasks, customTags, onClose, embedded }) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("30");
  const [selectedTag, setSelectedTag] = useState("all");
  const [groupedData, setGroupedData] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const days = timeRange === "all" ? null : parseInt(timeRange);
    const groups = {};

    const dateKeys = Object.keys(dailyTasks || {}).sort((a, b) =>
      new Date(b) - new Date(a)
    );

    for (const dateKey of dateKeys) {
      // Apply time range filter
      if (days !== null) {
        const taskDate = new Date(dateKey + "T00:00:00");
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        cutoff.setHours(0, 0, 0, 0);
        if (taskDate < cutoff) continue;
      }

      const tasks = dailyTasks[dateKey] || [];
      const completed = tasks.filter((t) => {
        if (!t.completed) return false;
        if (selectedTag !== "all" && t.tag !== selectedTag) return false;
        return true;
      });

      if (completed.length > 0) {
        groups[dateKey] = completed;
      }
    }

    setGroupedData(
      Object.entries(groups).map(([date, tasks]) => ({ date, tasks }))
    );
  }, [dailyTasks, timeRange, selectedTag]);

  const getTagInfo = (tagId) => {
    return customTags?.find((tag) => tag.id === tagId) || null;
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });
    } catch {
      return dateStr;
    }
  };

  const formatMinutes = (minutes) => {
    if (!minutes || minutes === 0) return null;
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const totalCompleted = groupedData.reduce((s, g) => s + g.tasks.length, 0);

  const headerContent = (
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
        {t("activityLog.totalCompleted", { count: totalCompleted })}
      </p>
    </div>
  );

  const filtersContent = (
    <div className="flex gap-2 flex-wrap">
      <div className="flex gap-1.5">
        {[
          { key: "7", label: t("activityLog.last7Days") },
          { key: "30", label: t("activityLog.last30Days") },
          { key: "all", label: t("activityLog.allTime") },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setTimeRange(opt.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              timeRange === opt.key
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <Select value={selectedTag} onValueChange={setSelectedTag}>
        <SelectTrigger className="h-8 w-auto gap-1 rounded-full px-3 text-xs font-bold border-2">
          <Tag className="h-3 w-3" />
          <SelectValue placeholder={t("activityLog.allTags")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("activityLog.allTags")}</SelectItem>
          {customTags?.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const logContent = (
    <>
      {filtersContent}
      <div className="mt-3">
        {groupedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
              {t("activityLog.empty")}
            </p>
          </div>
        ) : (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {groupedData.map(({ date, tasks }) => (
              <motion.div key={date} variants={itemVariants}>
                {/* Date header */}
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-extrabold text-gray-700 dark:text-gray-300">
                    {formatDate(date)}
                  </span>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {tasks.length}
                  </span>
                </div>

                {/* Task cards */}
                <div className="space-y-1.5 ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {tasks.map((task) => {
                    const tag = getTagInfo(task.tag);
                    const time = formatMinutes(task.timeSpent || task.focusTime || 0);
                    return (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                                {task.title}
                              </span>
                              {tag && (
                                <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  <span
                                    className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                                    style={{ backgroundColor: tag.color }}
                                  />
                                  {tag.name}
                                </span>
                              )}
                            </div>
                            {time && (
                              <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-gray-400 dark:text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );

  // Embedded mode: no modal wrapper, just content
  if (embedded) {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 160px)" }}>
        {headerContent}
        {logContent}
      </div>
    );
  }

  // Standalone modal mode
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        ref={modalRef}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl border-t border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              {t("activityLog.title")}
            </h2>
            {headerContent}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="dark:text-white rounded-xl p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
          {logContent}
        </div>
      </motion.div>
    </motion.div>
  );
}
