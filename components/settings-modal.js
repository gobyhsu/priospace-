"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Upload,
  Sun,
  Moon,
  Settings,
  Heart,
  ExternalLink,
  Palette,
  Check,
  Share,
  Wifi,
  Trash2,
  Edit2,
  Save,
  Tag,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { getSnapshots, restoreSnapshot, deleteSnapshot } from "@/lib/backup";
import { GuideTip } from "@/components/guide-tip";

export function SettingsModal({
  onClose,
  darkMode,
  onToggleDarkMode,
  onExportData,
  onImportData,
  theme,
  onThemeChange,
  onOpenWebRTCShare,
  customTags,
  onUpdateCustomTag,
  onDeleteCustomTag,
  onAddCustomTag,
  habits,
  onAddHabit,
  onDeleteHabit,
  onUpdateHabit,
  onResetApp,
  weatherCity,
  onSetWeatherCity,
  onOpenHelp,
}) {
  const { t } = useTranslation();
  const [editingTagId, setEditingTagId] = useState(null);
  const [weatherInput, setWeatherInput] = useState(weatherCity?.name || "");
  const [weatherSaving, setWeatherSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editHabitName, setEditHabitName] = useState("");
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTagId, setNewHabitTagId] = useState("");
  const [showDataMenu, setShowDataMenu] = useState(false);
  const modalRef = useRef(null);

  const startEditing = (tag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
  };

  const saveTag = (id) => {
    onUpdateCustomTag(id, { name: editName });
    setEditingTagId(null);
  };

  const startEditingHabit = (habit) => {
    setEditingHabitId(habit.id);
    setEditHabitName(habit.name);
  };

  const saveHabit = (id) => {
    onUpdateHabit(id, { name: editHabitName });
    setEditingHabitId(null);
  };

  const themes = [
    {
      id: "default",
      name: t('theme.default.name'),
      description: t('theme.default.desc'),
      preview: {
        primary: "#2D5A1B",
        secondary: "#6BA341",
        background: "#F7FAF5",
      },
    },
    {
      id: "nature",
      name: t('theme.nature.name'),
      description: t('theme.nature.desc'),
      preview: {
        primary: "#8B4B3C",
        secondary: "#B8906B",
        background: "#F5F1EB",
      },
    },
    {
      id: "neo-brutal",
      name: t('theme.neoBrutal.name'),
      description: t('theme.neoBrutal.desc'),
      preview: {
        primary: "#FF0000",
        secondary: "#FFFF00",
        background: "#FFFFFF",
      },
    },
    {
      id: "modern",
      name: t('theme.modern.name'),
      description: t('theme.modern.desc'),
      preview: {
        primary: "#171717",
        secondary: "#F5F5F5",
        background: "#FFFFFF",
      },
    },
    {
      id: "pastel-dream",
      name: t('theme.pastelDream.name'),
      description: t('theme.pastelDream.desc'),
      preview: {
        primary: "#D67AD2",
        secondary: "#A2DCEF",
        background: "#F8F4FF",
      },
    },
    {
      id: "quantum-rose",
      name: t('theme.quantumRose.name'),
      description: t('theme.quantumRose.desc'),
      preview: {
        primary: "#D93A7D",
        secondary: "#2DD8C6",
        background: "#FFF5FA",
      },
    },
    {
      id: "twitter",
      name: t('theme.twitter.name'),
      description: t('theme.twitter.desc'),
      preview: {
        primary: "#1DA1F2",
        secondary: "#F7F9F9",
        background: "#F5F8FA",
      },
    },
    {
      id: "amber-minimal",
      name: t('theme.amberMinimal.name'),
      description: t('theme.amberMinimal.desc'),
      preview: {
        primary: "#F59E0B",
        secondary: "#E0E7FF",
        background: "#FFFFFF",
      },
    },
  ];

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

  const handleBuyMeCoffee = () => {
    window.open("https://coff.ee/anoy", "_blank");
  };

  const handleTwitterClick = () => {
    window.open("https://x.com/Anoyroyc", "_blank");
  };

  const handleWebRTCShare = () => {
    onClose();
    onOpenWebRTCShare();
  };

  const handleSaveWeatherCity = async () => {
    setWeatherSaving(true);
    await onSetWeatherCity(weatherInput);
    setWeatherSaving(false);
  };

  const ThemePreview = ({ themeData, isSelected, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        {/* Theme Preview */}
        <div className="flex gap-1">
          <div
            className="w-4 h-8 rounded-sm"
            style={{ backgroundColor: themeData.preview.primary }}
          />
          <div
            className="w-4 h-8 rounded-sm"
            style={{ backgroundColor: themeData.preview.secondary }}
          />
          <div
            className="w-4 h-8 rounded-sm border border-gray-300"
            style={{ backgroundColor: themeData.preview.background }}
          />
        </div>

        {/* Theme Info */}
        <div className="flex-1 text-left">
          <div className="font-extrabold text-gray-900 dark:text-gray-100">
            {themeData.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {themeData.description}
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );

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
                <Settings className="h-5 w-5 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide">
                {t('settings.title')}
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

          <GuideTip storageKey="guideSettingsSeen" icon="💡" title="Quick overview">
            Customize your theme, manage tags and habits, set your weather city, and explore data backup options.
          </GuideTip>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Theme Selection */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-extrabold text-gray-900 dark:text-gray-100">
                      {t('settings.theme')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('settings.chooseStyle')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((themeData) => (
                    <motion.button
                      key={themeData.id}
                      onClick={() => onThemeChange(themeData.id)}
                      className={`relative rounded-lg border-2 p-1 transition-all duration-200 ${
                        theme === themeData.id
                          ? "border-primary scale-110"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
                      }`}
                      whileHover={{
                        scale: theme === themeData.id ? 1.1 : 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex gap-0.5">
                        <div
                          className="w-2 h-6 rounded-sm"
                          style={{ backgroundColor: themeData.preview.primary }}
                        />
                        <div
                          className="w-2 h-6 rounded-sm"
                          style={{
                            backgroundColor: themeData.preview.secondary,
                          }}
                        />
                        <div
                          className="w-2 h-6 rounded-sm border border-gray-300"
                          style={{
                            backgroundColor: themeData.preview.background,
                          }}
                        />
                      </div>
                      {theme === themeData.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                        >
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: darkMode ? 0 : 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {darkMode ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                  </motion.div>
                  <div>
                    <div className="font-extrabold text-gray-900 dark:text-gray-100">
                      {darkMode ? t('settings.darkMode') : t('settings.lightMode')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {darkMode
                        ? t('settings.switchToLight')
                        : t('settings.switchToDark')}
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onToggleDarkMode}
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-300 dark:border-gray-600 hover:border-primary/70 dark:hover:border-primary/80 rounded-xl font-extrabold w-12 h-12 p-0"
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Weather */}
            <motion.div variants={itemVariants}>
              <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 space-y-3">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-extrabold text-gray-900 dark:text-gray-100">
                      {t('settings.weather')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('settings.weatherDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => onSetWeatherCity("")}
                      variant="outline"
                      size="sm"
                      className="border-2 border-gray-300 dark:border-gray-600 hover:border-primary/70 dark:hover:border-primary/80 rounded-xl font-extrabold w-12 h-10 p-0"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <Input
                    placeholder={t('settings.weatherPlaceholder')}
                    value={weatherInput}
                    onChange={(e) => setWeatherInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveWeatherCity()}
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-bold"
                  />
                  <Button
                    onClick={handleSaveWeatherCity}
                    disabled={weatherSaving}
                    className="font-extrabold px-4"
                  >
                    {weatherSaving ? "..." : t('common.confirm')}
                  </Button>
                </div>
                {weatherCity && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t('settings.weatherCurrent', { name: weatherCity.name })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Language Selection */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-extrabold text-gray-900 dark:text-gray-100">
                      {t('settings.language')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('settings.languageDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[{ code: 'zh-CN', label: '中文' }, { code: 'zh-TW', label: '繁體' }, { code: 'en', label: 'EN' }, { code: 'es', label: 'ES' }].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem('language', lang.code); document.documentElement.lang = lang.code; }}
                      className={`px-2 py-1 text-xs font-bold rounded-lg border-2 transition-all ${
                        i18n.language === lang.code
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary/50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80"
            >
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-extrabold text-gray-900 dark:text-gray-100">
                    {t('settings.manageTags')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {t('settings.manageTagsDesc')}
                  </div>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto hide-scroll flex flex-col gap-1">
                {customTags.length === 0 ? (
                  <p className="text-sm text-gray-500 italic p-4 text-center">
                    {t('settings.noTags')}
                  </p>
                ) : (
                  customTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="color"
                          value={tag.color}
                          onChange={(e) =>
                            onUpdateCustomTag(tag.id, { color: e.target.value })
                          }
                          className="w-6 h-6 min-w-6 min-h-6 rounded-md cursor-pointer bg-transparent border-0"
                        />
                        {editingTagId === tag.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 py-0 mr-3 font-bold"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            {tag.name.length > 10
                              ? tag.name.slice(0, 10) + "..."
                              : tag.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {editingTagId === tag.id ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveTag(tag.id)}
                            className="text-green-500 h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(tag)}
                            className="text-gray-400 h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onDeleteCustomTag(tag.id);
                          }}
                          className="text-red-400 hover:text-red-500 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                {/* New tag form */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-6 h-6 min-w-6 min-h-6 rounded-md cursor-pointer bg-transparent border-0"
                  />
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder={t('settings.newTagName')}
                    className="h-8 py-0 font-bold"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTagName.trim()) {
                        onAddCustomTag(newTagName.trim(), newTagColor);
                        setNewTagName("");
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!newTagName.trim()}
                    onClick={() => {
                      onAddCustomTag(newTagName.trim(), newTagColor);
                      setNewTagName("");
                    }}
                    className="text-primary h-8 w-8 p-0 flex-shrink-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Habit Management */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-extrabold text-gray-900 dark:text-gray-100">
                    {t('settings.manageHabits')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {t('settings.manageHabitsDesc')}
                  </div>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto hide-scroll flex flex-col gap-1">
                {habits.length === 0 ? (
                  <p className="text-sm text-gray-500 italic p-4 text-center">
                    {t('settings.noHabits')}
                  </p>
                ) : (
                  habits.map((habit) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-base">🔁</span>
                        {editingHabitId === habit.id ? (
                          <Input
                            value={editHabitName}
                            onChange={(e) => setEditHabitName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveHabit(habit.id);
                            }}
                            className="h-8 py-0 mr-3 font-bold"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-gray-700 dark:text-gray-200">
                            {habit.name.length > 12
                              ? habit.name.slice(0, 12) + "..."
                              : habit.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {editingHabitId === habit.id ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveHabit(habit.id)}
                            className="text-green-500 h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingHabit(habit)}
                            className="text-gray-400 h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteHabit(habit.id)}
                          className="text-red-400 hover:text-red-500 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                {/* New habit form */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                  <Input
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder={t('settings.newHabitName')}
                    className="h-8 py-0 font-bold"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newHabitName.trim()) {
                        onAddHabit(newHabitName.trim(), newHabitTagId);
                        setNewHabitName("");
                        setNewHabitTagId("");
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!newHabitName.trim()}
                    onClick={() => {
                      onAddHabit(newHabitName.trim(), newHabitTagId);
                      setNewHabitName("");
                      setNewHabitTagId("");
                    }}
                    className="text-primary h-8 w-8 p-0 flex-shrink-0"
                  >
                    +
                  </Button>
                </div>
                {customTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => setNewHabitTagId("")}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                        newHabitTagId === ""
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 dark:border-gray-700 text-gray-500"
                      }`}
                    >
                      {t('common.noTag')}
                    </button>
                    {customTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => setNewHabitTagId(tag.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                          newHabitTagId === tag.id
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 dark:border-gray-700 text-gray-500"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-800/20">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-extrabold text-blue-700 dark:text-blue-300">
                      {t('settings.syncP2P')}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {t('settings.syncDesc')}
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleWebRTCShare}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl font-extrabold w-12 h-12 p-0"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Data Import/Export — expandable */}
            <motion.div variants={itemVariants}>
              <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 space-y-3">
                <button
                  onClick={() => setShowDataMenu(!showDataMenu)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📦</span>
                    <div className="text-left">
                      <div className="font-extrabold text-gray-900 dark:text-gray-100">
                        {t('settings.dataImportExport')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('settings.dataImportExportDesc')}
                      </div>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: showDataMenu ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl text-gray-400"
                  >
                    ›
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showDataMenu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2"
                    >
                      <button
                        onClick={onExportData}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span>📤</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('settings.exportData')}</span>
                      </button>
                      <button
                        onClick={onImportData}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span>📥</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('settings.importData')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Help Center — standalone */}
            {onOpenHelp && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📖</span>
                    <div>
                      <div className="font-extrabold text-gray-900 dark:text-gray-100">
                        {t('help.title')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('settings.helpDesc')}
                      </div>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={onOpenHelp}
                      variant="outline"
                      size="sm"
                      className="border-2 border-gray-300 dark:border-gray-600 rounded-xl font-extrabold w-12 h-12 p-0"
                    >
                      <span className="text-lg">›</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Backup & Reset */}
            <motion.div variants={itemVariants}>
              <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🗄</span>
                  <div className="font-extrabold text-gray-900 dark:text-gray-100">
                    {t('settings.backupAndReset')}
                  </div>
                </div>

                {/* Snapshots */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('settings.backupSnapshots')}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                      {t('settings.maxSnapshots')}
                    </span>
                  </div>
                  <BackupSnapshots />
                </div>

                {/* Reset */}
                <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-extrabold text-red-600 dark:text-red-400">
                          {t('settings.resetApp')}
                        </div>
                        <div className="text-sm text-red-500/70 dark:text-red-400/60 font-medium">
                          {t('settings.resetDesc')}
                        </div>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={onResetApp}
                        variant="destructive"
                        size="sm"
                        className="rounded-xl font-extrabold px-4"
                      >
                        {t('common.reset')}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* App Info */}
            <motion.div
              variants={itemVariants}
              className="pt-4 border-t-2 border-gray-200 dark:border-gray-700"
            >
              <div className="text-center space-y-3">
                <div className="text-lg font-extrabold text-primary">
                  {t('settings.version')}
                </div>
                <div className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {t('settings.tagline')}
                </div>

                <div className="pt-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium -mt-1">
                    <span className="text-lg font-extrabold text-primary">
                      Coded
                    </span>{" "}
                    with{" "}
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="text-red-500 inline-block"
                    >
                      ❤️
                    </motion.span>{" "}
                    <br />
                    by{" "}
                    <motion.button
                      onClick={handleTwitterClick}
                      className="text-primary hover:text-primary/80 font-extrabold underline underline-offset-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Anoy Roy Chowdhury
                    </motion.button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium pt-2">
                    {t('settings.localizedBy')}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BackupSnapshots() {
  const { t } = useTranslation();
  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    setSnapshots(getSnapshots());
  }, []);

  const handleRestore = (index) => {
    const data = restoreSnapshot(index);
    if (!data) return;
    if (window.confirm(t('settings.restoreConfirm'))) {
      // Re-import the snapshot data by triggering localStorage directly
      if (data.dailyTasks) localStorage.setItem("dailyTasks", JSON.stringify(data.dailyTasks));
      if (data.customTags) localStorage.setItem("customTags", JSON.stringify(data.customTags));
      if (data.habits) localStorage.setItem("habits", JSON.stringify(data.habits));
      if (typeof data.darkMode === "boolean") localStorage.setItem("darkMode", JSON.stringify(data.darkMode));
      if (data.theme) localStorage.setItem("theme", data.theme);
      window.location.reload();
    }
  };

  const handleDelete = (index) => {
    deleteSnapshot(index);
    setSnapshots(getSnapshots());
  };

  if (snapshots.length === 0) {
    return (
      <div className="text-sm text-gray-400 dark:text-gray-500 font-bold py-2">
        {t('settings.noSnapshots')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {snapshots.map((snap, i) => (
        <div key={snap.timestamp} className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-sm font-extrabold text-gray-700 dark:text-gray-200">
              {new Date(snap.timestamp).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 font-bold">
              {snap.taskCount} tasks
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleRestore(i)}
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-primary hover:bg-primary/10 rounded-lg"
            >
              {t('settings.restoreSnapshot')}
            </Button>
            <Button
              onClick={() => handleDelete(i)}
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              {t('settings.deleteSnapshot')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
