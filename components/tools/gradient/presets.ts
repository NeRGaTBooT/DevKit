import type { GradientPreset } from "./types";
import { createColorStop } from "./types";

export const gradientPresets: GradientPreset[] = [
  {
    id: "sunset",
    name: "Sunset",
    state: {
      type: "linear",
      angle: 135,
      stops: [
        createColorStop("#FF512F", 0),
        createColorStop("#F09819", 50),
        createColorStop("#DD2476", 100),
      ],
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    state: {
      type: "linear",
      angle: 180,
      stops: [
        createColorStop("#2193B0", 0),
        createColorStop("#6DD5ED", 100),
      ],
    },
  },
  {
    id: "purple-haze",
    name: "Purple Haze",
    state: {
      type: "linear",
      angle: 45,
      stops: [
        createColorStop("#7303C0", 0),
        createColorStop("#EC38BC", 50),
        createColorStop("#FDEFF9", 100),
      ],
    },
  },
  {
    id: "mint",
    name: "Mint",
    state: {
      type: "linear",
      angle: 90,
      stops: [
        createColorStop("#00B09B", 0),
        createColorStop("#96C93D", 100),
      ],
    },
  },
  {
    id: "fire",
    name: "Fire",
    state: {
      type: "linear",
      angle: 0,
      stops: [
        createColorStop("#F12711", 0),
        createColorStop("#F5AF19", 100),
      ],
    },
  },
  {
    id: "neon",
    name: "Neon",
    state: {
      type: "linear",
      angle: 120,
      repeating: true,
      stops: [
        createColorStop("#00F5A0", 0),
        createColorStop("#00D9F5", 25),
        createColorStop("#7B2FF7", 50),
        createColorStop("#F107A3", 75),
        createColorStop("#00F5A0", 100),
      ],
    },
  },
  {
    id: "pastel",
    name: "Pastel",
    state: {
      type: "linear",
      angle: 160,
      stops: [
        createColorStop("#FFDEE9", 0),
        createColorStop("#B5FFFC", 100),
      ],
    },
  },
  {
    id: "dark-mesh",
    name: "Dark Mesh",
    state: {
      type: "radial",
      radialShape: "ellipse",
      radialSize: "farthest-corner",
      position: { x: 20, y: 20 },
      stops: [
        createColorStop("#0F0C29", 0),
        createColorStop("#302B63", 50),
        createColorStop("#24243E", 100),
      ],
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    state: {
      type: "conic",
      angle: 0,
      position: { x: 50, y: 50 },
      stops: [
        createColorStop("#4158D0", 0),
        createColorStop("#C850C0", 33),
        createColorStop("#FFCC70", 66),
        createColorStop("#4158D0", 100),
      ],
    },
  },
  {
    id: "instagram",
    name: "Instagram",
    state: {
      type: "linear",
      angle: 45,
      stops: [
        createColorStop("#F58529", 0),
        createColorStop("#DD2A7B", 50),
        createColorStop("#8134AF", 100),
      ],
    },
  },
];
