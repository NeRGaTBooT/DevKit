"use client";

import { memo } from "react";

import { buildGradient } from "@/components/tools/gradient/gradient-logic";
import type { GradientState } from "@/components/tools/gradient/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

const shapeClassNames: Record<GradientState["previewShape"], string> = {
  rectangle: "rounded-xl",
  circle: "rounded-full aspect-square",
  full: "w-full rounded-xl",
};

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<GradientState>();
  const gradient = buildGradient(state);
  const isFull = state.previewShape === "full";

  return (
    <section
      aria-label="Предпросмотр"
      className={cn(
        "flex h-full min-h-64 items-center justify-center rounded-xl border border-border p-6",
        className,
      )}
      style={{ backgroundColor: state.bgColor }}
    >
      <div
        className={cn(
          "border border-border/50 shadow-sm",
          shapeClassNames[state.previewShape],
        )}
        style={{
          background: gradient,
          width: isFull ? "100%" : state.previewSize.width,
          height: isFull ? 200 : state.previewSize.height,
          maxWidth: "100%",
        }}
      />
    </section>
  );
});
