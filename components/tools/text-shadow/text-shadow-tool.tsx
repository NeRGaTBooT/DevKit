"use client";

import { useDeferredValue } from "react";
import { TypeIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/text-shadow/code-output-panel";
import { ControlsPanel } from "@/components/tools/text-shadow/controls-panel";
import { PresetSelect } from "@/components/tools/text-shadow/preset-select";
import { PreviewPanel } from "@/components/tools/text-shadow/preview-panel";
import { useTextShadow } from "@/components/tools/text-shadow/use-text-shadow";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function TextShadowTool() {
  const {
    state,
    activeShadow,
    update,
    reset,
    applyPreset,
    selectShadow,
    addShadow,
    removeShadow,
    updateShadow,
    hydrated,
  } = useTextShadow();
  const deferredState = useDeferredValue(state);

  if (!hydrated) {
    return <ToolLoading />;
  }

  return (
    <LivePreviewProvider committed={state}>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TypeIcon className="size-4" />
            <span className="text-sm">Генераторы</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Text Shadow</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Генератор CSS text-shadow с мультислоями, пресетами и live preview.
          </p>
        </header>

        <ToolWorkspace
          toolbar={<PresetSelect onSelect={applyPreset} />}
          preview={<PreviewPanel />}
          controls={
            <ControlsPanel
              state={state}
              activeShadow={activeShadow}
              onUpdate={update}
              onUpdateShadow={updateShadow}
              onReset={reset}
              onSelectShadow={selectShadow}
              onAddShadow={addShadow}
              onRemoveShadow={removeShadow}
            />
          }
          footer={<CodeOutputPanel state={deferredState} />}
        />
      </div>
    </LivePreviewProvider>
  );
}
