import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";
import en from "../locales/en.json";
import es from "../locales/es.json";

const savedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("language") || ""
    : "";

const detectLanguage = () => {
  if (savedLanguage) return savedLanguage;
  if (typeof window === "undefined") return "zh-CN";
  const navLang = navigator.language || "";
  if (navLang.startsWith("zh")) {
    if (navLang.includes("TW") || navLang.includes("HK") || navLang.includes("Hant")) return "zh-TW";
    return "zh-CN";
  }
  if (navLang.startsWith("es")) return "es";
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    "zh-CN": { translation: zhCN },
    "zh-TW": { translation: zhTW },
    en: { translation: en },
    es: { translation: es },
  },
  lng: detectLanguage(),
  fallbackLng: "zh-CN",
  interpolation: { escapeValue: false },
});

export default i18n;
