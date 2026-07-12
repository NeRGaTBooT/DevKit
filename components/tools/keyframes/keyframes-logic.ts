import type { KeyframeStep, KeyframesState } from "./types";
import {
  createKeyframeStep,
  defaultKeyframesState,
  MAX_KEYFRAME_STEPS,
} from "./types";

export const KEYFRAMES_STORAGE_KEY = "tool:keyframes";

export const PREVIEW_ANIMATION_NAME = "devkit-keyframes-preview";

export function buildTransform(step: KeyframeStep): string {
  const parts: string[] = [];

  if (step.translateX !== 0 || step.translateY !== 0) {
    parts.push(`translate(${step.translateX}px, ${step.translateY}px)`);
  }

  if (step.scale !== 1) {
    parts.push(`scale(${step.scale})`);
  }

  if (step.rotate !== 0) {
    parts.push(`rotate(${step.rotate}deg)`);
  }

  return parts.length ? parts.join(" ") : "none";
}

export function buildStepProperties(step: KeyframeStep): string {
  const lines: string[] = [];
  const transform = buildTransform(step);

  if (transform !== "none") {
    lines.push(`    transform: ${transform};`);
  }

  if (step.opacity !== 1) {
    lines.push(`    opacity: ${step.opacity};`);
  }

  if (step.backgroundColor) {
    lines.push(`    background-color: ${step.backgroundColor};`);
  }

  return lines.join("\n");
}

export function buildKeyframesBlock(state: KeyframesState): string {
  const sortedSteps = [...state.steps].sort((a, b) => a.percent - b.percent);
  const name = sanitizeAnimationName(state.name);

  const stepBlocks = sortedSteps
    .map((step) => {
      const props = buildStepProperties(step);
      return `  ${step.percent}% {\n${props || "    /* no properties */"}\n  }`;
    })
    .join("\n");

  return `@keyframes ${name} {\n${stepBlocks}\n}`;
}

export function buildAnimationProperty(state: KeyframesState): string {
  const name = sanitizeAnimationName(state.name);
  return `animation: ${name} ${state.duration}s ${state.timingFunction} ${state.iterationCount};`;
}

export function buildFullCssBlock(state: KeyframesState): string {
  const name = sanitizeAnimationName(state.name);
  const keyframes = buildKeyframesBlock(state);
  const animation = buildAnimationProperty(state);

  return `${keyframes}\n\n.${name} {\n  ${animation}\n}`;
}

export function sanitizeAnimationName(name: string): string {
  const sanitized = name.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return sanitized || "myAnimation";
}

export function isKeyframeStep(value: unknown): value is KeyframeStep {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<KeyframeStep>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.percent === "number" &&
    typeof candidate.translateX === "number" &&
    typeof candidate.translateY === "number" &&
    typeof candidate.scale === "number" &&
    typeof candidate.rotate === "number" &&
    typeof candidate.opacity === "number" &&
    typeof candidate.backgroundColor === "string"
  );
}

export function isKeyframesState(value: unknown): value is KeyframesState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<KeyframesState>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.duration === "number" &&
    typeof candidate.timingFunction === "string" &&
    typeof candidate.iterationCount === "string" &&
    Array.isArray(candidate.steps) &&
    candidate.steps.every(isKeyframeStep) &&
    (candidate.activeStepId === null ||
      typeof candidate.activeStepId === "string") &&
    typeof candidate.previewBgColor === "string" &&
    typeof candidate.previewElementColor === "string"
  );
}

export function mergeKeyframesState(
  partial: Partial<KeyframesState>,
): KeyframesState {
  const merged = {
    ...defaultKeyframesState,
    ...partial,
  };

  if (merged.steps.length < 2) {
    merged.steps = defaultKeyframesState.steps.map((step) => ({ ...step }));
  }

  if (merged.steps.length > MAX_KEYFRAME_STEPS) {
    merged.steps = merged.steps.slice(0, MAX_KEYFRAME_STEPS);
  }

  merged.steps = [...merged.steps].sort((a, b) => a.percent - b.percent);

  if (
    merged.activeStepId &&
    !merged.steps.some((step) => step.id === merged.activeStepId)
  ) {
    merged.activeStepId = merged.steps[0]?.id ?? null;
  }

  return merged;
}

export function buildPreviewKeyframesCss(state: KeyframesState): string {
  const sortedSteps = [...state.steps].sort((a, b) => a.percent - b.percent);

  const stepBlocks = sortedSteps
    .map((step) => {
      const props = buildStepProperties(step);
      return `  ${step.percent}% {\n${props || "    transform: none;"}\n  }`;
    })
    .join("\n");

  return `@keyframes ${PREVIEW_ANIMATION_NAME} {\n${stepBlocks}\n}`;
}

export function buildPreviewAnimationStyle(state: KeyframesState): string {
  return `${PREVIEW_ANIMATION_NAME} ${state.duration}s ${state.timingFunction} ${state.iterationCount}`;
}
