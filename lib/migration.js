// Schema migration system for PrioSpace
// Ensures backward compatibility when new fields are added to the data model.

export const CURRENT_SCHEMA_VERSION = 4;

const migrations = {
  3: migrate_v3_to_v4,
};

/**
 * Run all pending migrations on the data object.
 * @param {object} data - { dailyTasks, customTags, habits, recurringTasks? }
 * @returns {object} migrated data
 */
export function migrateData(data) {
  let version = 3;

  if (typeof window !== "undefined") {
    version = parseInt(localStorage.getItem("schemaVersion") || "3", 10);
  }

  if (version < 3) version = 3;

  while (version < CURRENT_SCHEMA_VERSION) {
    const migrate = migrations[version];
    if (migrate) {
      data = migrate(data);
    }
    version++;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("schemaVersion", String(CURRENT_SCHEMA_VERSION));
  }

  return data;
}

/**
 * v3 → v4: Add priority, description, dueTime, order fields to tasks/subtasks.
 */
function migrate_v3_to_v4(data) {
  if (data.dailyTasks) {
    Object.keys(data.dailyTasks).forEach((dateKey) => {
      data.dailyTasks[dateKey] = data.dailyTasks[dateKey].map((task) => ({
        ...task,
        priority: task.priority || "medium",
        description: task.description || "",
        dueTime: task.dueTime || "",
        order: task.order ?? 0,
        subtasks: (task.subtasks || []).map((st) => ({
          ...st,
          priority: st.priority || "medium",
          description: st.description || "",
          dueTime: st.dueTime || "",
          order: st.order ?? 0,
        })),
      }));
    });
  }

  if (!data.recurringTasks) {
    data.recurringTasks = [];
  }

  return data;
}
