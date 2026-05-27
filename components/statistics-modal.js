"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, BarChart3, Clock, Flame, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getCompletionStats,
  getFocusTimeByDay,
  getFocusTimeByTag,
  calculateStreak,
  formatMinutes,
} from "@/lib/statistics";
import html2canvas from "html2canvas";

const CHART_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#8b5cf6"];

export function StatisticsModal({ dailyTasks, customTags, habits, onClose }) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState(30);
  const contentRef = useRef(null);
  const modalRef = useRef(null);

  const days = timeRange;
  const completionData = getCompletionStats(dailyTasks, days);
  const focusData = getFocusTimeByDay(dailyTasks, days);
  const tagData = getFocusTimeByTag(dailyTasks, customTags);

  // Aggregate stats
  const totalCompleted = completionData.reduce((s, d) => s + d.completed, 0);
  const totalTasks = completionData.reduce((s, d) => s + d.total, 0);
  const completionRate =
    totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const totalFocusMinutes = focusData.reduce((s, d) => s + d.focusTime, 0);

  // Short date label for chart x-axis
  const shortDate = (dateStr) => {
    const parts = dateStr.split("-");
    return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
  };

  // Prepare chart data
  const barChartData = completionData.map((d) => ({
    name: shortDate(d.date),
    completed: d.completed,
    total: d.total,
  }));

  const lineChartData = focusData.map((d) => ({
    name: shortDate(d.date),
    focusTime: d.focusTime,
  }));

  // Export as image
  const handleExportImage = async () => {
    if (!contentRef.current) return;
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `priospace-statistics-${days}d.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-xs">
          <p className="font-bold text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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

        <div
          ref={contentRef}
          className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-70px)]"
        >
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
                <BarChart3 className="h-5 w-5 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide">
                {t("statistics.title")}
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
            {/* Time Range Selector */}
            <motion.div variants={itemVariants} className="flex gap-2">
              {[
                { value: 7, label: t("statistics.weekly") },
                { value: 30, label: t("statistics.monthly") },
                { value: 90, label: t("statistics.quarterly") },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setTimeRange(option.value)}
                  className={`flex-1 px-3 py-2.5 text-sm font-bold rounded-xl border-2 transition-all duration-200 ${
                    timeRange === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-300 text-gray-500 hover:border-primary/50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Completion Rate */}
            <motion.div
              variants={itemVariants}
              className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  {t("statistics.completionRate")}
                </h3>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                  {completionRate}%
                </span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                  {totalCompleted} / {totalTasks} {t("statistics.days")}
                </span>
              </div>
            </motion.div>

            {/* Total Focus Time */}
            <motion.div
              variants={itemVariants}
              className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  {t("statistics.totalFocusTime")}
                </h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                  {formatMinutes(totalFocusMinutes)}
                </span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                  {days} {t("statistics.days")}
                </span>
              </div>
            </motion.div>

            {/* Daily Completions Bar Chart */}
            {barChartData.some((d) => d.total > 0) && (
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
              >
                <h3 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-4">
                  {t("statistics.dailyCompletions")}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(156,163,175,0.15)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                        interval={Math.max(0, Math.floor(barChartData.length / 7) - 1)}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                        width={24}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="completed"
                        name={t("statistics.completed")}
                        fill={CHART_COLORS[0]}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Daily Focus Time Line Chart */}
            {focusData.some((d) => d.focusTime > 0) && (
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
              >
                <h3 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-4">
                  {t("statistics.totalFocusTime")}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(156,163,175,0.15)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                        interval={Math.max(0, Math.floor(lineChartData.length / 7) - 1)}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                        width={32}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="focusTime"
                        name="min"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        dot={{ r: 3, fill: CHART_COLORS[1] }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Focus Time by Tag Pie Chart */}
            {tagData.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
              >
                <h3 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-4">
                  {t("statistics.focusByTag")}
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tagData}
                        dataKey="focusTime"
                        nameKey="tagName"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        paddingAngle={3}
                        label={({ tagName, percent }) =>
                          `${tagName} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {tagData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.tagColor || CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Tag legend */}
                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                  {tagData.map((tag, index) => (
                    <div key={tag.tag} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            tag.tagColor || CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {tag.tagName} ({formatMinutes(tag.focusTime)})
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Habit Streaks */}
            {habits && habits.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                    {t("statistics.habitStreaks")}
                  </h3>
                </div>
                <div className="space-y-2">
                  {habits.map((habit) => {
                    const streak = calculateStreak(habit.completedDates);
                    return (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Flame className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 dark:text-gray-100 text-sm">
                              {habit.name}
                            </p>
                            {habit.tag && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      customTags.find((t) => t.id === habit.tag)?.color ||
                                      "#888",
                                  }}
                                />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                  {customTags.find((t) => t.id === habit.tag)?.name || ""}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-4 text-center">
                          <div>
                            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                              {streak.current}
                            </p>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                              {t("statistics.currentStreak")}
                            </p>
                          </div>
                          <div className="w-px bg-gray-200 dark:bg-gray-700" />
                          <div>
                            <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                              {streak.best}
                            </p>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                              {t("statistics.bestStreak")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* No Data Message */}
            {totalTasks === 0 && totalFocusMinutes === 0 && (!habits || habits.length === 0) && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="font-extrabold text-lg">{t("statistics.noData")}</p>
                </div>
              </motion.div>
            )}

            {/* Export as Image */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleExportImage}
                  className="w-full rounded-xl font-extrabold py-4 text-lg shadow-lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  {t("statistics.exportImage")}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
