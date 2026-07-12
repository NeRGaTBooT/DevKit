"use client";

import { useCallback, useEffect, useState } from "react";

import {
  FLEXBOX_STORAGE_KEY,
  isFlexboxState,
  mergeFlexboxState,
} from "@/components/tools/flexbox/flexbox-logic";
import type {
  FlexboxPreset,
  FlexboxState,
  FlexItem,
} from "@/components/tools/flexbox/types";
import {
  createFlexItem,
  defaultFlexboxState,
  MAX_FLEX_ITEMS,
  MIN_FLEX_ITEMS,
} from "@/components/tools/flexbox/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import {
  buildShareUrl,
  decodeState,
  readShareParam,
} from "@/lib/share-state";

export function useFlexbox() {
  const [state, setState] = useState<FlexboxState>(defaultFlexboxState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const shared = readShareParam();

    if (shared) {
      const decoded = decodeState<unknown>(shared);

      if (isFlexboxState(decoded)) {
        setState(mergeFlexboxState(decoded));
        setHydrated(true);
        return;
      }
    }

    const saved = getStorageItem<unknown>(FLEXBOX_STORAGE_KEY);

    if (isFlexboxState(saved)) {
      setState(mergeFlexboxState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(FLEXBOX_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<FlexboxState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultFlexboxState);
  }, []);

  const applyPreset = useCallback((preset: FlexboxPreset) => {
    setState((current) => {
      const next = mergeFlexboxState({ ...current, ...preset.state });

      if (preset.id === "sidebar") {
        next.items = current.items.map((item, index) => ({
          ...item,
          flexGrow: index === 0 ? 0 : 1,
          flexBasisAuto: index === 0 ? false : true,
          flexBasis: index === 0 ? 120 : 0,
          width: index === 0 ? 120 : null,
        }));
      }

      if (preset.id === "holy-grail") {
        next.items = current.items.slice(0, 3).map((item, index) => ({
          ...item,
          flexGrow: index === 1 ? 1 : 0,
          flexBasisAuto: index !== 1,
          flexBasis: index === 1 ? 0 : 48,
          height: index === 1 ? null : 48,
        }));
      }

      if (preset.id === "equal-columns") {
        next.items = current.items.map((item) => ({
          ...item,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          flexBasisAuto: false,
        }));
      }

      if (preset.id === "footer-stick" && current.items.length >= 3) {
        next.items = current.items.map((item, index) => ({
          ...item,
          flexGrow: index === 1 ? 1 : 0,
          flexBasisAuto: index !== 1,
          height: index === 1 ? null : 48,
        }));
      }

      return next;
    });
  }, []);

  const selectItem = useCallback((id: string | null) => {
    setState((current) => ({ ...current, selectedItemId: id }));
  }, []);

  const addItem = useCallback(() => {
    setState((current) => {
      if (current.items.length >= MAX_FLEX_ITEMS) return current;

      const newItem = createFlexItem(current.items.length);

      return {
        ...current,
        items: [...current.items, newItem],
        selectedItemId: newItem.id,
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((current) => {
      if (current.items.length <= MIN_FLEX_ITEMS) return current;

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

  const updateItem = useCallback((id: string, partial: Partial<FlexItem>) => {
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
    return buildShareUrl(getToolPath("flexbox"), state);
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
