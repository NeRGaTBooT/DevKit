"use client";

import { useCallback, useEffect, useState } from "react";

import {
  COLOR_CONVERTER_STORAGE_KEY,
  colorFromHex,
  getDefaultColor,
  updateFromFormat,
} from "@/components/tools/color-converter/color-converter-logic";
import type {
  ColorConverterState,
  ColorInputFormat,
  HslColor,
  RgbColor,
} from "@/components/tools/color-converter/types";
import { defaultColorConverterState } from "@/components/tools/color-converter/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export function useColorConverter() {
  const [state, setState] = useState<ColorConverterState>(defaultColorConverterState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const saved = getStorageItem<string>(COLOR_CONVERTER_STORAGE_KEY);

    if (typeof saved === "string") {
      const color = colorFromHex(saved);
      if (color) {
        setState((current) => ({ ...current, ...color }));
      }
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(COLOR_CONVERTER_STORAGE_KEY, state.hex);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state.hex, hydrated]);

  const applyColor = useCallback(
    (color: ReturnType<typeof getDefaultColor>, format: ColorInputFormat) => {
      setState((current) => ({
        ...current,
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        activeFormat: format,
      }));
    },
    [],
  );

  const setFromHex = useCallback(
    (hex: string) => {
      const color = updateFromFormat("hex", hex);
      if (color) applyColor(color, "hex");
    },
    [applyColor],
  );

  const setFromRgb = useCallback(
    (rgb: RgbColor) => {
      const color = updateFromFormat("rgb", rgb);
      if (color) applyColor(color, "rgb");
    },
    [applyColor],
  );

  const setFromHsl = useCallback(
    (hsl: HslColor) => {
      const color = updateFromFormat("hsl", hsl);
      if (color) applyColor(color, "hsl");
    },
    [applyColor],
  );

  const setRgbChannel = useCallback(
    (channel: keyof RgbColor, value: number) => {
      setFromRgb({ ...state.rgb, [channel]: value });
    },
    [setFromRgb, state.rgb],
  );

  const setHslChannel = useCallback(
    (channel: keyof HslColor, value: number) => {
      setFromHsl({ ...state.hsl, [channel]: value });
    },
    [setFromHsl, state.hsl],
  );

  return {
    state,
    hydrated,
    setFromHex,
    setFromRgb,
    setFromHsl,
    setRgbChannel,
    setHslChannel,
  };
}
