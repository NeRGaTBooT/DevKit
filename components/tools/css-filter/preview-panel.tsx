"use client";

import { memo } from "react";

import { buildCssFilter } from "@/components/tools/css-filter/css-filter-logic";
import type { CssFilterState } from "@/components/tools/css-filter/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

const PREVIEW_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366F1'/%3E%3Cstop offset='50%25' stop-color='%23EC4899'/%3E%3Cstop offset='100%25' stop-color='%23F59E0B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='100' r='40' fill='%23FFFFFF' opacity='0.3'/%3E%3Ccircle cx='280' cy='200' r='60' fill='%23FFFFFF' opacity='0.2'/%3E%3Ctext x='200' y='160' text-anchor='middle' font-family='system-ui' font-size='24' fill='white' opacity='0.9'%3EPreview%3C/text%3E%3C/svg%3E";

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<CssFilterState>();
  const filter = buildCssFilter(state);

  return (
    <section
      aria-label="Предпросмотр"
      className={cn(
        "flex h-full min-h-64 items-center justify-center rounded-xl border border-border p-6",
        className,
      )}
      style={{ backgroundColor: state.bgColor }}
    >
      {state.previewMode === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={PREVIEW_IMAGE}
          alt="Preview"
          className="h-48 w-64 rounded-lg object-cover shadow-md"
          style={{ filter }}
        />
      ) : (
        <div
          className="flex h-48 w-64 flex-col items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-indigo-500 via-pink-500 to-amber-400 p-6 shadow-md"
          style={{ filter }}
        >
          <div className="size-12 rounded-full bg-white/30" />
          <div className="h-3 w-24 rounded-full bg-white/50" />
          <div className="h-3 w-16 rounded-full bg-white/30" />
        </div>
      )}
    </section>
  );
});
