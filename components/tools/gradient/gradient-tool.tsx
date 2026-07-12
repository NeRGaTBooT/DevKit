"use client";

import { useDeferredValue } from "react";
import { PaletteIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/gradient/code-output-panel";
import { ControlsPanel } from "@/components/tools/gradient/controls-panel";
import { PresetSelect } from "@/components/tools/gradient/preset-select";
import { PreviewPanel } from "@/components/tools/gradient/preview-panel";
import { useGradient } from "@/components/tools/gradient/use-gradient";
import { ShareStateButton } from "@/components/shared/share-state-button";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function GradientTool() {
  const {
    state,
    update,
    reset,
    applyPreset,
    updateStop,
    addStop,
    removeStop,
    duplicateStop,
    getShareUrl,
    hydrated,
  } = useGradient();
  const deferredState = useDeferredValue(state);

  if (!hydrated) {
    return <ToolLoading />;
  }

  return (
    <LivePreviewProvider committed={state}>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <header className="space-y-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PaletteIcon className="size-4" />
                <span className="text-sm">Генераторы</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Gradient</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Конструктор CSS-градиентов с color stops, live preview и
                копированием кода.
              </p>
            </div>
            <ShareStateButton getShareUrl={getShareUrl} />
          </div>
        </header>

        <ToolWorkspace
          toolbar={<PresetSelect onSelect={applyPreset} />}
          preview={<PreviewPanel />}
          controls={
            <ControlsPanel
              state={state}
              onUpdate={update}
              onReset={reset}
              onUpdateStop={updateStop}
              onAddStop={addStop}
              onRemoveStop={removeStop}
              onDuplicateStop={duplicateStop}
            />
          }
          footer={<CodeOutputPanel state={deferredState} />}
        />
      </div>
    </LivePreviewProvider>
  );
}
