import type { CSSProperties } from "react";

import type { FlexboxState, FlexItem } from "./types";
import { defaultFlexboxState } from "./types";

export const FLEXBOX_STORAGE_KEY = "tool:flexbox";

function formatFlexBasis(item: FlexItem): string {
  if (item.flexBasisAuto) return "auto";
  return `${item.flexBasis}px`;
}

function formatOptionalSize(value: number | null, suffix = "px"): string | undefined {
  if (value === null) return undefined;
  return `${value}${suffix}`;
}

export function buildContainerStyles(state: FlexboxState): CSSProperties {
  return {
    display: "flex",
    flexDirection: state.flexDirection,
    justifyContent: state.justifyContent,
    alignItems: state.alignItems,
    alignContent: state.alignContent,
    flexWrap: state.flexWrap,
    gap: `${state.gap}px`,
    padding: `${state.padding}px`,
    minHeight: `${state.minHeight}px`,
    backgroundColor: state.bgColor,
  };
}

export function buildItemStyles(item: FlexItem): CSSProperties {
  const styles: CSSProperties = {
    flexGrow: item.flexGrow,
    flexShrink: item.flexShrink,
    flexBasis: formatFlexBasis(item),
    alignSelf: item.alignSelf === "auto" ? undefined : item.alignSelf,
    order: item.order === 0 ? undefined : item.order,
    backgroundColor: item.bgColor,
  };

  const width = formatOptionalSize(item.width);
  const height = formatOptionalSize(item.height);

  if (width) styles.width = width;
  if (height) styles.height = height;

  return styles;
}

function buildContainerProperties(state: FlexboxState): string[] {
  return [
    "display: flex;",
    `flex-direction: ${state.flexDirection};`,
    `justify-content: ${state.justifyContent};`,
    `align-items: ${state.alignItems};`,
    `align-content: ${state.alignContent};`,
    `flex-wrap: ${state.flexWrap};`,
    `gap: ${state.gap}px;`,
    `padding: ${state.padding}px;`,
    `min-height: ${state.minHeight}px;`,
    `background-color: ${state.bgColor};`,
  ];
}

export function buildContainerCss(state: FlexboxState, className = "container"): string {
  const properties = buildContainerProperties(state)
    .map((line) => `  ${line}`)
    .join("\n");

  return `.${className} {\n${properties}\n}`;
}

export function buildItemsCss(state: FlexboxState): string {
  return state.items
    .map((item, index) => {
      const properties = [
        `flex-grow: ${item.flexGrow};`,
        `flex-shrink: ${item.flexShrink};`,
        `flex-basis: ${formatFlexBasis(item)};`,
      ];

      if (item.alignSelf !== "auto") {
        properties.push(`align-self: ${item.alignSelf};`);
      }

      if (item.order !== 0) {
        properties.push(`order: ${item.order};`);
      }

      const width = formatOptionalSize(item.width);
      const height = formatOptionalSize(item.height);

      if (width) properties.push(`width: ${width};`);
      if (height) properties.push(`height: ${height};`);

      properties.push(`background-color: ${item.bgColor};`);

      return `.item-${index + 1} {\n  ${properties.join("\n  ")}\n}`;
    })
    .join("\n\n");
}

export function buildFullCssBlock(state: FlexboxState): string {
  return `${buildContainerCss(state)}\n\n${buildItemsCss(state)}`;
}

function isFlexItem(value: unknown): value is FlexItem {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<FlexItem>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.flexGrow === "number" &&
    typeof candidate.flexShrink === "number" &&
    typeof candidate.flexBasis === "number" &&
    typeof candidate.flexBasisAuto === "boolean" &&
    typeof candidate.alignSelf === "string" &&
    typeof candidate.order === "number" &&
    (candidate.width === null || typeof candidate.width === "number") &&
    (candidate.height === null || typeof candidate.height === "number") &&
    typeof candidate.bgColor === "string"
  );
}

export function isFlexboxState(value: unknown): value is FlexboxState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<FlexboxState>;

  return (
    typeof candidate.flexDirection === "string" &&
    typeof candidate.justifyContent === "string" &&
    typeof candidate.alignItems === "string" &&
    typeof candidate.alignContent === "string" &&
    typeof candidate.flexWrap === "string" &&
    typeof candidate.gap === "number" &&
    typeof candidate.padding === "number" &&
    typeof candidate.minHeight === "number" &&
    typeof candidate.bgColor === "string" &&
    typeof candidate.containerBgColor === "string" &&
    Array.isArray(candidate.items) &&
    candidate.items.length >= 2 &&
    candidate.items.every(isFlexItem) &&
    (candidate.selectedItemId === null ||
      typeof candidate.selectedItemId === "string")
  );
}

export function mergeFlexboxState(partial: Partial<FlexboxState>): FlexboxState {
  return {
    ...defaultFlexboxState,
    ...partial,
    items: partial.items ?? defaultFlexboxState.items,
  };
}
