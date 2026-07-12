"use client";

import { memo } from "react";

import { buildBorderRadius } from "@/components/tools/border-radius/border-radius-logic";
import type { BorderRadiusState } from "@/components/tools/border-radius/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<BorderRadiusState>();
  const borderRadius = buildBorderRadius(state);

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
        className="flex h-40 w-56 items-center justify-center"
        style={{
          backgroundColor: state.objectColor,
          borderRadius,
        }}
      >
        <span className="text-sm font-medium text-foreground/60">Preview</span>
      </div>
    </section>
  );
});
