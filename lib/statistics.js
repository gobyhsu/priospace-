// Calculate habit streak
export function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return { current: 0, best: 0 };
  const sorted = [...completedDates].sort();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  // Current streak
  let currentStreak = 0;
  if (sorted.includes(todayStr) || sorted.includes(yesterdayStr)) {
    const startDate = sorted.includes(todayStr) ? todayStr : yesterdayStr;
    currentStreak = 1;
    let checkDate = new Date(startDate + "T00:00:00");
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth()+1).padStart(2,'0')}-${String(checkDate.getDate()).padStart(2,'0')}`;
      if (sorted.includes(checkStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Best streak
  let bestStreak = sorted.length > 0 ? 1 : 0;
  let tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i-1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  return { current: currentStreak, best: bestStreak };
}

// Get completion stats for a range of days
export function getCompletionStats(dailyTasks, days) {
  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const tasks = dailyTasks[key] || [];
    const completed = tasks.filter(t => t.completed).length;
    result.push({ date: key, completed, total: tasks.length });
  }
  return result;
}

// Get total focus time by day
export function getFocusTimeByDay(dailyTasks, days) {
  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const tasks = dailyTasks[key] || [];
    const totalFocus = tasks.reduce((sum, t) => {
      const subFocus = (t.subtasks || []).reduce((s, st) => s + (st.focusTime || 0), 0);
      return sum + (t.focusTime || 0) + subFocus;
    }, 0);
    result.push({ date: key, focusTime: Math.round(totalFocus / 60) }); // minutes
  }
  return result;
}

// Get focus time grouped by tag
export function getFocusTimeByTag(dailyTasks, customTags) {
  const tagFocus = {};
  Object.values(dailyTasks).forEach((tasks) => {
    tasks.forEach((task) => {
      const tag = task.tag || "untagged";
      const focus = task.focusTime || 0;
      tagFocus[tag] = (tagFocus[tag] || 0) + focus;
    });
  });
  return Object.entries(tagFocus).map(([tagId, focusTime]) => ({
    tag: tagId,
    tagName: customTags.find(t => t.id === tagId)?.name || "Untagged",
    tagColor: customTags.find(t => t.id === tagId)?.color || "#888",
    focusTime: Math.round(focusTime / 60),
  })).filter(t => t.focusTime > 0).sort((a, b) => b.focusTime - a.focusTime);
}

// Format minutes to readable string
export function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
