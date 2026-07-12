import { createTextShadowLayer } from "./types";
import type { TextShadowPreset } from "./types";

export const textShadowPresets: TextShadowPreset[] = [
  {
    id: "soft",
    name: "Мягкая",
    state: {
      shadows: [
        { ...createTextShadowLayer(0), offsetX: 0, offsetY: 2, blur: 8, opacity: 0.25 },
      ],
      textColor: "#FFFFFF",
      bgColor: "#18181B",
    },
  },
  {
    id: "retro",
    name: "Ретро",
    state: {
      shadows: [
        {
          ...createTextShadowLayer(0),
          offsetX: 3,
          offsetY: 3,
          blur: 0,
          color: "#FF6B6B",
          opacity: 1,
        },
        {
          ...createTextShadowLayer(1),
          offsetX: 6,
          offsetY: 6,
          blur: 0,
          color: "#4ECDC4",
          opacity: 1,
        },
      ],
      textColor: "#FFFFFF",
      bgColor: "#2D3436",
    },
  },
  {
    id: "glow",
    name: "Свечение",
    state: {
      shadows: [
        {
          ...createTextShadowLayer(0),
          offsetX: 0,
          offsetY: 0,
          blur: 16,
          color: "#6366F1",
          opacity: 0.8,
        },
        {
          ...createTextShadowLayer(1),
          offsetX: 0,
          offsetY: 0,
          blur: 32,
          color: "#6366F1",
          opacity: 0.4,
        },
      ],
      textColor: "#E0E7FF",
      bgColor: "#0F172A",
    },
  },
  {
    id: "emboss",
    name: "Рельеф",
    state: {
      shadows: [
        {
          ...createTextShadowLayer(0),
          offsetX: -1,
          offsetY: -1,
          blur: 0,
          color: "#FFFFFF",
          opacity: 0.5,
        },
        {
          ...createTextShadowLayer(1),
          offsetX: 1,
          offsetY: 1,
          blur: 0,
          color: "#000000",
          opacity: 0.5,
        },
      ],
      textColor: "#A1A1AA",
      bgColor: "#27272A",
    },
  },
  {
    id: "fire",
    name: "Огонь",
    state: {
      shadows: [
        {
          ...createTextShadowLayer(0),
          offsetX: 0,
          offsetY: 0,
          blur: 4,
          color: "#FF4500",
          opacity: 0.9,
        },
        {
          ...createTextShadowLayer(1),
          offsetX: 0,
          offsetY: -2,
          blur: 12,
          color: "#FFD700",
          opacity: 0.7,
        },
        {
          ...createTextShadowLayer(2),
          offsetX: 0,
          offsetY: 4,
          blur: 20,
          color: "#FF0000",
          opacity: 0.5,
        },
      ],
      textColor: "#FFF7ED",
      bgColor: "#1C1917",
    },
  },
  {
    id: "neon",
    name: "Неон",
    state: {
      shadows: [
        {
          ...createTextShadowLayer(0),
          offsetX: 0,
          offsetY: 0,
          blur: 4,
          color: "#00FF88",
          opacity: 1,
        },
        {
          ...createTextShadowLayer(1),
          offsetX: 0,
          offsetY: 0,
          blur: 20,
          color: "#00FF88",
          opacity: 0.6,
        },
      ],
      textColor: "#FFFFFF",
      bgColor: "#0A0A0A",
    },
  },
];
