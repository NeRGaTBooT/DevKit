"use client";

import { memo } from "react";

import {
  buildPreviewAnimationStyle,
  buildPreviewKeyframesCss,
} from "@/components/tools/keyframes/keyframes-logic";
import type { KeyframesState } from "@/components/tools/keyframes/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<KeyframesState>();
  const keyframesCss = buildPreviewKeyframesCss(state);
  const animation = buildPreviewAnimationStyle(state);
  const initialStep = [...state.steps].sort((a, b) => a.percent - b.percent)[0];

  return (
    <section
      aria-label="Предпросмотр"
      className={cn(
        "relative flex h-full min-h-64 items-center justify-center overflow-hidden rounded-xl border border-border p-6",
        className,
      )}
      style={{ backgroundColor: state.previewBgColor }}
    >
      <style>{keyframesCss}</style>
      <div
        className="size-20 rounded-xl shadow-lg"
        style={{
          backgroundColor:
            initialStep?.backgroundColor ?? state.previewElementColor,
          animation,
        }}
      />
    </section>
  );
});
