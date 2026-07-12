"use client";

import { useDeferredValue } from "react";
import { SquareRoundCornerIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/border-radius/code-output-panel";
import { ControlsPanel } from "@/components/tools/border-radius/controls-panel";
import { PresetSelect } from "@/components/tools/border-radius/preset-select";
import { PreviewPanel } from "@/components/tools/border-radius/preview-panel";
import { useBorderRadius } from "@/components/tools/border-radius/use-border-radius";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function BorderRadiusTool() {
  const { state, update, updateCorner, reset, applyPreset, hydrated } =
    useBorderRadius();
  const deferredState = useDeferredValue(state);

  if (!hydrated) {
    return <ToolLoading />;
  }

  return (
    <LivePreviewProvider committed={state}>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <SquareRoundCornerIcon className="size-4" />
            <span className="text-sm">Генераторы</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Border Radius</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Генератор CSS border-radius с пресетами, эллиптическим режимом и live
            preview.
          </p>
        </header>

        <ToolWorkspace
          toolbar={<PresetSelect onSelect={applyPreset} />}
          preview={<PreviewPanel />}
          controls={
            <ControlsPanel
              state={state}
              onUpdate={update}
              onUpdateCorner={updateCorner}
              onReset={reset}
            />
          }
          footer={<CodeOutputPanel state={deferredState} />}
        />
      </div>
    </LivePreviewProvider>
  );
}
