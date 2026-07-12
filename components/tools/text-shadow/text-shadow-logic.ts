import { rgbaFromHex } from "@/lib/color";

import type { TextShadowLayer, TextShadowState } from "./types";
import { createTextShadowLayer, defaultTextShadowState } from "./types";

export const TEXT_SHADOW_STORAGE_KEY = "tool:text-shadow";

export { rgbaFromHex };

export function buildTextShadowLayer(layer: TextShadowLayer): string {
  const color = rgbaFromHex(layer.color, layer.opacity);
  return `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${color}`;
}

export function buildTextShadow(state: TextShadowState): string {
  return state.shadows.map(buildTextShadowLayer).join(", ");
}

export function buildCssProperty(state: TextShadowState): string {
  return `text-shadow: ${buildTextShadow(state)};`;
}

export function buildCssBlock(
  state: TextShadowState,
  className = "text-shadow",
): string {
  return `.${className} {\n  text-shadow: ${buildTextShadow(state)};\n}`;
}

function isTextShadowLayer(value: unknown): value is TextShadowLayer {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<TextShadowLayer>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.offsetX === "number" &&
    typeof candidate.offsetY === "number" &&
    typeof candidate.blur === "number" &&
    typeof candidate.color === "string" &&
    typeof candidate.opacity === "number"
  );
}

export function isTextShadowState(value: unknown): value is TextShadowState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<TextShadowState>;

  return (
    Array.isArray(candidate.shadows) &&
    candidate.shadows.every(isTextShadowLayer) &&
    (candidate.activeShadowId === null ||
      typeof candidate.activeShadowId === "string") &&
    typeof candidate.sampleText === "string" &&
    typeof candidate.fontSize === "number" &&
    typeof candidate.textColor === "string" &&
    typeof candidate.bgColor === "string"
  );
}

export function mergeTextShadowState(
  partial: Partial<TextShadowState>,
): TextShadowState {
  const merged = {
    ...defaultTextShadowState,
    ...partial,
  };

  if (!merged.shadows.length) {
    merged.shadows = [createTextShadowLayer(0)];
  }

  if (
    merged.activeShadowId &&
    !merged.shadows.some((layer) => layer.id === merged.activeShadowId)
  ) {
    merged.activeShadowId = merged.shadows[0]?.id ?? null;
  }

  return merged;
}
