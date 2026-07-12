"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BOX_SHADOW_STORAGE_KEY,
  isBoxShadowState,
  mergeBoxShadowState,
} from "@/components/tools/box-shadow/box-shadow-logic";
import type { BoxShadowPreset, BoxShadowState } from "@/components/tools/box-shadow/types";
import { defaultBoxShadowState } from "@/components/tools/box-shadow/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import {
  buildShareUrl,
  decodeState,
  readShareParam,
} from "@/lib/share-state";

export {
  buildBoxShadow,
  buildCssBlock,
  buildCssProperty,
  rgbaFromHex,
} from "@/components/tools/box-shadow/box-shadow-logic";

export function useBoxShadow() {
  const [state, setState] = useState<BoxShadowState>(defaultBoxShadowState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const shared = readShareParam();

    if (shared) {
      const decoded = decodeState<unknown>(shared);

      if (isBoxShadowState(decoded)) {
        setState(mergeBoxShadowState(decoded));
        setHydrated(true);
        return;
      }
    }

    const saved = getStorageItem<unknown>(BOX_SHADOW_STORAGE_KEY);

    if (isBoxShadowState(saved)) {
      setState(mergeBoxShadowState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(BOX_SHADOW_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<BoxShadowState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultBoxShadowState);
  }, []);

  const applyPreset = useCallback((preset: BoxShadowPreset) => {
    setState((current) => ({
      ...current,
      ...preset.state,
    }));
  }, []);

  const getShareUrl = useCallback(() => {
    return buildShareUrl(getToolPath("box-shadow"), state);
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
