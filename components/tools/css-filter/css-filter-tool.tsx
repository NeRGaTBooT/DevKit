"use client";

import { useDeferredValue } from "react";
import { SlidersHorizontalIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/css-filter/code-output-panel";
import { ControlsPanel } from "@/components/tools/css-filter/controls-panel";
import { PresetSelect } from "@/components/tools/css-filter/preset-select";
import { PreviewPanel } from "@/components/tools/css-filter/preview-panel";
import { useCssFilter } from "@/components/tools/css-filter/use-css-filter";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function CssFilterTool() {
  const { state, update, reset, applyPreset, hydrated } = useCssFilter();
  const deferredState = useDeferredValue(state);

  if (!hydrated) {
    return <ToolLoading />;
  }

  return (
    <LivePreviewProvider committed={state}>
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <SlidersHorizontalIcon className="size-4" />
            <span className="text-sm">Генераторы</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">CSS Filter</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Генератор CSS filter с blur, brightness, contrast и live preview.
          </p>
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
