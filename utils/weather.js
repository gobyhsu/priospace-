const WEATHER_CACHE_KEY = "weatherCache";
const WEATHER_CITY_KEY = "weatherCity";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function geocodeCity(cityName) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh`
  );
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    return null;
  }
  const result = data.results[0];
  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export async function fetchWeather(latitude, longitude) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m`
  );
  const data = await res.json();
  return {
    code: data.current.weather_code,
    temperature: data.current.temperature_2m,
  };
}

export function getCachedWeather() {
  const cached = localStorage.getItem(WEATHER_CACHE_KEY);
  if (!cached) return null;
  const parsed = JSON.parse(cached);
  if (Date.now() - parsed.timestamp > CACHE_DURATION) return null;
  return parsed;
}

export function setCachedWeather(data) {
  localStorage.setItem(
    WEATHER_CACHE_KEY,
    JSON.stringify({ ...data, timestamp: Date.now() })
  );
}

export function getSavedCity() {
  const city = localStorage.getItem(WEATHER_CITY_KEY);
  return city ? JSON.parse(city) : null;
}

export function saveCity(city) {
  localStorage.setItem(WEATHER_CITY_KEY, JSON.stringify(city));
}

// Map WMO weather codes to icon types
export function getWeatherIconType(code) {
  if (code === 0) return "clear";
  if (code <= 3) return "partly-cloudy";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "rain";
  if (code <= 86) return "snow";
  if (code <= 99) return "thunderstorm";
  return "clear";
}

export function getWeatherLabel(code) {
  const labels = {
    0: "晴",
    1: "大部晴",
    2: "多云",
    3: "阴",
    45: "雾",
    48: "雾凇",
    51: "小毛毛雨",
    53: "毛毛雨",
    55: "大毛毛雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "冻雨",
    67: "大冻雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "冰粒",
    80: "小阵雨",
    81: "中阵雨",
    82: "大阵雨",
    85: "小阵雪",
    86: "大阵雪",
    95: "雷阵雨",
    96: "雷阵雨伴冰雹",
    99: "强雷阵雨伴冰雹",
  };
  return labels[code] || "晴";
}
