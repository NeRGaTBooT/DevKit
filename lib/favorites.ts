import { isKnownToolSlug } from "@/lib/tools/registry";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export const FAVORITES_STORAGE_KEY = "favorites:tools";
export const RECENT_TOOLS_STORAGE_KEY = "recent-tools";
export const MAX_RECENT_TOOLS = 5;

export interface FavoritesSnapshot {
  favorites: string[];
  recent: string[];
  hydrated: boolean;
}

const emptySnapshot: FavoritesSnapshot = {
  favorites: [],
  recent: [],
  hydrated: false,
};

let snapshot: FavoritesSnapshot = emptySnapshot;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function readFavoritesFromStorage(): string[] {
  const favorites = getStorageItem<string[]>(FAVORITES_STORAGE_KEY);
  return Array.isArray(favorites) ? favorites : [];
}

function readRecentFromStorage(): string[] {
  const recent = getStorageItem<string[]>(RECENT_TOOLS_STORAGE_KEY);
  return Array.isArray(recent) ? recent : [];
}

function pruneInvalidTools(slugs: string[]): string[] {
  return slugs.filter((slug) => isKnownToolSlug(slug));
}

function pruneStoredTools(): { favorites: string[]; recent: string[] } {
  const favorites = pruneInvalidTools(readFavoritesFromStorage());
  const recent = pruneInvalidTools(readRecentFromStorage());

  const storedFavorites = readFavoritesFromStorage();
  const storedRecent = readRecentFromStorage();

  if (
    favorites.length !== storedFavorites.length ||
    recent.length !== storedRecent.length
  ) {
    setStorageItem(FAVORITES_STORAGE_KEY, favorites);
    setStorageItem(RECENT_TOOLS_STORAGE_KEY, recent);
  }

  return { favorites, recent };
}

export function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFavoritesSnapshot(): FavoritesSnapshot {
  return snapshot;
}

export function getFavoritesServerSnapshot(): FavoritesSnapshot {
  return emptySnapshot;
}

export function hydrateFavorites(): void {
  if (snapshot.hydrated) return;

  const { favorites, recent } = pruneStoredTools();

  snapshot = {
    favorites,
    recent,
    hydrated: true,
  };
  emit();
}

export function getFavorites(): string[] {
  return snapshot.hydrated
    ? snapshot.favorites
    : readFavoritesFromStorage();
}

export function setFavorites(slugs: string[]): void {
  setStorageItem(FAVORITES_STORAGE_KEY, slugs);
  snapshot = { ...snapshot, favorites: slugs, hydrated: true };
  emit();
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): string[] {
  const favorites = getFavorites();

  if (!favorites.includes(slug) && !isKnownToolSlug(slug)) {
    return favorites;
  }

  const next = favorites.includes(slug)
    ? favorites.filter((item) => item !== slug)
    : [...favorites, slug];

  setFavorites(next);
  return next;
}

export function getRecentTools(): string[] {
  return snapshot.hydrated ? snapshot.recent : readRecentFromStorage();
}

export function addRecentTool(slug: string): string[] {
  if (!isKnownToolSlug(slug)) {
    return getRecentTools();
  }

  const recent = getRecentTools().filter((item) => item !== slug);
  const next = [slug, ...recent].slice(0, MAX_RECENT_TOOLS);
  setStorageItem(RECENT_TOOLS_STORAGE_KEY, next);
  snapshot = { ...snapshot, recent: next, hydrated: true };
  emit();
  return next;
}
