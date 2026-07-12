import type { GridPreset } from "./types";

export const gridPresets: GridPreset[] = [
  {
    id: "three-columns",
    name: "3 колонки",
    state: {
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "auto",
      gap: 12,
    },
  },
  {
    id: "sidebar-main",
    name: "Sidebar + Main",
    state: {
      gridTemplateColumns: "200px 1fr",
      gridTemplateRows: "1fr",
      gap: 16,
      minHeight: 280,
    },
  },
  {
    id: "holy-grail",
    name: "Holy Grail",
    state: {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto 1fr auto",
      gap: 8,
      minHeight: 320,
    },
  },
  {
    id: "masonry",
    name: "Masonry-like",
    state: {
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "auto",
      gridAutoFlow: "row dense",
      gap: 12,
    },
  },
  {
    id: "center",
    name: "Center",
    state: {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
      justifyItems: "center",
      alignItems: "center",
      minHeight: 280,
    },
  },
  {
    id: "dashboard",
    name: "Dashboard",
    state: {
      gridTemplateColumns: "1fr 1fr 1fr",
      gridTemplateRows: "auto 1fr",
      gap: 16,
      minHeight: 320,
    },
  },
];
