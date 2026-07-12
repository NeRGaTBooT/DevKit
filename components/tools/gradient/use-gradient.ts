"use client";

import { useCallback, useEffect, useState } from "react";

import {
  GRADIENT_STORAGE_KEY,
  interpolateStopColor,
  isGradientState,
  mergeGradientState,
} from "@/components/tools/gradient/gradient-logic";
import type {
  ColorStop,
  GradientPreset,
  GradientState,
} from "@/components/tools/gradient/types";
import {
  createColorStop,
  defaultGradientState,
} from "@/components/tools/gradient/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import {
  buildShareUrl,
  decodeState,
  readShareParam,
} from "@/lib/share-state";

const MAX_STOPS = 10;
const MIN_STOPS = 2;

export function useGradient() {
  const [state, setState] = useState<GradientState>(defaultGradientState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const shared = readShareParam();

    if (shared) {
      const decoded = decodeState<unknown>(shared);

      if (isGradientState(decoded)) {
        setState(mergeGradientState(decoded));
        setHydrated(true);
        return;
      }
    }

    const saved = getStorageItem<unknown>(GRADIENT_STORAGE_KEY);

    if (isGradientState(saved)) {
      setState(mergeGradientState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(GRADIENT_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<GradientState>) => {
    setState((current) => ({
      ...current,
      ...partial,
      position: partial.position
        ? { ...current.position, ...partial.position }
        : current.position,
      previewSize: partial.previewSize
        ? { ...current.previewSize, ...partial.previewSize }
        : current.previewSize,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultGradientState);
  }, []);

  const applyPreset = useCallback((preset: GradientPreset) => {
    setState((current) => mergeGradientState({ ...current, ...preset.state }));
  }, []);

  const updateStop = useCallback((id: string, partial: Partial<ColorStop>) => {
    setState((current) => ({
      ...current,
      stops: current.stops.map((stop) =>
        stop.id === id ? { ...stop, ...partial } : stop,
      ),
    }));
  }, []);

  const addStop = useCallback((position: number) => {
    setState((current) => {
      if (current.stops.length >= MAX_STOPS) return current;

      const interpolated = interpolateStopColor(current.stops, position);

      return {
        ...current,
        stops: [
          ...current.stops,
          createColorStop(interpolated.color, position, interpolated.opacity),
        ],
      };
    });
  }, []);

  const removeStop = useCallback((id: string) => {
    setState((current) => {
      if (current.stops.length <= MIN_STOPS) return current;

      return {
        ...current,
        stops: current.stops.filter((stop) => stop.id !== id),
      };
    });
  }, []);

  const duplicateStop = useCallback((id: string) => {
    setState((current) => {
      if (current.stops.length >= MAX_STOPS) return current;

      const source = current.stops.find((stop) => stop.id === id);
      if (!source) return current;

      const offset = source.position >= 90 ? -8 : 8;
      const position = Math.max(0, Math.min(100, source.position + offset));

      return {
        ...current,
        stops: [
          ...current.stops,
          createColorStop(source.color, position, source.opacity),
        ],
      };
    });
  }, []);

  const getShareUrl = useCallback(() => {
    return buildShareUrl(getToolPath("gradient"), state);
  }, [state]);

  return {
    state,
    update,
    reset,
    applyPreset,
    updateStop,
    addStop,
    removeStop,
    duplicateStop,
    getShareUrl,
    hydrated,
  };
}
