"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Plus, Trash2, Calendar, Repeat, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuideTip } from "@/components/guide-tip";

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#a85520", // brown
  "#6366f1", // indigo
];

const WEEKDAYS = [
  { key: 1, short: "Mon" },
  { key: 2, short: "Tue" },
  { key: 3, short: "Wed" },
  { key: 4, short: "Thu" },
  { key: 5, short: "Fri" },
  { key: 6, short: "Sat" },
  { key: 0, short: "Sun" },
];

export function RecurringTasksModal({
  recurringTasks,
  customTags,
  onClose,
  onAddRecurringTask,
  onDeleteRecurringTask,
  onAddCustomTag,
}) {
  const { t } = useTranslation();
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [recurrenceType, setRecurrenceType] = useState("daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const monthlyGridRef = useRef(null);
  const modalRef = useRef(null);

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;

    const recurrence = {
      type: recurrenceType,
      days: recurrenceType === "daily" ? [] : selectedDays,
    };

    onAddRecurringTask({
      id: Date.now().toString(),
      title: taskTitle.trim(),
      tag: selectedTag || undefined,
      priority: "medium",
      description: "",
      dueTime: "",
      recurrence,
    });

    // Reset form
    setTaskTitle("");
    setSelectedTag("");
    setRecurrenceType("daily");
    setSelectedDays([]);
  };

  const handleDelete = (id) => {
    if (deleteConfirmId === id) {
      onDeleteRecurringTask(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTagId = onAddCustomTag(newTagName.trim(), selectedColor);
      setSelectedTag(newTagId);
      setNewTagName("");
      setShowAddTag(false);
    }
  };

  const toggleWeekDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleMonthDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getRecurrenceBadge = (recurrence) => {
    if (!recurrence) return "";
    switch (recurrence.type) {
      case "daily":
        return t("recurring.daily");
      case "weekly": {
        const dayNames = (recurrence.days || [])
          .map((d) => WEEKDAYS.find((w) => w.key === d)?.short || "")
          .filter(Boolean);
        return `${t("recurring.weekly")} (${dayNames.join(", ")})`;
      }
      case "monthly": {
        const days = (recurrence.days || []).sort((a, b) => a - b);
        return `${t("recurring.monthly")} (${days.join(", ")})`;
      }
      default:
        return recurrence.type;
    }
  };

  const getTagColor = (tagId) => {
    const tag = customTags.find((t) => t.id === tagId);
    return tag?.color;
  };

  const getTagName = (tagId) => {
    const tag = customTags.find((t) => t.id === tagId);
    return tag?.name;
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

  const tagFormVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const colorButtonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.1 },
    },
    tap: { scale: 0.95 },
  };

  const taskItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={modalRef}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          const modalHeight = modalRef.current?.offsetHeight || 0;
          if (info.offset.y > modalHeight / 2.5) {
            onClose();
          }
        }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border-t border-gray-200 dark:border-gray-700 relative touch-none"
        onClick={(e) => e.stopPropagation()}
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
            className="flex items-center justify-between mb-6"
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
                <Repeat className="h-5 w-5 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide">
                {t("recurring.title")}
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

          <GuideTip storageKey="guideRecurringSeen" icon="💡" title="Recurring tasks">
            Create templates for tasks that repeat daily, weekly, or monthly. They auto-generate on each date!
          </GuideTip>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Existing Recurring Tasks List */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("recurring.title")}
              </label>

              {recurringTasks.length === 0 ? (
                <div className="p-6 bg-gray-50 dark:bg-gray-800/80 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center">
                  <Repeat className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {t("recurring.noRecurringTasks")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {recurringTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        variants={taskItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-extrabold text-gray-900 dark:text-gray-100 truncate">
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-md bg-primary/10 text-primary">
                              <Repeat className="h-3 w-3" />
                              {getRecurrenceBadge(task.recurrence)}
                            </span>
                            {task.tag && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    backgroundColor: getTagColor(task.tag),
                                  }}
                                />
                                {getTagName(task.tag)}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleDelete(task.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            deleteConfirmId === task.id
                              ? "bg-red-500 text-white"
                              : "hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700" />

            {/* Add New Recurring Task Form */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("recurring.addNew")}
              </label>
              <Input
                placeholder={t("recurring.titlePlaceholder")}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !showAddTag && handleSubmit()
                }
                autoFocus
                className="border-0 bg-transparent md:text-2xl h-10 font-extrabold px-0 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </motion.div>

            {/* Category Selection */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {t("recurring.category")}
              </label>

              <Select
                value={selectedTag || undefined}
                onValueChange={setSelectedTag}
              >
                <SelectTrigger className="border-2 border-gray-300 focus:border-primary/70 font-extrabold dark:border-gray-600 dark:focus:border-primary/80 dark:bg-gray-800 dark:text-gray-100 rounded-xl py-3">
                  <SelectValue placeholder={t("recurring.selectCategory")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  {customTags.map((tag) => (
                    <SelectItem
                      key={tag.id}
                      value={tag.id}
                      className="rounded-lg dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                          whileHover={{ scale: 1.2 }}
                        />
                        <span className="font-extrabold">{tag.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowAddTag(!showAddTag)}
                  className="w-full border-2 border-gray-300 font-extrabold hover:border-primary/70 dark:border-gray-600 dark:hover:border-primary/80 dark:text-gray-100 rounded-xl py-3"
                >
                  <motion.div
                    animate={{ rotate: showAddTag ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.div>
                  {showAddTag ? t("common.cancel") : t("recurring.newCategory")}
                </Button>
              </motion.div>
            </motion.div>

            {/* Add New Category Form */}
            <AnimatePresence>
              {showAddTag && (
                <motion.div
                  variants={tagFormVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 p-5 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/80"
                >
                  <motion.div variants={itemVariants}>
                    <Input
                      placeholder={t("recurring.categoryPlaceholder")}
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                      className="border-2 border-gray-300 font-extrabold focus:border-primary/70 dark:border-gray-600 dark:focus:border-primary/80 dark:text-gray-100 rounded-xl bg-white dark:bg-gray-700 py-3"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-4">
                    <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      {t("recurring.chooseColor")}
                    </label>
                    <motion.div
                      className="flex gap-3 flex-wrap justify-center"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.04,
                          },
                        },
                      }}
                    >
                      {PRESET_COLORS.map((color, index) => (
                        <motion.button
                          key={color}
                          variants={colorButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setSelectedColor(color)}
                          className={`w-11 h-11 rounded-full border-3 transition-all duration-200 relative overflow-hidden ${
                            selectedColor === color
                              ? "border-gray-900 dark:border-gray-100 shadow-lg ring-2 ring-primary/50"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color }}
                          custom={index}
                        >
                          {selectedColor === color && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full rounded-full flex items-center justify-center bg-black/20 dark:bg-white/20 backdrop-blur-sm"
                            >
                              <Check className="h-4 w-4 text-white drop-shadow-sm" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        onClick={handleAddTag}
                        className="w-full rounded-xl font-extrabold py-3"
                        disabled={!newTagName.trim()}
                      >
                        {t("recurring.createCategory")}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recurrence Type Selection */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                {t("recurring.recurrence")}
              </label>
              <div className="flex gap-2">
                {[
                  { key: "daily", label: t("recurring.daily") },
                  { key: "weekly", label: t("recurring.weekly") },
                  { key: "monthly", label: t("recurring.monthly") },
                ].map((type) => (
                  <motion.button
                    key={type.key}
                    onClick={() => {
                      setRecurrenceType(type.key);
                      setSelectedDays([]);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-bold rounded-xl border-2 transition-all ${
                      recurrenceType === type.key
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Day Picker - Weekly */}
            <AnimatePresence>
              {recurrenceType === "weekly" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    {t("recurring.selectDays")}
                  </label>
                  <div className="flex gap-2">
                    {WEEKDAYS.map((day) => (
                      <motion.button
                        key={day.key}
                        onClick={() => toggleWeekDay(day.key)}
                        className={`flex-1 flex items-center justify-center py-3 text-sm font-bold rounded-xl border-2 transition-all ${
                          selectedDays.includes(day.key)
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {day.short}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Day Picker - Monthly */}
            <AnimatePresence>
              {recurrenceType === "monthly" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    {t("recurring.selectDays")}
                  </label>
                  <div
                    ref={monthlyGridRef}
                    className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto p-1"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <motion.button
                        key={day}
                        onClick={() => toggleMonthDay(day)}
                        className={`flex items-center justify-center py-2 text-sm font-bold rounded-lg border-2 transition-all ${
                          selectedDays.includes(day)
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                        }`}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        {day}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex gap-3 pt-4">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="w-full rounded-xl font-extrabold text-lg py-6 shadow-lg"
                  disabled={
                    !taskTitle.trim() ||
                    (recurrenceType !== "daily" && selectedDays.length === 0)
                  }
                >
                  <motion.div
                    animate={
                      taskTitle.trim() &&
                      (recurrenceType === "daily" || selectedDays.length > 0)
                        ? { scale: [1, 1.05, 1] }
                        : {}
                    }
                    transition={{
                      duration: 0.4,
                      repeat:
                        taskTitle.trim() &&
                        (recurrenceType === "daily" || selectedDays.length > 0)
                          ? Infinity
                          : 0,
                      repeatDelay: 2,
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    {t("recurring.addNew")}
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-6 rounded-xl font-bold border-2 border-gray-300 hover:border-primary/70 dark:border-gray-600 dark:hover:border-primary/80 dark:text-gray-100"
                >
                  {t("common.close")}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
