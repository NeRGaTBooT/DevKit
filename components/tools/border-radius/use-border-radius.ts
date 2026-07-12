"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BORDER_RADIUS_STORAGE_KEY,
  isBorderRadiusState,
  mergeBorderRadiusState,
} from "@/components/tools/border-radius/border-radius-logic";
import type {
  BorderRadiusPreset,
  BorderRadiusState,
  CornerRadii,
} from "@/components/tools/border-radius/types";
import { defaultBorderRadiusState } from "@/components/tools/border-radius/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export {
  buildBorderRadius,
  buildCssBlock,
  buildCssProperty,
} from "@/components/tools/border-radius/border-radius-logic";

export function useBorderRadius() {
  const [state, setState] = useState<BorderRadiusState>(defaultBorderRadiusState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const saved = getStorageItem<unknown>(BORDER_RADIUS_STORAGE_KEY);

    if (isBorderRadiusState(saved)) {
      setState(mergeBorderRadiusState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(BORDER_RADIUS_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<BorderRadiusState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const updateCorner = useCallback(
    (key: keyof CornerRadii, value: number) => {
      setState((current) => {
        if (current.unified) {
          const corners: CornerRadii = {
            topLeft: value,
            topRight: value,
            bottomRight: value,
            bottomLeft: value,
          };

          return { ...current, corners };
        }

        return {
          ...current,
          corners: { ...current.corners, [key]: value },
        };
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setState(defaultBorderRadiusState);
  }, []);

  const applyPreset = useCallback((preset: BorderRadiusPreset) => {
    setState((current) =>
      mergeBorderRadiusState({
        ...current,
        ...preset.state,
        corners: {
          ...current.corners,
          ...preset.state.corners,
        },
      }),
    );
  }, []);

  return {
    state,
    update,
    updateCorner,
    reset,
    applyPreset,
    hydrated,
  };
}
