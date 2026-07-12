"use client";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorStopsEditor } from "@/components/tools/gradient/color-stops-editor";
import type {
  ColorStop,
  GradientState,
  GradientType,
  PreviewShape,
  RadialSize,
} from "@/components/tools/gradient/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: GradientState;
  onUpdate: (partial: Partial<GradientState>) => void;
  onReset: () => void;
  onUpdateStop: (id: string, partial: Partial<ColorStop>) => void;
  onAddStop: (position: number) => void;
  onRemoveStop: (id: string) => void;
  onDuplicateStop: (id: string) => void;
  className?: string;
}

const typeLabels: Record<GradientType, string> = {
  linear: "Linear",
  radial: "Radial",
  conic: "Conic",
};

const previewShapeLabels: Record<PreviewShape, string> = {
  rectangle: "Прямоугольник",
  circle: "Круг",
  full: "На всю ширину",
};

const radialSizeLabels: Record<RadialSize, string> = {
  "closest-side": "closest-side",
  "closest-corner": "closest-corner",
  "farthest-side": "farthest-side",
  "farthest-corner": "farthest-corner",
};

export function ControlsPanel({
  state,
  onUpdate,
  onReset,
  onUpdateStop,
  onAddStop,
  onRemoveStop,
  onDuplicateStop,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<GradientState>();

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="space-y-2">
        <Label>Тип градиента</Label>
        <Tabs
          value={state.type}
          onValueChange={(type) => onUpdate({ type: type as GradientType })}
        >
          <TabsList className="grid w-full grid-cols-3">
            {(Object.keys(typeLabels) as GradientType[]).map((type) => (
              <TabsTrigger key={type} value={type}>
                {type === "conic" ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{typeLabels[type]}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Conic gradient поддерживается в современных браузерах
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  typeLabels[type]
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="gradient-repeating"
          checked={state.repeating}
          onCheckedChange={(checked) =>
            onUpdate({ repeating: checked === true })
          }
        />
        <Label htmlFor="gradient-repeating">Repeating</Label>
      </div>

      {(state.type === "linear" || state.type === "conic") && (
        <SliderField
          label={state.type === "conic" ? "Угол from" : "Угол"}
          value={state.angle}
          min={0}
          max={360}
          step={1}
          format={(value) => `${value}deg`}
          onChange={(angle) => onUpdate({ angle })}
        />
      )}

      {state.type === "radial" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Форма</Label>
            <Select
              value={state.radialShape}
              onValueChange={(radialShape) =>
                onUpdate({
                  radialShape: radialShape as GradientState["radialShape"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">circle</SelectItem>
                <SelectItem value="ellipse">ellipse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Размер</Label>
            <Select
              value={state.radialSize}
              onValueChange={(radialSize) =>
                onUpdate({ radialSize: radialSize as RadialSize })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(radialSizeLabels) as RadialSize[]).map((size) => (
                  <SelectItem key={size} value={size}>
                    {radialSizeLabels[size]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {(state.type === "radial" || state.type === "conic") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="Позиция X"
            value={state.position.x}
            min={0}
            max={100}
            step={1}
            format={(value) => `${value}%`}
            onChange={(x) => onUpdate({ position: { ...state.position, x } })}
          />
          <SliderField
            label="Позиция Y"
            value={state.position.y}
            min={0}
            max={100}
            step={1}
            format={(value) => `${value}%`}
            onChange={(y) => onUpdate({ position: { ...state.position, y } })}
          />
        </div>
      )}

      <ColorStopsEditor
        state={state}
        onUpdateStop={onUpdateStop}
        onAddStop={onAddStop}
        onRemoveStop={onRemoveStop}
        onDuplicateStop={onDuplicateStop}
      />

      <div className="grid gap-4 md:grid-cols-2">
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
          <Label>Форма preview</Label>
          <Tabs
            value={state.previewShape}
            onValueChange={(previewShape) =>
              onUpdate({ previewShape: previewShape as PreviewShape })
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(previewShapeLabels) as PreviewShape[]).map(
                (shape) => (
                  <TabsTrigger key={shape} value={shape}>
                    {previewShapeLabels[shape]}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {state.previewShape === "rectangle" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="Ширина preview"
            value={state.previewSize.width}
            min={120}
            max={640}
            step={4}
            format={(value) => `${value}px`}
            onChange={(width) =>
              onUpdate({ previewSize: { ...state.previewSize, width } })
            }
          />
          <SliderField
            label="Высота preview"
            value={state.previewSize.height}
            min={80}
            max={400}
            step={4}
            format={(value) => `${value}px`}
            onChange={(height) =>
              onUpdate({ previewSize: { ...state.previewSize, height } })
            }
          />
        </div>
      )}
    </ToolControlsShell>
  );
}
