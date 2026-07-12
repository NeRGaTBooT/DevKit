"use client";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CssFilterState, PreviewMode } from "@/components/tools/css-filter/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: CssFilterState;
  onUpdate: (partial: Partial<CssFilterState>) => void;
  onReset: () => void;
  className?: string;
}

const previewModeLabels: Record<PreviewMode, string> = {
  image: "Изображение",
  block: "Блок",
};

export function ControlsPanel({
  state,
  onUpdate,
  onReset,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<CssFilterState>();

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <SliderField
          label="Blur"
          value={state.blur}
          min={0}
          max={20}
          step={0.5}
          format={(value) => `${value}px`}
          onChange={(blur) => onUpdate({ blur })}
        />
        <SliderField
          label="Brightness"
          value={state.brightness}
          min={0}
          max={200}
          step={1}
          format={(value) => `${value}%`}
          onChange={(brightness) => onUpdate({ brightness })}
        />
        <SliderField
          label="Contrast"
          value={state.contrast}
          min={0}
          max={200}
          step={1}
          format={(value) => `${value}%`}
          onChange={(contrast) => onUpdate({ contrast })}
        />
        <SliderField
          label="Saturate"
          value={state.saturate}
          min={0}
          max={200}
          step={1}
          format={(value) => `${value}%`}
          onChange={(saturate) => onUpdate({ saturate })}
        />
        <SliderField
          label="Grayscale"
          value={state.grayscale}
          min={0}
          max={100}
          step={1}
          format={(value) => `${value}%`}
          onChange={(grayscale) => onUpdate({ grayscale })}
        />
      </div>

      <ColorPicker
        label="Фон preview"
        color={state.bgColor}
        opacity={1}
        showOpacity={false}
        onLiveColorChange={(bgColor) => setLive((prev) => ({ ...prev, bgColor }))}
        onColorChange={(bgColor) => onUpdate({ bgColor })}
        onOpacityChange={() => undefined}
      />

      <div className="space-y-2">
        <Label>Режим preview</Label>
        <Tabs
          value={state.previewMode}
          onValueChange={(previewMode) =>
            onUpdate({ previewMode: previewMode as PreviewMode })
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            {(Object.keys(previewModeLabels) as PreviewMode[]).map((mode) => (
              <TabsTrigger key={mode} value={mode}>
                {previewModeLabels[mode]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </ToolControlsShell>
  );
}
