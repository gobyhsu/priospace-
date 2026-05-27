"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Search, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchModal({
  dailyTasks,
  customTags,
  onClose,
  onTaskSelect,
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Auto-focus search input
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Perform search across all dates
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const grouped = {};

    const dateKeys = Object.keys(dailyTasks || {}).sort((a, b) => {
      // Sort dates newest first
      return new Date(b) - new Date(a);
    });

    for (const dateKey of dateKeys) {
      const tasks = dailyTasks[dateKey] || [];
      const matched = tasks.filter((task) => {
        // Filter by tag
        const tagMatch =
          selectedTag === "all" || task.tag === selectedTag;
        // Filter by title keyword (case-insensitive)
        const titleMatch =
          !query || (task.title && task.title.toLowerCase().includes(query));
        return tagMatch && titleMatch;
      });

      if (matched.length > 0) {
        grouped[dateKey] = matched;
      }
    }

    setResults(
      Object.entries(grouped).map(([date, tasks]) => ({ date, tasks }))
    );
  }, [searchQuery, selectedTag, dailyTasks]);

  // Helper to get tag info
  const getTagInfo = (tagId) => {
    return customTags?.find((tag) => tag.id === tagId) || null;
  };

  // Helper to format date for display
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Highlight matching text in title
  const highlightMatch = (title, query) => {
    if (!query) return title;
    const lowerTitle = title.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerTitle.indexOf(lowerQuery);

    if (index === -1) return title;

    const before = title.slice(0, index);
    const match = title.slice(index, index + query.length);
    const after = title.slice(index + query.length);

    return (
      <>
        {before}
        <span className="bg-primary/20 text-primary font-extrabold rounded px-0.5">
          {match}
        </span>
        {after}
      </>
    );
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };

  const modalVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
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

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      drag="y"
      dragDirectionLock
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 1 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 100) {
          onClose();
        }
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={modalRef}
        variants={modalVariants}
        className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border-t border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          const modalHeight = modalRef.current?.offsetHeight || 0;
          if (info.offset.y > modalHeight / 2.5) {
            onClose();
          }
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing">
          <div
            className="w-12 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-70px)]">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  stiffness: 300,
                }}
                className="p-2.5 bg-primary/10 rounded-xl"
              >
                <Search className="h-5 w-5 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide">
                {t("search.title")}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 dark:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Search Input */}
            <motion.div variants={itemVariants} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                ref={inputRef}
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-gray-300 focus:border-primary/70 font-bold dark:border-gray-600 dark:focus:border-primary/80 dark:bg-gray-800 dark:text-gray-100 rounded-xl py-3"
              />
            </motion.div>

            {/* Tag Filter */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {t("search.filterByTag")}
              </label>
              <Select
                value={selectedTag}
                onValueChange={setSelectedTag}
              >
                <SelectTrigger className="border-2 border-gray-300 focus:border-primary/70 font-extrabold dark:border-gray-600 dark:focus:border-primary/80 dark:bg-gray-800 dark:text-gray-100 rounded-xl py-3">
                  <SelectValue placeholder={t("search.allTags")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem
                    value="all"
                    className="rounded-lg dark:hover:bg-gray-700 dark:text-gray-100"
                  >
                    <span className="font-extrabold">
                      {t("search.allTags")}
                    </span>
                  </SelectItem>
                  {customTags?.map((tag) => (
                    <SelectItem
                      key={tag.id}
                      value={tag.id}
                      className="rounded-lg dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-extrabold">{tag.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Results */}
            <motion.div variants={itemVariants} className="space-y-3">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                  <Search className="h-10 w-10 mb-3 opacity-50" />
                  <p className="text-sm font-bold">
                    {t("search.noResults")}
                  </p>
                </div>
              ) : (
                results.map(({ date, tasks }) => (
                  <div key={date} className="space-y-1.5">
                    <h3 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                      {formatDate(date)}
                    </h3>
                    <div className="space-y-1.5">
                      {tasks.map((task) => {
                        const tagInfo = getTagInfo(task.tag);
                        return (
                          <motion.button
                            key={task.id}
                            onClick={() => onTaskSelect(task)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-primary/50 dark:hover:border-primary/50 transition-all text-left"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            {/* Tag color dot + name */}
                            {tagInfo ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: tagInfo.color }}
                                />
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-[80px] truncate">
                                  {tagInfo.name}
                                </span>
                              </div>
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
                            )}

                            {/* Task title */}
                            <span
                              className={`flex-1 text-sm font-bold truncate ${
                                task.completed
                                  ? "line-through text-gray-400 dark:text-gray-500"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}
                            >
                              {highlightMatch(
                                task.title,
                                searchQuery.trim()
                              )}
                            </span>

                            {/* Due time badge */}
                            {task.dueTime && (
                              <span className="flex items-center gap-1 text-xs font-bold text-gray-400 dark:text-gray-500 shrink-0">
                                <Clock className="h-3 w-3" />
                                {task.dueTime}
                              </span>
                            )}

                            {/* Completion indicator */}
                            {task.completed && (
                              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
