"use client";

import { useCallback, useEffect, useState } from "react";

import {
  TEXT_SHADOW_STORAGE_KEY,
  isTextShadowState,
  mergeTextShadowState,
} from "@/components/tools/text-shadow/text-shadow-logic";
import type {
  TextShadowLayer,
  TextShadowPreset,
  TextShadowState,
} from "@/components/tools/text-shadow/types";
import {
  MAX_TEXT_SHADOWS,
  MIN_TEXT_SHADOWS,
  createTextShadowLayer,
  defaultTextShadowState,
} from "@/components/tools/text-shadow/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export {
  buildTextShadow,
  buildCssBlock,
  buildCssProperty,
  rgbaFromHex,
} from "@/components/tools/text-shadow/text-shadow-logic";

export function useTextShadow() {
  const [state, setState] = useState<TextShadowState>(defaultTextShadowState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const saved = getStorageItem<unknown>(TEXT_SHADOW_STORAGE_KEY);

    if (isTextShadowState(saved)) {
      setState(mergeTextShadowState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(TEXT_SHADOW_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<TextShadowState>) => {
    setState((current) => mergeTextShadowState({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultTextShadowState);
  }, []);

  const applyPreset = useCallback((preset: TextShadowPreset) => {
    setState((current) =>
      mergeTextShadowState({ ...current, ...preset.state }),
    );
  }, []);

  const selectShadow = useCallback((id: string | null) => {
    setState((current) => ({ ...current, activeShadowId: id }));
  }, []);

  const addShadow = useCallback(() => {
    setState((current) => {
      if (current.shadows.length >= MAX_TEXT_SHADOWS) return current;

      const newLayer = createTextShadowLayer(current.shadows.length);

      return {
        ...current,
        shadows: [...current.shadows, newLayer],
        activeShadowId: newLayer.id,
      };
    });
  }, []);

  const removeShadow = useCallback((id: string) => {
    setState((current) => {
      if (current.shadows.length <= MIN_TEXT_SHADOWS) return current;

      const shadows = current.shadows.filter((layer) => layer.id !== id);

      return {
        ...current,
        shadows,
        activeShadowId:
          current.activeShadowId === id
            ? (shadows[0]?.id ?? null)
            : current.activeShadowId,
      };
    });
  }, []);

  const updateShadow = useCallback(
    (id: string, partial: Partial<TextShadowLayer>) => {
      setState((current) => ({
        ...current,
        shadows: current.shadows.map((layer) =>
          layer.id === id ? { ...layer, ...partial } : layer,
        ),
      }));
    },
    [],
  );

  const activeShadow =
    state.shadows.find((layer) => layer.id === state.activeShadowId) ??
    state.shadows[0] ??
    null;

  return {
    state,
    activeShadow,
    update,
    reset,
    applyPreset,
    selectShadow,
    addShadow,
    removeShadow,
    updateShadow,
    hydrated,
  };
}
