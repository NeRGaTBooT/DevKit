"use client";

import { useCallback, useEffect, useState } from "react";

import {
  GRID_STORAGE_KEY,
  isGridState,
  mergeGridState,
} from "@/components/tools/grid/grid-logic";
import type { GridItem, GridPreset, GridState } from "@/components/tools/grid/types";
import {
  createGridItem,
  defaultGridState,
  MAX_GRID_ITEMS,
  MIN_GRID_ITEMS,
} from "@/components/tools/grid/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import {
  buildShareUrl,
  decodeState,
  readShareParam,
} from "@/lib/share-state";

export function useGrid() {
  const [state, setState] = useState<GridState>(defaultGridState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const shared = readShareParam();

    if (shared) {
      const decoded = decodeState<unknown>(shared);

      if (isGridState(decoded)) {
        setState(mergeGridState(decoded));
        setHydrated(true);
        return;
      }
    }

    const saved = getStorageItem<unknown>(GRID_STORAGE_KEY);

    if (isGridState(saved)) {
      setState(mergeGridState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(GRID_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<GridState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultGridState);
  }, []);

  const applyPreset = useCallback((preset: GridPreset) => {
    setState((current) => mergeGridState({ ...current, ...preset.state }));
  }, []);

  const selectItem = useCallback((id: string | null) => {
    setState((current) => ({ ...current, selectedItemId: id }));
  }, []);

  const addItem = useCallback(() => {
    setState((current) => {
      if (current.items.length >= MAX_GRID_ITEMS) return current;

      const newItem = createGridItem(current.items.length);

      return {
        ...current,
        items: [...current.items, newItem],
        selectedItemId: newItem.id,
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((current) => {
      if (current.items.length <= MIN_GRID_ITEMS) return current;

      const items = current.items.filter((item) => item.id !== id);

      return {
        ...current,
        items,
        selectedItemId:
          current.selectedItemId === id
            ? (items[0]?.id ?? null)
            : current.selectedItemId,
      };
    });
  }, []);

  const updateItem = useCallback((id: string, partial: Partial<GridItem>) => {
    setState((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, ...partial } : item,
      ),
    }));
  }, []);

  const selectedItem =
    state.items.find((item) => item.id === state.selectedItemId) ?? null;

  const getShareUrl = useCallback(() => {
    return buildShareUrl(getToolPath("grid"), state);
  }, [state]);

  return {
    state,
    selectedItem,
    update,
    reset,
    applyPreset,
    selectItem,
    addItem,
    removeItem,
    updateItem,
    getShareUrl,
    hydrated,
  };
}
