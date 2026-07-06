/**
 * Thin, failure-safe wrapper around localStorage for one-off flags that
 * live outside the Zustand persisted store (e.g. "has boot played").
 */
export function readFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeFlag(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, "1");
    else window.localStorage.removeItem(key);
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}
