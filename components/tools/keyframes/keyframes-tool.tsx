"use client";

import { useDeferredValue } from "react";
import { SparklesIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/keyframes/code-output-panel";
import { ControlsPanel } from "@/components/tools/keyframes/controls-panel";
import { PresetSelect } from "@/components/tools/keyframes/preset-select";
import { PreviewPanel } from "@/components/tools/keyframes/preview-panel";
import { useKeyframes } from "@/components/tools/keyframes/use-keyframes";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function KeyframesTool() {
  const {
    state,
    activeStep,
    update,
    reset,
    applyPreset,
    selectStep,
    addStep,
    removeStep,
    updateStep,
    hydrated,
  } = useKeyframes();
  const deferredState = useDeferredValue(state);

  if (!hydrated) {
    return <ToolLoading />;
  }

  return (
    <LivePreviewProvider committed={state}>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <SparklesIcon className="size-4" />
            <span className="text-sm">Генераторы</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Animation Keyframes
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Генератор @keyframes с timeline, настройкой шагов и live preview.
          </p>
        </header>

        <ToolWorkspace
          toolbar={<PresetSelect onSelect={applyPreset} />}
          preview={<PreviewPanel />}
          controls={
            <ControlsPanel
              state={state}
              activeStep={activeStep}
              onUpdate={update}
              onUpdateStep={updateStep}
              onReset={reset}
              onSelectStep={selectStep}
              onAddStep={addStep}
              onRemoveStep={removeStep}
            />
          }
          footer={<CodeOutputPanel state={deferredState} />}
        />
      </div>
    </LivePreviewProvider>
  );
}
