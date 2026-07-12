export type JustifyItems =
  | "start"
  | "end"
  | "center"
  | "stretch";

export type AlignItems =
  | "start"
  | "end"
  | "center"
  | "stretch";

export type GridAutoFlow = "row" | "column" | "row dense" | "column dense";

export interface GridItem {
  id: string;
  label: string;
  bgColor: string;
}

export interface GridState {
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gap: number;
  justifyItems: JustifyItems;
  alignItems: AlignItems;
  gridAutoFlow: GridAutoFlow;
  padding: number;
  minHeight: number;
  bgColor: string;
  containerBgColor: string;
  items: GridItem[];
  selectedItemId: string | null;
}

export interface GridPreset {
  id: string;
  name: string;
  state: Partial<GridState>;
}

const defaultItemColors = [
  "#6366F1",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
];

export function createGridItem(index: number, overrides?: Partial<GridItem>): GridItem {
  return {
    id: crypto.randomUUID(),
    label: String(index + 1),
    bgColor: defaultItemColors[index % defaultItemColors.length],
    ...overrides,
  };
}

export const defaultGridItems: GridItem[] = [
  createGridItem(0),
  createGridItem(1),
  createGridItem(2),
  createGridItem(3),
  createGridItem(4),
  createGridItem(5),
];

export const defaultGridState: GridState = {
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  gap: 12,
  justifyItems: "stretch",
  alignItems: "stretch",
  gridAutoFlow: "row",
  padding: 16,
  minHeight: 280,
  bgColor: "#FFFFFF",
  containerBgColor: "#F4F4F5",
  items: defaultGridItems,
  selectedItemId: null,
};

export const MIN_GRID_ITEMS = 3;
export const MAX_GRID_ITEMS = 12;
