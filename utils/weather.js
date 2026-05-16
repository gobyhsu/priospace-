const WEATHER_CACHE_KEY = "weatherCache";
const WEATHER_CITY_KEY = "weatherCity";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// ⚠️ 高德 Web服务 Key
const AMAP_KEY = "f4bbdba62628bb272bb00b59293d86dc";

// 地理编码：城市名 → adcode + 经纬度
export async function geocodeCity(cityName) {
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
  };
}

// 逆地理编码：经纬度 → adcode + 城市名
export async function reverseGeocode(latitude, longitude) {
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
  };
}

// 天气查询（用 adcode）
export async function fetchWeather(adcode) {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${adcode}&extensions=base`
  );
  const data = await res.json();
  if (data.status !== "1" || !data.lives || data.lives.length === 0) {
    throw new Error("Invalid weather response");
  }
  const live = data.lives[0];
  return {
    weather: live.weather,
    temperature: live.temperature,
    humidity: live.humidity,
    winddirection: live.winddirection,
    windpower: live.windpower,
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

// 高德天气描述 → 图标类型
export function getWeatherIconType(weather) {
  if (!weather) return "clear";
  const w = weather;
  if (w === "晴") return "clear";
  if (w === "少云" || w === "多云" || w === "阴") return "partly-cloudy";
  if (w.includes("雾") || w === "浮尘" || w === "扬沙") return "fog";
  if (w.includes("毛毛雨") || w.includes("细雨")) return "drizzle";
  if (w.includes("雨夹雪")) return "snow";
  if (w.includes("雪")) return "snow";
  if (w.includes("雨")) return "rain";
  if (w.includes("雷")) return "thunderstorm";
  if (w.includes("沙尘")) return "fog";
  return "partly-cloudy";
}

export function getWeatherLabel(weather) {
  return weather || "晴";
}
