"use client";

import { memo } from "react";

import { buildBoxShadow } from "@/components/tools/box-shadow/box-shadow-logic";
import type { BoxShadowState } from "@/components/tools/box-shadow/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

const shapeClassNames: Record<BoxShadowState["shape"], string> = {
  card: "h-40 w-56 rounded-xl",
  circle: "size-40 rounded-full",
  button: "rounded-md px-8 py-3",
};

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<BoxShadowState>();
  const boxShadow = buildBoxShadow(state);

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
          "flex items-center justify-center",
          shapeClassNames[state.shape],
          state.shape === "button" && "min-w-32",
        )}
        style={{
          backgroundColor: state.objectColor,
          boxShadow,
        }}
      >
        {state.shape === "button" && (
          <span className="text-sm font-medium text-foreground/80">Button</span>
        )}
      </div>
    </section>
  );
});
