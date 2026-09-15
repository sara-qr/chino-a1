export const REMOTE_PROGRESS_APPLIED = "chino-a1:remote-progress-applied";
export const metaKey = (key: string) => `${key}:sync`;
export type ProgressMeta = { updatedAt: string; reset: boolean };

export function readMeta(key: string): ProgressMeta | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(metaKey(key)) || "null");
    return value && typeof value.updatedAt === "string" && Number.isFinite(Date.parse(value.updatedAt))
      ? { updatedAt: value.updatedAt, reset: value.reset === true } : null;
  } catch { return null; }
}

export function writeLocalProgress(key: string, event: string, value: unknown, reset = false) {
  const raw = value === null ? null : JSON.stringify(value);
  const changed = window.localStorage.getItem(key) !== raw;
  if (raw === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, raw);
  if (changed || reset) {
    const previous = readMeta(key);
    const now = Math.max(Date.now(), previous ? Date.parse(previous.updatedAt) + 1 : 0);
    window.localStorage.setItem(metaKey(key), JSON.stringify({ updatedAt: new Date(now).toISOString(), reset }));
    window.dispatchEvent(new CustomEvent(event));
  }
}
