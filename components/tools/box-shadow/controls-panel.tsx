"use client";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BoxShadowState, PreviewShape } from "@/components/tools/box-shadow/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: BoxShadowState;
  onUpdate: (partial: Partial<BoxShadowState>) => void;
  onReset: () => void;
  className?: string;
}

const shapeLabels: Record<PreviewShape, string> = {
  card: "Карточка",
  circle: "Круг",
  button: "Кнопка",
};

export function ControlsPanel({
  state,
  onUpdate,
  onReset,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<BoxShadowState>();

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SliderField
          label="Смещение X"
          value={state.offsetX}
          min={-50}
          max={50}
          step={0.5}
          format={(value) => `${value}px`}
          onChange={(offsetX) => onUpdate({ offsetX })}
        />
        <SliderField
          label="Смещение Y"
          value={state.offsetY}
          min={-50}
          max={50}
          step={0.5}
          format={(value) => `${value}px`}
          onChange={(offsetY) => onUpdate({ offsetY })}
        />
        <SliderField
          label="Размытие"
          value={state.blur}
          min={0}
          max={100}
          step={0.5}
          format={(value) => `${value}px`}
          onChange={(blur) => onUpdate({ blur })}
        />
        <SliderField
          label="Spread"
          value={state.spread}
          min={0}
          max={50}
          step={0.5}
          format={(value) => `${value}px`}
          onChange={(spread) => onUpdate({ spread })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ColorPicker
          label="Цвет тени"
          color={state.color}
          opacity={state.opacity}
          onLiveColorChange={(color) => setLive((prev) => ({ ...prev, color }))}
          onLiveOpacityChange={(opacity) =>
            setLive((prev) => ({ ...prev, opacity }))
          }
          onColorChange={(color) => onUpdate({ color })}
          onOpacityChange={(opacity) => onUpdate({ opacity })}
        />
        <ColorPicker
          label="Фон preview"
          color={state.bgColor}
          opacity={1}
          showOpacity={false}
          onLiveColorChange={(bgColor) => setLive((prev) => ({ ...prev, bgColor }))}
          onColorChange={(bgColor) => onUpdate({ bgColor })}
          onOpacityChange={() => undefined}
        />
        <ColorPicker
          label="Цвет объекта"
          color={state.objectColor}
          opacity={1}
          showOpacity={false}
          onLiveColorChange={(objectColor) =>
            setLive((prev) => ({ ...prev, objectColor }))
          }
          onColorChange={(objectColor) => onUpdate({ objectColor })}
          onOpacityChange={() => undefined}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="box-shadow-inset"
            checked={state.inset}
            onCheckedChange={(checked) =>
              onUpdate({ inset: checked === true })
            }
          />
          <Label htmlFor="box-shadow-inset">Inset</Label>
        </div>

        <div className="w-full space-y-2 sm:max-w-sm">
          <Label>Форма preview</Label>
          <Tabs
            value={state.shape}
            onValueChange={(shape) => onUpdate({ shape: shape as PreviewShape })}
          >
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(shapeLabels) as PreviewShape[]).map((shape) => (
                <TabsTrigger key={shape} value={shape}>
                  {shapeLabels[shape]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </ToolControlsShell>
  );
}
