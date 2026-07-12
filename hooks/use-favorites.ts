"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  addRecentTool,
  getFavoritesSnapshot,
  getFavoritesServerSnapshot,
  hydrateFavorites,
  subscribeFavorites,
  toggleFavorite,
} from "@/lib/favorites";

export function useFavorites() {
  const { favorites, recent, hydrated } = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );

  useEffect(() => {
    hydrateFavorites();
  }, []);

  const handleToggleFavorite = useCallback((slug: string) => {
    return toggleFavorite(slug);
  }, []);

  const trackRecent = useCallback((slug: string) => {
    return addRecentTool(slug);
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites],
  );

  return {
    favorites,
    recent,
    hydrated,
    isFavorite,
    toggleFavorite: handleToggleFavorite,
    trackRecent,
  };
}
