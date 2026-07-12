import type { FlexboxPreset } from "./types";

export const flexboxPresets: FlexboxPreset[] = [
  {
    id: "center",
    name: "Center",
    state: {
      justifyContent: "center",
      alignItems: "center",
      minHeight: 280,
    },
  },
  {
    id: "space-between",
    name: "Space Between",
    state: {
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
    },
  },
  {
    id: "column-stack",
    name: "Column Stack",
    state: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 16,
    },
  },
  {
    id: "sidebar",
    name: "Sidebar",
    state: {
      justifyContent: "flex-start",
      alignItems: "stretch",
      gap: 16,
      items: undefined,
    },
  },
  {
    id: "holy-grail",
    name: "Holy Grail",
    state: {
      flexDirection: "column",
      minHeight: 320,
      gap: 8,
    },
  },
  {
    id: "navbar",
    name: "Navbar",
    state: {
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      minHeight: 72,
    },
  },
  {
    id: "card-row",
    name: "Card Row",
    state: {
      flexWrap: "wrap",
      gap: 16,
      alignItems: "stretch",
    },
  },
  {
    id: "footer-stick",
    name: "Footer Stick",
    state: {
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: 320,
    },
  },
  {
    id: "equal-columns",
    name: "Equal Columns",
    state: {
      flexWrap: "nowrap",
      gap: 12,
    },
  },
];
