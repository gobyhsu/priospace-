const WEATHER_CACHE_KEY = "weatherCache";
const WEATHER_CITY_KEY = "weatherCity";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// ⚠️ 高德 Web服务 Key（中国大陆专用）
const AMAP_KEY = "f4bbdba62628bb272bb00b59293d86dc";

// ==================== Provider Router ====================

function isInChina(lat, lng) {
  return lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135;
}

// ==================== AMap (China) ====================

async function amapGeocodeCity(cityName) {
  const res = await fetch(
    `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_KEY}&address=${encodeURIComponent(cityName)}`
  );
  const data = await res.json();
  if (data.status !== "1" || !data.geocodes || data.geocodes.length === 0) {
    return null;
  }
  const geo = data.geocodes[0];
  const [lng, lat] = geo.location.split(",");
  return {
    name: cityName,
    adcode: geo.adcode,
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    provider: "amap",
  };
}

async function amapReverseGeocode(latitude, longitude) {
  const res = await fetch(
    `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_KEY}&location=${longitude},${latitude}&extensions=base`
  );
  const data = await res.json();
  if (data.status !== "1" || !data.regeocode) {
    return null;
  }
  const comp = data.regeocode.addressComponent || {};
  const cityName = comp.city || comp.province || "当前位置";
  return {
    name: typeof cityName === "string" ? cityName : comp.province || "当前位置",
    adcode: comp.adcode,
    latitude,
    longitude,
    provider: "amap",
  };
}

async function amapFetchWeather(adcode) {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${adcode}&extensions=base`
  );
  const data = await res.json();
  if (data.status !== "1" || !data.lives || data.lives.length === 0) {
    throw new Error("Invalid AMap weather response");
  }
  const live = data.lives[0];
  return {
    weather: live.weather,
    temperature: Number(live.temperature),
    humidity: Number(live.humidity),
    winddirection: live.winddirection,
    windpower: live.windpower,
  };
}

// ==================== Nominatim (International Geocoding) ====================

async function nominatimGeocode(cityName) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&accept-language=zh`,
    { headers: { "User-Agent": "PriospacePlus/1.5 (priospace-app)" } }
  );
  const data = await res.json();
  if (!data || data.length === 0) return null;
  const r = data[0];
  return {
    name: r.display_name?.split(",")[0] || cityName,
    adcode: null,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    provider: "nominatim",
  };
}

async function nominatimReverseGeocode(latitude, longitude) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh`,
    { headers: { "User-Agent": "PriospacePlus/1.5 (priospace-app)" } }
  );
  const data = await res.json();
  if (!data || data.error) return null;
  const addr = data.address || {};
  const cityName = addr.city || addr.town || addr.county || addr.state || addr.country || "当前位置";
  return {
    name: cityName,
    adcode: null,
    latitude,
    longitude,
    provider: "nominatim",
  };
}

// ==================== Open-Meteo (International Weather) ====================

function wmoCodeToLabel(code) {
  if (code === 0) return "晴";
  if (code >= 1 && code <= 3) return code === 1 ? "少云" : code === 2 ? "多云" : "阴";
  if (code === 45 || code === 48) return "雾";
  if (code >= 51 && code <= 57) return "毛毛雨";
  if (code >= 61 && code <= 67) return "雨";
  if (code >= 71 && code <= 77) return "雪";
  if (code >= 80 && code <= 82) return "阵雨";
  if (code >= 85 && code <= 86) return "阵雪";
  if (code >= 95 && code <= 99) return "雷";
  if (code >= 200) return "雷"; // thunderstorm with rain variants
  return "多云";
}

function degreesToDirection(deg) {
  const dirs = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx];
}

function kmhToWindPower(kmh) {
  if (kmh < 1) return "无风";
  if (kmh <= 5) return "1级";
  if (kmh <= 11) return "2级";
  if (kmh <= 19) return "3级";
  if (kmh <= 28) return "4级";
  if (kmh <= 38) return "5级";
  if (kmh <= 49) return "6级";
  if (kmh <= 61) return "7级";
  if (kmh <= 74) return "8级";
  if (kmh <= 88) return "9级";
  if (kmh <= 102) return "10级";
  if (kmh <= 117) return "11级";
  return "12级";
}

async function openMeteoFetchWeather(latitude, longitude) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m`,
    { headers: { "User-Agent": "PriospacePlus/1.5" } }
  );
  const data = await res.json();
  if (!data || !data.current) {
    throw new Error("Invalid Open-Meteo response");
  }
  const c = data.current;
  return {
    weather: wmoCodeToLabel(c.weather_code),
    temperature: Math.round(c.temperature_2m),
    humidity: c.relative_humidity_2m,
    winddirection: degreesToDirection(c.wind_direction_10m),
    windpower: kmhToWindPower(c.wind_speed_10m),
  };
}

// ==================== Public API ====================

// 地理编码：城市名 → {name, adcode, latitude, longitude, provider}
export async function geocodeCity(cityName) {
  // Try AMap first, fallback to Nominatim
  const amapResult = await amapGeocodeCity(cityName);
  if (amapResult) return amapResult;
  return nominatimGeocode(cityName);
}

// 逆地理编码：经纬度 → {name, adcode, latitude, longitude, provider}
export async function reverseGeocode(latitude, longitude) {
  if (isInChina(latitude, longitude)) {
    const amapResult = await amapReverseGeocode(latitude, longitude);
    if (amapResult) return amapResult;
  }
  return nominatimReverseGeocode(latitude, longitude);
}

// 天气查询：city对象 → {weather, temperature, humidity, winddirection, windpower}
export async function fetchWeather(city) {
  if (!city) throw new Error("No city provided");
  if (city.provider === "nominatim" || (!city.adcode && city.latitude != null)) {
    return openMeteoFetchWeather(city.latitude, city.longitude);
  }
  if (city.adcode) {
    return amapFetchWeather(city.adcode);
  }
  return openMeteoFetchWeather(city.latitude, city.longitude);
}

// ==================== Cache ====================

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

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });
}

// ==================== Weather icon / label ====================

export function getWeatherIconType(weather) {
  if (!weather) return "clear";
  const w = weather;
  if (w === "晴") return "clear";
  if (w === "少云" || w === "多云" || w === "阴") return "partly-cloudy";
  if (w.includes("雾") || w === "浮尘" || w === "扬沙") return "fog";
  if (w.includes("毛毛雨") || w.includes("细雨")) return "drizzle";
  if (w.includes("雨夹雪")) return "snow";
  if (w.includes("雪")) return "snow";
  if (w.includes("阵雨")) return "rain";
  if (w.includes("雨")) return "rain";
  if (w.includes("雷")) return "thunderstorm";
  if (w.includes("沙尘")) return "fog";
  return "partly-cloudy";
}

export function getWeatherLabel(weather) {
  return weather || "晴";
}
