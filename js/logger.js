const LEVELS = Object.freeze({ debug: 10, info: 20, warn: 30, error: 40, silent: 100 });
const REDACTED_KEYS = /token|secret|password|prompt|content/i;

function sanitize(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    REDACTED_KEYS.test(key) ? "[Redacted]" : sanitize(item, seen),
  ]));
}

export function createLogger({ level = "warn", context = {} } = {}) {
  const threshold = LEVELS[level] ?? LEVELS.warn;

  function write(levelName, message, details) {
    if (LEVELS[levelName] < threshold) return;
    const entry = { time: new Date().toISOString(), level: levelName, message, ...context };
    if (details !== undefined) entry.details = sanitize(details);
    console[levelName](entry);
  }

  return Object.freeze({
    debug: (message, details) => write("debug", message, details),
    info: (message, details) => write("info", message, details),
    warn: (message, details) => write("warn", message, details),
    error: (message, details) => write("error", message, details),
  });
}
