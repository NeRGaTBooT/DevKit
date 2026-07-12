"use client";

import { useDeferredValue } from "react";
import { Grid3x3Icon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/grid/code-output-panel";
import { ControlsPanel } from "@/components/tools/grid/controls-panel";
import { PresetSelect } from "@/components/tools/grid/preset-select";
import { PreviewPanel } from "@/components/tools/grid/preview-panel";
import { useGrid } from "@/components/tools/grid/use-grid";
import { ShareStateButton } from "@/components/shared/share-state-button";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function GridTool() {
  const {
    state,
    selectedItem,
    update,
    reset,
    applyPreset,
    selectItem,
    addItem,
    removeItem,
    updateItem,
    getShareUrl,
    hydrated,
  } = useGrid();
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
                <Grid3x3Icon className="size-4" />
                <span className="text-sm">Генераторы</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Grid Playground</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Визуальный playground для CSS Grid с настройкой шаблона, gap и
                копированием CSS.
              </p>
            </div>
            <ShareStateButton getShareUrl={getShareUrl} />
          </div>
        </header>

        <ToolWorkspace
          toolbar={<PresetSelect onSelect={applyPreset} />}
          preview={<PreviewPanel onSelectItem={selectItem} />}
          controls={
            <ControlsPanel
              state={state}
              selectedItem={selectedItem}
              onUpdate={update}
              onUpdateItem={updateItem}
              onReset={reset}
              onSelectItem={selectItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          }
          footer={<CodeOutputPanel state={deferredState} />}
        />
      </div>
    </LivePreviewProvider>
  );
}
