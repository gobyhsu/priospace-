const MAX_SNAPSHOTS = 5;
const STORAGE_KEY = "backupSnapshots";

export function saveSnapshot(data) {
  try {
    const snapshots = getSnapshots();
    const newSnapshot = {
      timestamp: Date.now(),
      taskCount: Object.values(data.dailyTasks || {}).reduce(
        (sum, tasks) => sum + tasks.length,
        0
      ),
      data,
    };
    snapshots.unshift(newSnapshot);
    if (snapshots.length > MAX_SNAPSHOTS) {
      snapshots.length = MAX_SNAPSHOTS;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  } catch (e) {
    console.error("Failed to save snapshot:", e);
  }
}

export function getSnapshots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function restoreSnapshot(index) {
  const snapshots = getSnapshots();
  return snapshots[index]?.data || null;
}

export function deleteSnapshot(index) {
  const snapshots = getSnapshots();
  snapshots.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
}
