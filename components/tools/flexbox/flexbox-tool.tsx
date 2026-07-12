"use client";

import { useDeferredValue } from "react";
import { BoxIcon } from "lucide-react";

import { CodeOutputPanel } from "@/components/tools/flexbox/code-output-panel";
import { ControlsPanel } from "@/components/tools/flexbox/controls-panel";
import { PresetSelect } from "@/components/tools/flexbox/preset-select";
import { PreviewPanel } from "@/components/tools/flexbox/preview-panel";
import { useFlexbox } from "@/components/tools/flexbox/use-flexbox";
import { ShareStateButton } from "@/components/shared/share-state-button";
import { ToolLoading } from "@/components/tools/tool-loading";
import { ToolWorkspace } from "@/components/shared/tool-workspace";
import { LivePreviewProvider } from "@/hooks/use-live-preview";

export function FlexboxTool() {
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
  } = useFlexbox();
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
              <BoxIcon className="size-4" />
              <span className="text-sm">Генераторы</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Flexbox</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Визуальный playground для flexbox с настройкой контейнера, элементов и
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
