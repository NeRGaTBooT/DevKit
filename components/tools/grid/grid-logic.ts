import type { CSSProperties } from "react";

import type { GridItem, GridState } from "./types";
import { defaultGridState } from "./types";

export const GRID_STORAGE_KEY = "tool:grid";

export function buildContainerStyles(state: GridState): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: state.gridTemplateColumns,
    gridTemplateRows: state.gridTemplateRows,
    gap: `${state.gap}px`,
    justifyItems: state.justifyItems,
    alignItems: state.alignItems,
    gridAutoFlow: state.gridAutoFlow,
    padding: `${state.padding}px`,
    minHeight: `${state.minHeight}px`,
    backgroundColor: state.bgColor,
    width: "100%",
  };
}

export function buildItemStyles(item: GridItem): CSSProperties {
  return {
    backgroundColor: item.bgColor,
  };
}

function buildContainerProperties(state: GridState): string[] {
  return [
    "display: grid;",
    `grid-template-columns: ${state.gridTemplateColumns};`,
    `grid-template-rows: ${state.gridTemplateRows};`,
    `gap: ${state.gap}px;`,
    `justify-items: ${state.justifyItems};`,
    `align-items: ${state.alignItems};`,
    `grid-auto-flow: ${state.gridAutoFlow};`,
    `padding: ${state.padding}px;`,
    `min-height: ${state.minHeight}px;`,
    `background-color: ${state.bgColor};`,
  ];
}

export function buildContainerCss(state: GridState, className = "grid-container"): string {
  const properties = buildContainerProperties(state)
    .map((line) => `  ${line}`)
    .join("\n");

  return `.${className} {\n${properties}\n}`;
}

export function buildItemsCss(state: GridState): string {
  return state.items
    .map((item, index) => {
      return `.grid-item-${index + 1} {\n  background-color: ${item.bgColor};\n}`;
    })
    .join("\n\n");
}

export function buildFullCssBlock(state: GridState): string {
  return `${buildContainerCss(state)}\n\n${buildItemsCss(state)}`;
}

function isGridItem(value: unknown): value is GridItem {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<GridItem>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.bgColor === "string"
  );
}

export function isGridState(value: unknown): value is GridState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<GridState>;

  return (
    typeof candidate.gridTemplateColumns === "string" &&
    typeof candidate.gridTemplateRows === "string" &&
    typeof candidate.gap === "number" &&
    typeof candidate.justifyItems === "string" &&
    typeof candidate.alignItems === "string" &&
    typeof candidate.gridAutoFlow === "string" &&
    typeof candidate.padding === "number" &&
    typeof candidate.minHeight === "number" &&
    typeof candidate.bgColor === "string" &&
    typeof candidate.containerBgColor === "string" &&
    Array.isArray(candidate.items) &&
    candidate.items.length >= 3 &&
    candidate.items.every(isGridItem) &&
    (candidate.selectedItemId === null ||
      typeof candidate.selectedItemId === "string")
  );
}

export function mergeGridState(partial: Partial<GridState>): GridState {
  return {
    ...defaultGridState,
    ...partial,
    items: partial.items ?? defaultGridState.items,
  };
}
