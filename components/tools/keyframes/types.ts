export interface KeyframeStep {
  id: string;
  percent: number;
  translateX: number;
  translateY: number;
  scale: number;
  rotate: number;
  opacity: number;
  backgroundColor: string;
}

export interface KeyframesState {
  name: string;
  duration: number;
  timingFunction: string;
  iterationCount: string;
  steps: KeyframeStep[];
  activeStepId: string | null;
  previewBgColor: string;
  previewElementColor: string;
}

export interface KeyframesPreset {
  id: string;
  name: string;
  state: Partial<KeyframesState>;
}

export const TIMING_FUNCTIONS = [
  { value: "ease", label: "ease" },
  { value: "ease-in", label: "ease-in" },
  { value: "ease-out", label: "ease-out" },
  { value: "ease-in-out", label: "ease-in-out" },
  { value: "linear", label: "linear" },
  { value: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", label: "bounce" },
] as const;

export const ITERATION_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "infinite", label: "infinite" },
] as const;

export function createKeyframeStep(percent: number): KeyframeStep {
  return {
    id: crypto.randomUUID(),
    percent,
    translateX: 0,
    translateY: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    backgroundColor: "#6366F1",
  };
}

export const MAX_KEYFRAME_STEPS = 8;
export const MIN_KEYFRAME_STEPS = 2;

export const defaultKeyframesState: KeyframesState = {
  name: "myAnimation",
  duration: 2,
  timingFunction: "ease-in-out",
  iterationCount: "infinite",
  steps: [
    { ...createKeyframeStep(0), translateX: 0, scale: 1, opacity: 1 },
    { ...createKeyframeStep(50), translateX: 80, scale: 1.2, opacity: 0.8 },
    { ...createKeyframeStep(100), translateX: 0, scale: 1, opacity: 1 },
  ],
  activeStepId: null,
  previewBgColor: "#F4F4F5",
  previewElementColor: "#6366F1",
};
