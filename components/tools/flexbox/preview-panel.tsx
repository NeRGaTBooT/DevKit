"use client";

import { memo } from "react";

import {
  buildContainerStyles,
  buildItemStyles,
} from "@/components/tools/flexbox/flexbox-logic";
import type { FlexboxState } from "@/components/tools/flexbox/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  onSelectItem: (id: string) => void;
  className?: string;
}

export const PreviewPanel = memo(function PreviewPanel({
  onSelectItem,
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<FlexboxState>();
  const containerStyles = buildContainerStyles(state);

  return (
    <section
      aria-label="Предпросмотр"
      className={cn(
        "flex h-full min-h-64 flex-col rounded-xl border border-border p-6",
        className,
      )}
      style={{ backgroundColor: state.containerBgColor }}
    >
      <div className="flex min-h-0 flex-1 w-full overflow-auto rounded-lg border border-border/60">
        <div style={containerStyles}>
          {state.items.map((item) => {
            const isSelected = state.selectedItemId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={cn(
                  "flex min-h-16 min-w-16 items-center justify-center rounded-md border text-sm font-semibold text-white shadow-sm transition-all",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "border-white/20 hover:brightness-110",
                )}
                style={buildItemStyles(item)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});
