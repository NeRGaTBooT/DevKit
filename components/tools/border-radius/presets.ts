import type { BorderRadiusPreset } from "./types";

export const borderRadiusPresets: BorderRadiusPreset[] = [
  {
    id: "pill",
    name: "Pill",
    state: {
      unified: true,
      elliptical: false,
      corners: {
        topLeft: 100,
        topRight: 100,
        bottomRight: 100,
        bottomLeft: 100,
      },
    },
  },
  {
    id: "card",
    name: "Card",
    state: {
      unified: true,
      elliptical: false,
      corners: {
        topLeft: 16,
        topRight: 16,
        bottomRight: 16,
        bottomLeft: 16,
      },
    },
  },
  {
    id: "blob",
    name: "Blob",
    state: {
      unified: false,
      elliptical: true,
      corners: {
        topLeft: 8,
        topRight: 40,
        bottomRight: 8,
        bottomLeft: 40,
      },
    },
  },
];
