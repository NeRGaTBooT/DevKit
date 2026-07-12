"use client";

import { useCallback, useEffect, useState } from "react";

import {
  GLASSMORPHISM_STORAGE_KEY,
  isGlassmorphismState,
  mergeGlassmorphismState,
} from "@/components/tools/glassmorphism/glassmorphism-logic";
import type {
  GlassmorphismPreset,
  GlassmorphismState,
} from "@/components/tools/glassmorphism/types";
import { defaultGlassmorphismState } from "@/components/tools/glassmorphism/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import {
  buildShareUrl,
  decodeState,
  readShareParam,
} from "@/lib/share-state";

export {
  buildCssProperty,
  buildSimpleCssBlock,
  buildFullCssBlock,
  buildGlassInlineStyles,
} from "@/components/tools/glassmorphism/glassmorphism-logic";

export function useGlassmorphism() {
  const [state, setState] = useState<GlassmorphismState>(
    defaultGlassmorphismState,
  );
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const shared = readShareParam();

    if (shared) {
      const decoded = decodeState<unknown>(shared);

      if (isGlassmorphismState(decoded)) {
        setState(mergeGlassmorphismState(decoded));
        setHydrated(true);
        return;
      }
    }

    const saved = getStorageItem<unknown>(GLASSMORPHISM_STORAGE_KEY);

    if (isGlassmorphismState(saved)) {
      setState(mergeGlassmorphismState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(GLASSMORPHISM_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<GlassmorphismState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultGlassmorphismState);
  }, []);

  const applyPreset = useCallback((preset: GlassmorphismPreset) => {
    setState((current) => ({
      ...current,
      ...preset.state,
    }));
  }, []);

  const getShareUrl = useCallback(() => {
    return buildShareUrl(getToolPath("glassmorphism"), state);
  }, [state]);

  return {
    state,
    update,
    reset,
    applyPreset,
    getShareUrl,
    hydrated,
  };
}
