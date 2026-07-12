"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CSS_FILTER_STORAGE_KEY,
  isCssFilterState,
  mergeCssFilterState,
} from "@/components/tools/css-filter/css-filter-logic";
import type { CssFilterPreset, CssFilterState } from "@/components/tools/css-filter/types";
import { defaultCssFilterState } from "@/components/tools/css-filter/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export {
  buildCssFilter,
  buildCssBlock,
  buildCssProperty,
} from "@/components/tools/css-filter/css-filter-logic";

export function useCssFilter() {
  const [state, setState] = useState<CssFilterState>(defaultCssFilterState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const saved = getStorageItem<unknown>(CSS_FILTER_STORAGE_KEY);

    if (isCssFilterState(saved)) {
      setState(mergeCssFilterState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(CSS_FILTER_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<CssFilterState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultCssFilterState);
  }, []);

  const applyPreset = useCallback((preset: CssFilterPreset) => {
    setState((current) => ({
      ...current,
      ...preset.state,
    }));
  }, []);

  return {
    state,
    update,
    reset,
    applyPreset,
    hydrated,
  };
}
