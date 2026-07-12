import { isKnownToolSlug } from "@/lib/tools/registry";

const STORAGE_PREFIX = "devkit:";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStorageItem<T>(key: string): T | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStorageItem(key: string, value: unknown): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Ignore quota and privacy mode errors.
  }
}

export function removeStorageItem(key: string): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore.
  }
}

export const LAST_TOOL_KEY = "last-tool";

export function saveLastTool(slug: string): void {
  if (!isKnownToolSlug(slug)) return;
  setStorageItem(LAST_TOOL_KEY, slug);
}

export function getLastTool(): string | null {
  const slug = getStorageItem<string>(LAST_TOOL_KEY);
  if (!slug) return null;

  if (!isKnownToolSlug(slug)) {
    removeStorageItem(LAST_TOOL_KEY);
    return null;
  }

  return slug;
}
