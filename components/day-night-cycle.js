"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from "lucide-react";
import { getWeatherIconType } from "@/utils/weather";
import { useTranslation } from "react-i18next";

const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function AnimatedWeekday({ dayIndex, fontSize, textColor }) {
  const { t } = useTranslation();
  const weekdays = weekdayKeys.map((key) => ({
    day: t(`weekday.${key}`),
    width: fontSize * 3.5,
  }));

  const height = fontSize * 1.2;

  return (
    <motion.div
      className="relative overflow-hidden inline-block"
      animate={{ width: weekdays[dayIndex].width }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        height: height,
        fontSize: fontSize,
        color: textColor,
        fontWeight: "800",
      }}
    >
      {weekdays.map((day, index) => (
        <motion.div
          key={day.day}
          className="absolute flex items-center justify-start font-extrabold"
          initial={false}
          animate={{
            y: (index - dayIndex) * height,
            opacity: index === dayIndex ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {day.day}
        </motion.div>
      ))}
    </motion.div>
  );
}

function AnimatedDigit({ value, fontSize, textColor }) {
  const animatedValue = useSpring(value, { stiffness: 300, damping: 30 });

  useEffect(() => {
    animatedValue.set(value);
  }, [animatedValue, value]);

  return (
    <div
      className="relative overflow-hidden inline-block"
      style={{
        height: fontSize * 1.2,
        width: fontSize * 0.55,
        fontSize: fontSize,
        color: textColor,
        fontWeight: "800",
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <motion.div
          key={digit}
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            y: (digit - (value % 10)) * fontSize * 1.2,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {digit}
        </motion.div>
      ))}
    </div>
  );
}

export function AnimatedNumber({ value, fontSize, textColor }) {
  const formattedValue = value.toString().padStart(2, "0");
  const digits = formattedValue.split("").map(Number);

  return (
    <div className="flex">
      {digits.map((digit, index) => (
        <AnimatedDigit
          key={`${digits.length}-${index}`}
          value={digit}
          fontSize={fontSize}
          textColor={textColor}
        />
      ))}
    </div>
  );
}

export function DayNightCycle({ selectedDate, weatherCode, temperature }) {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const dayIndex = selectedDate.getDay();

  const getWeatherIcon = () => {
    if (weatherCode === undefined || weatherCode === null) {
      return isDay ? (
        <Sun className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
      ) : (
        <Moon className="h-8 w-8 text-blue-500 fill-blue-500/20" />
      );
    }
    const type = getWeatherIconType(weatherCode);
    const iconClass = "h-8 w-8";
    switch (type) {
      case "clear":
        return isDay ? (
          <Sun className={`${iconClass} text-yellow-500 fill-yellow-500/20`} />
        ) : (
          <Moon className={`${iconClass} text-blue-500 fill-blue-500/20`} />
        );
      case "partly-cloudy":
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case "fog":
        return <CloudFog className={`${iconClass} text-gray-400`} />;
      case "drizzle":
        return <CloudDrizzle className={`${iconClass} text-blue-400`} />;
      case "rain":
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case "snow":
        return <CloudSnow className={`${iconClass} text-blue-200`} />;
      case "thunderstorm":
        return <CloudLightning className={`${iconClass} text-yellow-500`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-400`} />;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="text-4xl font-extrabold flex items-center">
          <AnimatedWeekday dayIndex={dayIndex} fontSize={32} />
        </div>

        <AnimatePresence mode="wait">
          {getWeatherIcon() && (
            <motion.div
              key={weatherCode ?? (isDay ? "sun" : "moon")}
              initial={{ y: 20, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 45 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex items-center justify-center"
            >
              {getWeatherIcon()}
              {temperature !== undefined && temperature !== null && (
                <span className="text-sm font-bold ml-1 text-gray-500 dark:text-gray-400">
                  {Math.round(temperature)}°
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
