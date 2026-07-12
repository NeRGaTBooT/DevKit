"use client";

import { memo } from "react";

import { buildTextShadow } from "@/components/tools/text-shadow/text-shadow-logic";
import type { TextShadowState } from "@/components/tools/text-shadow/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<TextShadowState>();
  const textShadow = buildTextShadow(state);

  return (
    <section
      aria-label="Предпросмотр"
      className={cn(
        "flex h-full min-h-64 items-center justify-center rounded-xl border border-border p-6",
        className,
      )}
      style={{ backgroundColor: state.bgColor }}
    >
      <p
        className="select-none text-center font-bold leading-tight"
        style={{
          color: state.textColor,
          fontSize: `${state.fontSize}px`,
          textShadow,
        }}
      >
        {state.sampleText || "Text Shadow"}
      </p>
    </section>
  );
});
