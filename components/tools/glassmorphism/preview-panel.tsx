"use client";

import { memo, type CSSProperties } from "react";

import {
  buildGlassInlineStyles,
} from "@/components/tools/glassmorphism/glassmorphism-logic";
import { rgbaFromHex } from "@/lib/color";
import type { GlassmorphismState } from "@/components/tools/glassmorphism/types";
import { useLivePreviewState } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  className?: string;
}

const PREVIEW_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366F1'/%3E%3Cstop offset='50%25' stop-color='%23EC4899'/%3E%3Cstop offset='100%25' stop-color='%23F59E0B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='100' r='40' fill='%23FFFFFF' opacity='0.3'/%3E%3Ccircle cx='280' cy='200' r='60' fill='%23FFFFFF' opacity='0.2'/%3E%3Ctext x='200' y='160' text-anchor='middle' font-family='system-ui' font-size='24' fill='white' opacity='0.9'%3EPreview%3C/text%3E%3C/svg%3E";

function getBackgroundStyle(state: GlassmorphismState): CSSProperties {
  if (state.bgPreset === "dark") {
    return {
      background:
        "radial-gradient(circle at 20% 20%, #312e81 0%, #1e1b4b 40%, #0f172a 100%)",
    };
  }

  if (state.bgPreset === "image") {
    return {
      backgroundImage: `url("${PREVIEW_IMAGE}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background:
      "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
  };
}

export const PreviewPanel = memo(function PreviewPanel({
  className,
}: PreviewPanelProps) {
  const state = useLivePreviewState<GlassmorphismState>();
  const glassStyles = buildGlassInlineStyles(state);
  const highlightStrong = rgbaFromHex(
    state.highlightColor,
    Math.min(state.highlightOpacity * 1.6, 1),
  );
  const highlightMid = rgbaFromHex(
    state.highlightColor,
    state.highlightOpacity * 0.6,
  );

  return (
    <section
      aria-label="Предпросмотр"
      className={cn(
        "relative flex h-full min-h-80 items-center justify-center overflow-hidden rounded-xl border border-border p-6",
        className,
      )}
      style={getBackgroundStyle(state)}
    >
      <div
        className="relative flex h-[360px] w-[240px] flex-col justify-between p-6"
        style={glassStyles}
      >
        {state.highlights && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${highlightStrong}, transparent)`,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-px"
              style={{
                background: `linear-gradient(180deg, ${highlightStrong}, transparent, ${highlightMid})`,
              }}
            />
          </>
        )}

        <div className="relative space-y-2">
          <div className="h-3 w-16 rounded-full bg-white/40" />
          <h3 className="text-lg font-semibold text-white/90">Glass Card</h3>
        </div>

        <div className="relative space-y-3">
          <div className="h-2 w-full rounded-full bg-white/30" />
          <div className="h-2 w-4/5 rounded-full bg-white/25" />
          <div className="h-2 w-3/5 rounded-full bg-white/20" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="size-10 rounded-full bg-white/25" />
          <div className="space-y-1.5">
            <div className="h-2 w-20 rounded-full bg-white/35" />
            <div className="h-2 w-14 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
});
