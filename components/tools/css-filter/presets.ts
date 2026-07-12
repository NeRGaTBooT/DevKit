import type { CssFilterPreset } from "./types";

export const cssFilterPresets: CssFilterPreset[] = [
  {
    id: "none",
    name: "Без фильтра",
    state: {
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
    },
  },
  {
    id: "blur",
    name: "Размытие",
    state: {
      blur: 8,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
    },
  },
  {
    id: "grayscale",
    name: "Ч/Б",
    state: {
      blur: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 100,
    },
  },
  {
    id: "vivid",
    name: "Яркий",
    state: {
      blur: 0,
      brightness: 110,
      contrast: 120,
      saturate: 150,
      grayscale: 0,
    },
  },
  {
    id: "muted",
    name: "Приглушённый",
    state: {
      blur: 0,
      brightness: 90,
      contrast: 90,
      saturate: 60,
      grayscale: 20,
    },
  },
  {
    id: "dramatic",
    name: "Драматичный",
    state: {
      blur: 0,
      brightness: 85,
      contrast: 140,
      saturate: 80,
      grayscale: 30,
    },
  },
  {
    id: "soft-focus",
    name: "Мягкий фокус",
    state: {
      blur: 3,
      brightness: 105,
      contrast: 95,
      saturate: 110,
      grayscale: 0,
    },
  },
  {
    id: "vintage",
    name: "Винтаж",
    state: {
      blur: 0,
      brightness: 95,
      contrast: 85,
      saturate: 70,
      grayscale: 40,
    },
  },
];
