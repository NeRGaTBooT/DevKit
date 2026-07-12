export type FlexDirection =
  | "row"
  | "row-reverse"
  | "column"
  | "column-reverse";

export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

export type AlignItems =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";

export type AlignContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around";

export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export type AlignSelf =
  | "auto"
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";

export interface FlexItem {
  id: string;
  label: string;
  flexGrow: number;
  flexShrink: number;
  flexBasis: number;
  flexBasisAuto: boolean;
  alignSelf: AlignSelf;
  order: number;
  width: number | null;
  height: number | null;
  bgColor: string;
}

export interface FlexboxState {
  flexDirection: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  alignContent: AlignContent;
  flexWrap: FlexWrap;
  gap: number;
  padding: number;
  minHeight: number;
  bgColor: string;
  containerBgColor: string;
  items: FlexItem[];
  selectedItemId: string | null;
}

export interface FlexboxPreset {
  id: string;
  name: string;
  state: Partial<FlexboxState>;
}

const defaultItemColors = ["#6366F1", "#EC4899", "#14B8A6", "#F59E0B", "#8B5CF6", "#EF4444", "#22C55E", "#3B82F6"];

export function createFlexItem(index: number, overrides?: Partial<FlexItem>): FlexItem {
  return {
    id: crypto.randomUUID(),
    label: String(index + 1),
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 80,
    flexBasisAuto: true,
    alignSelf: "auto",
    order: 0,
    width: null,
    height: null,
    bgColor: defaultItemColors[index % defaultItemColors.length],
    ...overrides,
  };
}

export const defaultFlexItems: FlexItem[] = [
  createFlexItem(0),
  createFlexItem(1),
  createFlexItem(2),
];

export const defaultFlexboxState: FlexboxState = {
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  alignContent: "stretch",
  flexWrap: "nowrap",
  gap: 12,
  padding: 16,
  minHeight: 240,
  bgColor: "#FFFFFF",
  containerBgColor: "#F4F4F5",
  items: defaultFlexItems,
  selectedItemId: null,
};

export const MIN_FLEX_ITEMS = 2;
export const MAX_FLEX_ITEMS = 8;
