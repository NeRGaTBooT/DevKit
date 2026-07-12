import { hexToRgb, normalizeHex } from "@/lib/color";

import type { ColorInputFormat, HslColor, RgbColor } from "./types";
import { DEFAULT_HEX } from "./types";

export const COLOR_CONVERTER_STORAGE_KEY = "tool:color-converter";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function parseRgbString(input: string): RgbColor | null {
  const match = input
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);

  if (!match) return null;

  const r = Number.parseInt(match[1], 10);
  const g = Number.parseInt(match[2], 10);
  const b = Number.parseInt(match[3], 10);

  if ([r, g, b].some((channel) => channel < 0 || channel > 255)) {
    return null;
  }

  return { r, g, b };
}

export function parseHslString(input: string): HslColor | null {
  const match = input
    .trim()
    .match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/i);

  if (!match) return null;

  const h = Number.parseInt(match[1], 10);
  const s = Number.parseInt(match[2], 10);
  const l = Number.parseInt(match[3], 10);

  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
    return null;
  }

  return { h, s, l };
}

export function formatRgb(rgb: RgbColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsl(hsl: HslColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatColorMix(hex: string): string {
  return `color-mix(in srgb, ${hex} 100%, transparent)`;
}

export function colorFromHex(hex: string): {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
} | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const rgb = hexToRgb(normalized);
  if (!rgb) return null;

  return {
    hex: normalized,
    rgb,
    hsl: rgbToHsl(rgb),
  };
}

export function colorFromRgb(rgb: RgbColor): {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
} {
  const clamped: RgbColor = {
    r: clamp(Math.round(rgb.r), 0, 255),
    g: clamp(Math.round(rgb.g), 0, 255),
    b: clamp(Math.round(rgb.b), 0, 255),
  };

  const hex =
    `#${[clamped.r, clamped.g, clamped.b]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`;

  return {
    hex,
    rgb: clamped,
    hsl: rgbToHsl(clamped),
  };
}

export function colorFromHsl(hsl: HslColor): {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
} {
  const clamped: HslColor = {
    h: clamp(Math.round(hsl.h), 0, 360),
    s: clamp(Math.round(hsl.s), 0, 100),
    l: clamp(Math.round(hsl.l), 0, 100),
  };

  const rgb = hslToRgb(clamped);

  return colorFromRgb(rgb);
}

export function updateFromFormat(
  format: ColorInputFormat,
  value: string | RgbColor | HslColor,
): ReturnType<typeof colorFromHex> {
  if (format === "hex" && typeof value === "string") {
    return colorFromHex(value);
  }

  if (format === "rgb") {
    if (typeof value === "string") {
      const parsed = parseRgbString(value);
      return parsed ? colorFromRgb(parsed) : null;
    }

    return colorFromRgb(value as RgbColor);
  }

  if (typeof value === "string") {
    const parsed = parseHslString(value);
    return parsed ? colorFromHsl(parsed) : null;
  }

  return colorFromHsl(value as HslColor);
}

export function getDefaultColor() {
  return colorFromHex(DEFAULT_HEX)!;
}
