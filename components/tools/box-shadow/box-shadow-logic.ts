import { rgbaFromHex } from "@/lib/color";

import type { BoxShadowState } from "./types";
import { defaultBoxShadowState } from "./types";

export const BOX_SHADOW_STORAGE_KEY = "tool:box-shadow";

export { rgbaFromHex };

export function buildBoxShadow(state: BoxShadowState): string {
  const color = rgbaFromHex(state.color, state.opacity);
  const inset = state.inset ? "inset " : "";

  return `${inset}${state.offsetX}px ${state.offsetY}px ${state.blur}px ${state.spread}px ${color}`;
}

export function buildCssProperty(state: BoxShadowState): string {
  return `box-shadow: ${buildBoxShadow(state)};`;
}

export function buildCssBlock(
  state: BoxShadowState,
  className = "shadow",
): string {
  return `.${className} {\n  box-shadow: ${buildBoxShadow(state)};\n}`;
}

export function isBoxShadowState(value: unknown): value is BoxShadowState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<BoxShadowState>;

  return (
    typeof candidate.offsetX === "number" &&
    typeof candidate.offsetY === "number" &&
    typeof candidate.blur === "number" &&
    typeof candidate.spread === "number" &&
    typeof candidate.color === "string" &&
    typeof candidate.opacity === "number" &&
    typeof candidate.inset === "boolean" &&
    typeof candidate.bgColor === "string" &&
    typeof candidate.objectColor === "string" &&
    (candidate.shape === "card" ||
      candidate.shape === "circle" ||
      candidate.shape === "button")
  );
}

export function mergeBoxShadowState(
  partial: Partial<BoxShadowState>,
): BoxShadowState {
  return {
    ...defaultBoxShadowState,
    ...partial,
  };
}
