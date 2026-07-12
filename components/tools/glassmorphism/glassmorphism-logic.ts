import type { CSSProperties } from "react";

import { rgbaFromHex } from "@/lib/color";

import type { GlassmorphismState } from "./types";
import { defaultGlassmorphismState } from "./types";

export const GLASSMORPHISM_STORAGE_KEY = "tool:glassmorphism";

function buildBackground(state: GlassmorphismState): string {
  return rgbaFromHex(state.tintColor, state.opacity);
}

function buildBorder(state: GlassmorphismState): string {
  const color = rgbaFromHex(state.borderColor, state.borderOpacity);
  return `${state.borderWidth}px solid ${color}`;
}

function buildOuterShadow(state: GlassmorphismState): string {
  const depth = state.shadowDepth;
  return `0 ${Math.round(depth * 0.8)}px ${depth * 3}px rgba(0, 0, 0, 0.1)`;
}

function buildInsetShadow(state: GlassmorphismState): string {
  const highlight = rgbaFromHex(state.highlightColor, state.highlightOpacity);
  const subtle = rgbaFromHex(state.highlightColor, state.highlightOpacity * 0.2);
  const bottom = rgbaFromHex(state.highlightColor, state.highlightOpacity * 0.1);

  return [
    `inset 0 1px 0 ${highlight}`,
    `inset 0 -1px 0 ${bottom}`,
    `inset 0 0 20px 10px ${subtle}`,
  ].join(", ");
}

function buildBoxShadow(state: GlassmorphismState, includeHighlights: boolean): string {
  const outer = buildOuterShadow(state);

  if (!includeHighlights || !state.highlights) {
    return outer;
  }

  return `${outer}, ${buildInsetShadow(state)}`;
}

function buildBackdropFilter(state: GlassmorphismState): string {
  return state.blur > 0 ? `blur(${state.blur}px)` : "none";
}

export function buildGlassInlineStyles(state: GlassmorphismState): CSSProperties {
  const backdropFilter = buildBackdropFilter(state);

  return {
    background: buildBackground(state),
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    borderRadius: `${state.borderRadius}px`,
    border: buildBorder(state),
    boxShadow: buildBoxShadow(state, true),
    position: "relative",
    overflow: "hidden",
  };
}

function buildBaseProperties(state: GlassmorphismState, includeHighlights: boolean): string[] {
  const backdropFilter = buildBackdropFilter(state);
  const lines = [
    `background: ${buildBackground(state)};`,
    `backdrop-filter: ${backdropFilter};`,
    `-webkit-backdrop-filter: ${backdropFilter};`,
    `border-radius: ${state.borderRadius}px;`,
    `border: ${buildBorder(state)};`,
    `box-shadow: ${buildBoxShadow(state, includeHighlights)};`,
  ];

  if (includeHighlights && state.highlights) {
    lines.push("position: relative;", "overflow: hidden;");
  }

  return lines;
}

export function buildCssProperty(state: GlassmorphismState): string {
  return buildBaseProperties(state, false).join("\n");
}

export function buildSimpleCssBlock(
  state: GlassmorphismState,
  className = "glass",
): string {
  const lines = buildBaseProperties(state, false);
  return `.${className} {\n  ${lines.join("\n  ")}\n}`;
}

export function buildFullCssBlock(
  state: GlassmorphismState,
  className = "glass",
): string {
  const lines = buildBaseProperties(state, true);
  let block = `.${className} {\n  ${lines.join("\n  ")}\n}`;

  if (state.highlights) {
    const highlightStrong = rgbaFromHex(
      state.highlightColor,
      Math.min(state.highlightOpacity * 1.6, 1),
    );
    const highlightMid = rgbaFromHex(
      state.highlightColor,
      state.highlightOpacity * 0.6,
    );

    block += `\n\n.${className}::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 1px;\n  background: linear-gradient(\n    90deg,\n    transparent,\n    ${highlightStrong},\n    transparent\n  );\n}`;

    block += `\n\n.${className}::after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 1px;\n  height: 100%;\n  background: linear-gradient(\n    180deg,\n    ${highlightStrong},\n    transparent,\n    ${highlightMid}\n  );\n}`;
  }

  return block;
}

export function isGlassmorphismState(value: unknown): value is GlassmorphismState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<GlassmorphismState>;

  return (
    typeof candidate.blur === "number" &&
    typeof candidate.opacity === "number" &&
    typeof candidate.tintColor === "string" &&
    typeof candidate.highlightColor === "string" &&
    typeof candidate.highlightOpacity === "number" &&
    typeof candidate.borderWidth === "number" &&
    typeof candidate.borderColor === "string" &&
    typeof candidate.borderOpacity === "number" &&
    typeof candidate.borderRadius === "number" &&
    typeof candidate.shadowDepth === "number" &&
    typeof candidate.highlights === "boolean" &&
    (candidate.bgPreset === "gradient" ||
      candidate.bgPreset === "image" ||
      candidate.bgPreset === "dark")
  );
}

export function mergeGlassmorphismState(
  partial: Partial<GlassmorphismState>,
): GlassmorphismState {
  return {
    ...defaultGlassmorphismState,
    ...partial,
  };
}
