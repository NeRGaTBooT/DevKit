"use client";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  GlassmorphismState,
  PreviewBgPreset,
} from "@/components/tools/glassmorphism/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: GlassmorphismState;
  onUpdate: (partial: Partial<GlassmorphismState>) => void;
  onReset: () => void;
  className?: string;
}

const bgPresetLabels: Record<PreviewBgPreset, string> = {
  gradient: "Градиент",
  image: "Изображение",
  dark: "Тёмный",
};

export function ControlsPanel({
  state,
  onUpdate,
  onReset,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<GlassmorphismState>();

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Стекло
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="Blur"
            value={state.blur}
            min={0}
            max={40}
            step={1}
            format={(value) => `${value}px`}
            onChange={(blur) => onUpdate({ blur })}
          />
          <SliderField
            label="Прозрачность"
            value={state.opacity}
            min={0}
            max={1}
            step={0.01}
            format={(value) => `${Math.round(value * 100)}%`}
            onChange={(opacity) => onUpdate({ opacity })}
          />
        </div>
        <ColorPicker
          label="Цвет слоя"
          color={state.tintColor}
          opacity={1}
          showOpacity={false}
          onLiveColorChange={(tintColor) =>
            setLive((prev) => ({ ...prev, tintColor }))
          }
          onColorChange={(tintColor) => onUpdate({ tintColor })}
          onOpacityChange={() => undefined}
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Рамка
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="Толщина"
            value={state.borderWidth}
            min={0}
            max={3}
            step={0.5}
            format={(value) => `${value}px`}
            onChange={(borderWidth) => onUpdate({ borderWidth })}
          />
          <SliderField
            label="Прозрачность рамки"
            value={state.borderOpacity}
            min={0}
            max={1}
            step={0.01}
            format={(value) => `${Math.round(value * 100)}%`}
            onChange={(borderOpacity) => onUpdate({ borderOpacity })}
          />
        </div>
        <ColorPicker
          label="Цвет рамки"
          color={state.borderColor}
          opacity={1}
          showOpacity={false}
          onLiveColorChange={(borderColor) =>
            setLive((prev) => ({ ...prev, borderColor }))
          }
          onColorChange={(borderColor) => onUpdate({ borderColor })}
          onOpacityChange={() => undefined}
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Блики
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="Прозрачность бликов"
            value={state.highlightOpacity}
            min={0}
            max={1}
            step={0.01}
            format={(value) => `${Math.round(value * 100)}%`}
            onChange={(highlightOpacity) => onUpdate({ highlightOpacity })}
          />
        </div>
        <ColorPicker
          label="Цвет бликов"
          color={state.highlightColor}
          opacity={1}
          showOpacity={false}
          onLiveColorChange={(highlightColor) =>
            setLive((prev) => ({ ...prev, highlightColor }))
          }
          onColorChange={(highlightColor) => onUpdate({ highlightColor })}
          onOpacityChange={() => undefined}
        />
        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="glass-highlights"
            checked={state.highlights}
            onCheckedChange={(checked) =>
              onUpdate({ highlights: checked === true })
            }
          />
          <Label htmlFor="glass-highlights" className="text-sm font-normal">
            Расширенные блики (inset + псевдоэлементы)
          </Label>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Форма
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="Border radius"
            value={state.borderRadius}
            min={0}
            max={40}
            step={1}
            format={(value) => `${value}px`}
            onChange={(borderRadius) => onUpdate({ borderRadius })}
          />
          <SliderField
            label="Глубина тени"
            value={state.shadowDepth}
            min={0}
            max={40}
            step={1}
            format={(value) => `${value}px`}
            onChange={(shadowDepth) => onUpdate({ shadowDepth })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Фон preview</Label>
        <Tabs
          value={state.bgPreset}
          onValueChange={(bgPreset) =>
            onUpdate({ bgPreset: bgPreset as PreviewBgPreset })
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            {(Object.keys(bgPresetLabels) as PreviewBgPreset[]).map((preset) => (
              <TabsTrigger key={preset} value={preset}>
                {bgPresetLabels[preset]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </ToolControlsShell>
  );
}
