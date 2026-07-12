"use client";

import { useDeferredValue } from "react";
import { BlendIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/glassmorphism/code-output-panel";
import { ControlsPanel } from "@/components/tools/glassmorphism/controls-panel";
import { PresetSelect } from "@/components/tools/glassmorphism/preset-select";
import { PreviewPanel } from "@/components/tools/glassmorphism/preview-panel";
import { useGlassmorphism } from "@/components/tools/glassmorphism/use-glassmorphism";
import { ShareStateButton } from "@/components/shared/share-state-button";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function GlassmorphismTool() {
  const { state, update, reset, applyPreset, getShareUrl, hydrated } =
    useGlassmorphism();
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
                <BlendIcon className="size-4" />
                <span className="text-sm">Генераторы</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Glassmorphism
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Генератор эффекта матового стекла: прозрачность,
                backdrop-filter blur, блики и тонкая рамка с live preview.
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
