// utils/cloud-sync.js
// CloudBase 跨平台同步（桌面端）
// 和小程序共用 cloudbase-d6gkpswjwe9af37da / user_data 集合
"use client";

import cloudbase from "@cloudbase/js-sdk";

const ENV_ID = "cloudbase-d6gkpswjwe9af37da";
const COLLECTION = "user_data";
const DEBOUNCE_MS = 5000;

let app = null;
let db = null;
let _uid = null;
let _pushTimer = null;

// ==================== Init ====================

async function initCloud() {
  if (app) return app;
  app = cloudbase.init({ env: ENV_ID });

  // 匿名登录（持久化 — 同一设备保持相同身份）
  const auth = app.auth();
  const loginState = await auth.getLoginState();
  if (!loginState) {
    await auth.anonymousAuthProvider().signIn();
  }

  db = app.database();
  _uid = await getOrCreateUid();
  return app;
}

// UID: 优先使用存储的，否则生成新码
async function getOrCreateUid() {
  try {
    const stored = localStorage.getItem("_syncUid");
    if (stored) return stored;
  } catch (e) {}

  // 生成 8 位随机码
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  try {
    localStorage.setItem("_syncUid", code);
  } catch (e) {}
  return code;
}

function getUid() {
  return _uid;
}

function setUid(code) {
  _uid = code;
  try {
    localStorage.setItem("_syncUid", code);
  } catch (e) {}
}

// ==================== Pull ====================

async function pullFromCloud() {
  try {
    await initCloud();
    const res = await db
      .collection(COLLECTION)
      .where({ uid: _uid })
      .limit(1)
      .get();
    if (res.data && res.data.length > 0) {
      console.log("[cloud-sync] Pulled, updatedAt:", res.data[0].updatedAt);
      return res.data[0];
    }
    console.log("[cloud-sync] No cloud data for uid:", _uid);
    return null;
  } catch (err) {
    console.error("[cloud-sync] Pull failed:", err);
    return null;
  }
}

// ==================== Push ====================

async function pushToCloud(data) {
  try {
    await initCloud();
    // 查找是否已有文档
    const existing = await db
      .collection(COLLECTION)
      .where({ uid: _uid })
      .limit(1)
      .get();

    const payload = {
      uid: _uid,
      dailyTasks: data.dailyTasks,
      customTags: data.customTags,
      habits: data.habits,
      recurringTasks: data.recurringTasks || [],
      darkMode: data.darkMode,
      theme: data.theme,
      weatherCity: data.weatherCity || null,
      weatherCache: data.weatherCache || null,
      language: data.language || "zh-CN",
      updatedAt: Date.now(),
      schemaVersion: 4,
    };

    if (existing.data && existing.data.length > 0) {
      await db
        .collection(COLLECTION)
        .doc(existing.data[0]._id)
        .set(payload);
    } else {
      await db.collection(COLLECTION).add(payload);
    }
    console.log("[cloud-sync] Push success");
  } catch (err) {
    console.error("[cloud-sync] Push failed:", err);
  }
}

// ==================== Debounced Push ====================

function schedulePush(data) {
  if (_pushTimer) clearTimeout(_pushTimer);
  _pushTimer = setTimeout(() => pushToCloud(data), DEBOUNCE_MS);
}

// ==================== Sync on Launch ====================

async function syncOnLaunch(localData) {
  try {
    const cloud = await pullFromCloud();
    if (!cloud) {
      // 无云端数据 → 推送本地
      await pushToCloud(localData);
      return { merged: localData, fromCloud: false };
    }

    if ((cloud.updatedAt || 0) > (localData.updatedAt || 0)) {
      // 云端更新 → 合并
      return { merged: merge(cloud, localData), fromCloud: true };
    }
    // 本地相同或更新 → 不推送（等用户操作后再推）
    return { merged: localData, fromCloud: false };
  } catch (err) {
    console.error("[cloud-sync] Sync failed:", err);
    return { merged: localData, fromCloud: false };
  }
}

// ==================== Merge ====================

function merge(cloud, local) {
  return {
    dailyTasks: mergeDailyTasks(cloud.dailyTasks || {}, local.dailyTasks || {}),
    customTags: mergeArr(cloud.customTags || [], local.customTags || [], "id"),
    habits: mergeArr(cloud.habits || [], local.habits || [], "id"),
    recurringTasks: mergeArr(
      cloud.recurringTasks || [],
      local.recurringTasks || [],
      "id"
    ),
    darkMode:
      local.darkMode !== undefined ? local.darkMode : cloud.darkMode,
    theme: local.theme || cloud.theme || "default",
    weatherCity: local.weatherCity || cloud.weatherCity,
    weatherCache: local.weatherCache || cloud.weatherCache,
    language: local.language || cloud.language,
    updatedAt: Date.now(),
    schemaVersion: 4,
  };
}

function mergeDailyTasks(cloudTasks, localTasks) {
  const merged = {};
  const allKeys = [
    ...new Set([
      ...Object.keys(cloudTasks),
      ...Object.keys(localTasks),
    ]),
  ];
  for (const dateKey of allKeys) {
    const c = cloudTasks[dateKey] || [];
    const l = localTasks[dateKey] || [];
    const idMap = {};
    for (const t of c) idMap[t.id] = t;
    for (const t of l) idMap[t.id] = t;
    merged[dateKey] = Object.values(idMap);
  }
  return merged;
}

function mergeArr(cloudArr, localArr, key) {
  const map = {};
  for (const item of cloudArr) map[item[key]] = item;
  for (const item of localArr) map[item[key]] = item;
  return Object.values(map);
}

// ==================== Export ====================

export {
  initCloud,
  getUid,
  setUid,
  pullFromCloud,
  pushToCloud,
  schedulePush,
  syncOnLaunch,
};
