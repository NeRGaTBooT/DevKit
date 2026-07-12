"use client";

import { useDeferredValue } from "react";
import { LayersIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/box-shadow/code-output-panel";
import { ControlsPanel } from "@/components/tools/box-shadow/controls-panel";
import { PresetSelect } from "@/components/tools/box-shadow/preset-select";
import { PreviewPanel } from "@/components/tools/box-shadow/preview-panel";
import { useBoxShadow } from "@/components/tools/box-shadow/use-box-shadow";
import { ShareStateButton } from "@/components/shared/share-state-button";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function BoxShadowTool() {
  const { state, update, reset, applyPreset, getShareUrl, hydrated } = useBoxShadow();
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
                <LayersIcon className="size-4" />
                <span className="text-sm">Генераторы</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Box Shadow</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Генератор CSS-теней с пресетами, live preview и копированием кода.
              </p>
            </div>
            <ShareStateButton getShareUrl={getShareUrl} />
          </div>
        </header>

        <ToolWorkspace
          toolbar={<PresetSelect onSelect={applyPreset} />}
          preview={<PreviewPanel />}
          controls={
            <ControlsPanel state={state} onUpdate={update} onReset={reset} />
          }
          footer={<CodeOutputPanel state={deferredState} />}
        />
      </div>
    </LivePreviewProvider>
  );
}
