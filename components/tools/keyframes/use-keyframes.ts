"use client";

import { useCallback, useEffect, useState } from "react";

import {
  KEYFRAMES_STORAGE_KEY,
  isKeyframesState,
  mergeKeyframesState,
} from "@/components/tools/keyframes/keyframes-logic";
import type {
  KeyframeStep,
  KeyframesPreset,
  KeyframesState,
} from "@/components/tools/keyframes/types";
import {
  MAX_KEYFRAME_STEPS,
  MIN_KEYFRAME_STEPS,
  createKeyframeStep,
  defaultKeyframesState,
} from "@/components/tools/keyframes/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export {
  buildKeyframesBlock,
  buildAnimationProperty,
  buildFullCssBlock,
  buildPreviewKeyframesCss,
  buildPreviewAnimationStyle,
} from "@/components/tools/keyframes/keyframes-logic";

export function useKeyframes() {
  const [state, setState] = useState<KeyframesState>(defaultKeyframesState);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage on mount */
  useEffect(() => {
    const saved = getStorageItem<unknown>(KEYFRAMES_STORAGE_KEY);

    if (isKeyframesState(saved)) {
      setState(mergeKeyframesState(saved));
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      setStorageItem(KEYFRAMES_STORAGE_KEY, state);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<KeyframesState>) => {
    setState((current) => mergeKeyframesState({ ...current, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultKeyframesState);
  }, []);

  const applyPreset = useCallback((preset: KeyframesPreset) => {
    setState((current) =>
      mergeKeyframesState({ ...current, ...preset.state }),
    );
  }, []);

  const selectStep = useCallback((id: string | null) => {
    setState((current) => ({ ...current, activeStepId: id }));
  }, []);

  const addStep = useCallback(() => {
    setState((current) => {
      if (current.steps.length >= MAX_KEYFRAME_STEPS) return current;

      const sorted = [...current.steps].sort((a, b) => a.percent - b.percent);
      const lastPercent = sorted[sorted.length - 1]?.percent ?? 0;
      const newPercent = Math.min(lastPercent + 25, 99);
      const newStep = createKeyframeStep(newPercent);

      return mergeKeyframesState({
        ...current,
        steps: [...current.steps, newStep],
        activeStepId: newStep.id,
      });
    });
  }, []);

  const removeStep = useCallback((id: string) => {
    setState((current) => {
      if (current.steps.length <= MIN_KEYFRAME_STEPS) return current;

      const steps = current.steps.filter((step) => step.id !== id);

      return mergeKeyframesState({
        ...current,
        steps,
        activeStepId:
          current.activeStepId === id
            ? (steps[0]?.id ?? null)
            : current.activeStepId,
      });
    });
  }, []);

  const updateStep = useCallback(
    (id: string, partial: Partial<KeyframeStep>) => {
      setState((current) =>
        mergeKeyframesState({
          ...current,
          steps: current.steps.map((step) =>
            step.id === id ? { ...step, ...partial } : step,
          ),
        }),
      );
    },
    [],
  );

  const activeStep =
    state.steps.find((step) => step.id === state.activeStepId) ??
    state.steps[0] ??
    null;

  return {
    state,
    activeStep,
    update,
    reset,
    applyPreset,
    selectStep,
    addStep,
    removeStep,
    updateStep,
    hydrated,
  };
}
