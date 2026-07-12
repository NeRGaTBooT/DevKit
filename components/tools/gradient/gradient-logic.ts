import { rgbaFromHex } from "@/lib/color";

import type { ColorStop, GradientState } from "./types";
import { defaultGradientState } from "./types";

export const GRADIENT_STORAGE_KEY = "tool:gradient";

export function sortStops(stops: ColorStop[]): ColorStop[] {
  return [...stops].sort((left, right) => left.position - right.position);
}

function formatStop(stop: ColorStop): string {
  const color = rgbaFromHex(stop.color, stop.opacity);
  return `${color} ${Math.round(stop.position)}%`;
}

function buildStopsList(stops: ColorStop[]): string {
  return sortStops(stops).map(formatStop).join(", ");
}

function buildGradientFunction(state: GradientState): string {
  const stops = buildStopsList(state.stops);
  const position = `${state.position.x}% ${state.position.y}%`;

  switch (state.type) {
    case "linear":
      return `linear-gradient(${state.angle}deg, ${stops})`;
    case "radial": {
      const shape =
        state.radialShape === "circle"
          ? `circle ${state.radialSize}`
          : `ellipse ${state.radialSize}`;
      return `radial-gradient(${shape} at ${position}, ${stops})`;
    }
    case "conic":
      return `conic-gradient(from ${state.angle}deg at ${position}, ${stops})`;
  }
}

export function buildGradient(state: GradientState): string {
  const gradient = buildGradientFunction(state);
  return state.repeating ? `repeating-${gradient}` : gradient;
}

export function buildCssProperty(state: GradientState): string {
  return `background: ${buildGradient(state)};`;
}

export function buildCssBlock(
  state: GradientState,
  className = "gradient",
): string {
  return `.${className} {\n  background: ${buildGradient(state)};\n}`;
}

function isColorStop(value: unknown): value is ColorStop {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ColorStop>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.color === "string" &&
    typeof candidate.opacity === "number" &&
    typeof candidate.position === "number"
  );
}

export function isGradientState(value: unknown): value is GradientState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<GradientState>;

  return (
    (candidate.type === "linear" ||
      candidate.type === "radial" ||
      candidate.type === "conic") &&
    typeof candidate.repeating === "boolean" &&
    typeof candidate.angle === "number" &&
    Array.isArray(candidate.stops) &&
    candidate.stops.length >= 2 &&
    candidate.stops.every(isColorStop) &&
    (candidate.radialShape === "circle" || candidate.radialShape === "ellipse") &&
    typeof candidate.radialSize === "string" &&
    !!candidate.position &&
    typeof candidate.position.x === "number" &&
    typeof candidate.position.y === "number" &&
    !!candidate.previewSize &&
    typeof candidate.previewSize.width === "number" &&
    typeof candidate.previewSize.height === "number" &&
    (candidate.previewShape === "rectangle" ||
      candidate.previewShape === "circle" ||
      candidate.previewShape === "full") &&
    typeof candidate.bgColor === "string"
  );
}

export function mergeGradientState(
  partial: Partial<GradientState>,
): GradientState {
  return {
    ...defaultGradientState,
    ...partial,
    position: {
      ...defaultGradientState.position,
      ...partial.position,
    },
    previewSize: {
      ...defaultGradientState.previewSize,
      ...partial.previewSize,
    },
    stops: partial.stops ?? defaultGradientState.stops,
  };
}

export function interpolateStopColor(
  stops: ColorStop[],
  position: number,
): Pick<ColorStop, "color" | "opacity"> {
  const sorted = sortStops(stops);
  const clamped = Math.max(0, Math.min(100, position));

  if (clamped <= sorted[0].position) {
    return { color: sorted[0].color, opacity: sorted[0].opacity };
  }

  const last = sorted[sorted.length - 1];
  if (clamped >= last.position) {
    return { color: last.color, opacity: last.opacity };
  }

  const nextIndex = sorted.findIndex((stop) => stop.position > clamped);
  const right = sorted[nextIndex];
  const left = sorted[nextIndex - 1];
  const range = right.position - left.position;
  const ratio = range === 0 ? 0 : (clamped - left.position) / range;

  return {
    color: left.color,
    opacity: left.opacity + (right.opacity - left.opacity) * ratio,
  };
}
