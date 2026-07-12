import type { CssFilterState } from "./types";
import { defaultCssFilterState } from "./types";

export const CSS_FILTER_STORAGE_KEY = "tool:css-filter";

export function buildCssFilter(state: CssFilterState): string {
  const parts: string[] = [];

  if (state.blur > 0) parts.push(`blur(${state.blur}px)`);
  if (state.brightness !== 100) parts.push(`brightness(${state.brightness}%)`);
  if (state.contrast !== 100) parts.push(`contrast(${state.contrast}%)`);
  if (state.saturate !== 100) parts.push(`saturate(${state.saturate}%)`);
  if (state.grayscale > 0) parts.push(`grayscale(${state.grayscale}%)`);

  return parts.length ? parts.join(" ") : "none";
}

export function buildCssProperty(state: CssFilterState): string {
  return `filter: ${buildCssFilter(state)};`;
}

export function buildCssBlock(
  state: CssFilterState,
  className = "filtered",
): string {
  return `.${className} {\n  filter: ${buildCssFilter(state)};\n}`;
}

export function isCssFilterState(value: unknown): value is CssFilterState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CssFilterState>;

  return (
    typeof candidate.blur === "number" &&
    typeof candidate.brightness === "number" &&
    typeof candidate.contrast === "number" &&
    typeof candidate.saturate === "number" &&
    typeof candidate.grayscale === "number" &&
    typeof candidate.bgColor === "string" &&
    (candidate.previewMode === "image" || candidate.previewMode === "block")
  );
}

export function mergeCssFilterState(
  partial: Partial<CssFilterState>,
): CssFilterState {
  return {
    ...defaultCssFilterState,
    ...partial,
  };
}
