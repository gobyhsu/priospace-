"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RotateCcw,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function HabitTracker({
  habits,
  customTags,
  onClose,
  onUpdateHabits,
  onAddCustomTag,
}) {
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [currentHabitIndex, setCurrentHabitIndex] = useState(-1); // -1 for overview, 0+ for individual habits
  const [showNavigation, setShowNavigation] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const modalRef = useRef(null);

  // Generate past 30 days (exactly 30 for 6x5 grid)
  const generatePastDays = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const pastDays = generatePastDays();

  const getDailyHabitCount = (date) => {
    return habits.reduce((count, habit) => {
      return count + (habit.completedDates.includes(date) ? 1 : 0);
    }, 0);
  };

  const generateMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      days.push(`${yyyy}-${mm}-${dd}`);
    }
    return days;
  };

  const currentMonthDays = generateMonthDays(viewDate);
  const monthName = viewDate.toLocaleDateString("zh-CN", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + offset)));
  };

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        completedDates: [],
        tag: selectedTag || undefined,
      };
      onUpdateHabits([...habits, newHabit]);
      setNewHabitName("");
      setSelectedTag("");
      setShowAddForm(false);
      setShowNavigation(true);
      setCurrentHabitIndex(habits.length); // Switch to the new habit
    }
  };

  const addTag = () => {
    if (newTagName.trim()) {
      const newTagId = onAddCustomTag(newTagName.trim(), selectedColor);
      setSelectedTag(newTagId);
      setNewTagName("");
      setShowAddTag(false);
    }
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    onUpdateHabits(updatedHabits);
    if (currentHabitIndex >= updatedHabits.length) {
      setCurrentHabitIndex(Math.max(-1, updatedHabits.length - 1));
    }
  };

  const toggleHabitDay = (habitId, date) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter((d) => d !== date)
          : [...habit.completedDates, date];
        return { ...habit, completedDates };
      }
      return habit;
    });
    onUpdateHabits(updatedHabits);
  };

  const getIntensity = (habit, date) => {
    return habit.completedDates.includes(date) ? 1 : 0;
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return "bg-gray-100 dark:bg-gray-800";
    return "bg-green-500";
  };

  const nextHabit = () => {
    if (habits.length === 0) return;

    if (currentHabitIndex === -1) {
      // From overview, go to first habit
      setCurrentHabitIndex(0);
    } else if (currentHabitIndex === habits.length - 1) {
      // From last habit, go back to overview
      setCurrentHabitIndex(-1);
    } else {
      // Go to next habit
      setCurrentHabitIndex(currentHabitIndex + 1);
    }
  };

  const prevHabit = () => {
    if (habits.length === 0) return;

    if (currentHabitIndex === -1) {
      // From overview, go to last habit
      setCurrentHabitIndex(habits.length - 1);
    } else if (currentHabitIndex === 0) {
      // From first habit, go back to overview
      setCurrentHabitIndex(-1);
    } else {
      // Go to previous habit
      setCurrentHabitIndex(currentHabitIndex - 1);
    }
  };

  const currentHabit =
    currentHabitIndex >= 0 ? habits[currentHabitIndex] : null;
  const currentHabitTag = customTags.find(
    (tag) => tag.id === currentHabit?.tag
  );

  // Calculate total habits completed in the past 30 days
  const totalCompletions = pastDays.reduce(
    (total, date) => total + getDailyHabitCount(date),
    0
  );

  const fullTotalCompletions = habits.reduce(
    (acc, habit) => acc + (habit.completedDates?.length || 0),
    0
  );

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
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
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

  const formVariants = {
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
                <RotateCcw className="h-5 w-5 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide">
                习惯追踪
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
            className="space-y-6"
          >
            {/* Add Habit Form */}
            <AnimatePresence>
              {showAddForm ? (
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 rounded-xl"
                >
                  <motion.div variants={itemVariants}>
                    <Input
                      placeholder="你想养成什么习惯？"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !showAddTag && addHabit()
                      }
                      autoFocus
                      className="border-0 bg-transparent md:text-2xl h-10 font-extrabold px-0 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </motion.div>

                  {/* Tag Selection */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="border-2 border-gray-300 focus:border-primary/70 font-extrabold dark:border-gray-600 dark:focus:border-primary/80 dark:bg-gray-800 dark:text-gray-100 rounded-xl py-3">
                        <SelectValue placeholder="选择分类（可选）" />
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
                        {showAddTag ? "取消" : "新建分类"}
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Add New Tag Form */}
                  <AnimatePresence>
                    {showAddTag && (
                      <motion.div
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-4 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"
                      >
                        <Input
                          placeholder="分类名称"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addTag()}
                          className="border-2 border-gray-300 font-extrabold focus:border-primary/70 dark:border-gray-600 dark:focus:border-primary/80 dark:text-gray-100 rounded-xl bg-white dark:bg-gray-700 py-3"
                        />

                        <div className="space-y-3">
                          <label className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                            选择颜色
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
                                className={`w-10 h-10 rounded-full border-3 transition-all duration-200 relative overflow-hidden ${
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
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            onClick={addTag}
                            className="w-full rounded-xl font-extrabold py-3"
                            disabled={!newTagName.trim()}
                          >
                            创建分类
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        onClick={addHabit}
                        className="w-full rounded-xl font-extrabold py-4 text-lg shadow-lg"
                        disabled={!newHabitName.trim()}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        添加习惯
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewHabitName("");
                          setSelectedTag("");
                          setShowAddTag(false);
                          setNewTagName("");
                          setShowNavigation(true);
                        }}
                        className="px-6 py-4 rounded-xl font-extrabold border-2 border-gray-300 hover:border-primary/70 dark:border-gray-600 dark:hover:border-primary/80 dark:text-gray-100"
                      >
                        取消
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {currentHabitIndex === -1 && (
                    <Button
                      onClick={() => {
                        setShowAddForm(true);
                        setShowNavigation(false);
                      }}
                      variant="outline"
                      className="w-full border-2 border-gray-300 font-extrabold hover:border-primary/70 dark:border-gray-600 dark:hover:border-primary/80 dark:text-gray-100 rounded-xl py-4"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      添加新习惯
                    </Button>
                  )}
                  {currentHabitIndex !== -1 && (
                    <Button
                      onClick={() => {
                        deleteHabit(currentHabit.id);
                      }}
                      variant="outline"
                      className="w-full border-2 border-gray-300 font-extrabold hover:border-primary/70 dark:border-gray-600 dark:hover:border-primary/80 dark:text-gray-100 rounded-xl py-4"
                    >
                      <Trash2 className="mr-2" />
                      删除习惯
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Habit Navigation */}
            {showNavigation && habits.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Habit Tabs */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevHabit}
                      disabled={habits.length === 0}
                      className="p-2 rounded-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </motion.div>

                  <div className="flex-1 text-center">
                    {currentHabitIndex === -1 ? (
                      <>
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <h3 className="font-extrabold text-gray-900 dark:text-gray-100">
                            所有习惯概览
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                          {fullTotalCompletions} 次总完成 ·{" "}
                          {habits.length} 个习惯
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-extrabold text-gray-900 dark:text-gray-100 truncate px-2">
                          {currentHabit?.name}
                        </h3>
                        {currentHabitTag && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: currentHabitTag.color }}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {currentHabitTag.name}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextHabit}
                      disabled={habits.length === 0}
                      className="p-2 rounded-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>

                {/* Habit Dots Indicator */}
                <div className="flex justify-center gap-1.5 mt-4">
                  <button
                    onClick={() => setCurrentHabitIndex(-1)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentHabitIndex === -1
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-primary/20"
                    }`}
                  />
                  {habits.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentHabitIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        currentHabitIndex === i
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-primary/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Current View Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentHabitIndex}-${viewDate.getMonth()}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-4 p-5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border-2 border-gray-200 dark:border-gray-700 h-[240px]"
                  >
                    {/* Month Navigation Header */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeMonth(-1)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <span className="text-sm font-extrabold text-primary uppercase tracking-widest">
                        {monthName}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeMonth(1)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* The Grid */}
                    <div className="flex flex-wrap justify-center gap-2 max-w-[280px] mx-auto">
                      {currentMonthDays.map((date) => {
                        const count = getDailyHabitCount(date);
                        const isIndividualCompleted =
                          currentHabitIndex !== -1 &&
                          habits[currentHabitIndex].completedDates.includes(
                            date
                          );

                        return (
                          <motion.button
                            key={date}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              currentHabitIndex !== -1 &&
                              toggleHabitDay(habits[currentHabitIndex].id, date)
                            }
                            className={`w-5 h-5 rounded-md transition-all duration-200 border border-black/5 dark:border-white/5 ${
                              currentHabitIndex === -1
                                ? count === 0
                                  ? "bg-primary/5"
                                  : count === 1
                                  ? "bg-primary/30"
                                  : count === 2
                                  ? "bg-primary/50"
                                  : count === 3
                                  ? "bg-primary/70"
                                  : "bg-primary"
                                : isIndividualCompleted
                                ? "bg-primary"
                                : "bg-primary/10"
                            }`}
                            title={`${date}: ${count} completions`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-center mt-auto">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {currentHabitIndex === -1
                          ? `${currentMonthDays.reduce(
                              (acc, d) => acc + getDailyHabitCount(d),
                              0
                            )} 次总完成`
                          : `${
                              habits[currentHabitIndex].completedDates.filter(
                                (d) => currentMonthDays.includes(d)
                              ).length
                            } 天已达成`}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {habits.length === 0 && !showAddForm && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                >
                  <RotateCcw className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="font-extrabold text-lg">还没有习惯</p>
                  <p className="text-sm mt-1">
                    添加一个开始追踪你的进展！
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Legend */}
            <motion.div
              variants={itemVariants}
              className="pt-4 border-t-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>少</span>
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-md bg-primary/10"></div>
                  <div className="w-4 h-4 rounded-md bg-primary/30"></div>
                  <div className="w-4 h-4 rounded-md bg-primary/50"></div>
                  <div className="w-4 h-4 rounded-md bg-primary/70"></div>
                  <div className="w-4 h-4 rounded-md bg-primary/85"></div>
                  <div className="w-4 h-4 rounded-md bg-primary"></div>
                </div>
                <span>多</span>
              </div>
              <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
                {currentHabitIndex === -1
                  ? "每日习惯完成 (1-5+)"
                  : "单个习惯完成"}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
