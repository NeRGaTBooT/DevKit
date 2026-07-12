import type { BorderRadiusState, CornerRadii } from "./types";
import { defaultBorderRadiusState } from "./types";

export const BORDER_RADIUS_STORAGE_KEY = "tool:border-radius";

function formatPx(value: number): string {
  return `${value}px`;
}

function getVerticalRadii(corners: CornerRadii): CornerRadii {
  return {
    topLeft: corners.topRight,
    topRight: corners.topLeft,
    bottomRight: corners.bottomLeft,
    bottomLeft: corners.bottomRight,
  };
}

function formatCornerSet(corners: CornerRadii): string {
  const { topLeft, topRight, bottomRight, bottomLeft } = corners;

  if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
    return formatPx(topLeft);
  }

  if (topLeft === bottomRight && topRight === bottomLeft) {
    return `${formatPx(topLeft)} ${formatPx(topRight)}`;
  }

  return `${formatPx(topLeft)} ${formatPx(topRight)} ${formatPx(bottomRight)} ${formatPx(bottomLeft)}`;
}

export function buildBorderRadius(state: BorderRadiusState): string {
  const horizontal = formatCornerSet(state.corners);

  if (!state.elliptical) {
    return horizontal;
  }

  const vertical = formatCornerSet(getVerticalRadii(state.corners));

  if (horizontal === vertical) {
    return horizontal;
  }

  return `${horizontal} / ${vertical}`;
}

export function buildCssProperty(state: BorderRadiusState): string {
  return `border-radius: ${buildBorderRadius(state)};`;
}

export function buildCssBlock(
  state: BorderRadiusState,
  className = "rounded",
): string {
  return `.${className} {\n  border-radius: ${buildBorderRadius(state)};\n}`;
}

export function isBorderRadiusState(value: unknown): value is BorderRadiusState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<BorderRadiusState>;

  if (
    typeof candidate.unified !== "boolean" ||
    typeof candidate.elliptical !== "boolean" ||
    typeof candidate.bgColor !== "string" ||
    typeof candidate.objectColor !== "string"
  ) {
    return false;
  }

  const corners = candidate.corners;

  if (!corners || typeof corners !== "object") return false;

  const cornerCandidate = corners as Partial<CornerRadii>;

  return (
    typeof cornerCandidate.topLeft === "number" &&
    typeof cornerCandidate.topRight === "number" &&
    typeof cornerCandidate.bottomRight === "number" &&
    typeof cornerCandidate.bottomLeft === "number"
  );
}

export function mergeBorderRadiusState(
  partial: Partial<BorderRadiusState>,
): BorderRadiusState {
  return {
    ...defaultBorderRadiusState,
    ...partial,
    corners: {
      ...defaultBorderRadiusState.corners,
      ...partial.corners,
    },
  };
}
