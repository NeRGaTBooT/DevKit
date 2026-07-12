"use client";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import type {
  BorderRadiusState,
  CornerRadii,
} from "@/components/tools/border-radius/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: BorderRadiusState;
  onUpdate: (partial: Partial<BorderRadiusState>) => void;
  onUpdateCorner: (key: keyof CornerRadii, value: number) => void;
  onReset: () => void;
  className?: string;
}

const cornerLabels: Record<keyof CornerRadii, string> = {
  topLeft: "Верх-лево",
  topRight: "Верх-право",
  bottomRight: "Низ-право",
  bottomLeft: "Низ-лево",
};

export function ControlsPanel({
  state,
  onUpdate,
  onUpdateCorner,
  onReset,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<BorderRadiusState>();

  const visibleCorners = state.unified
    ? (["topLeft"] as const)
    : (Object.keys(cornerLabels) as (keyof CornerRadii)[]);

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="flex items-center gap-2">
          <Checkbox
            id="border-radius-unified"
            checked={state.unified}
            onCheckedChange={(checked) => onUpdate({ unified: checked === true })}
          />
          <Label htmlFor="border-radius-unified">Единый радиус</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="border-radius-elliptical"
            checked={state.elliptical}
            onCheckedChange={(checked) =>
              onUpdate({ elliptical: checked === true })
            }
          />
          <Label htmlFor="border-radius-elliptical">Эллиптический режим</Label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleCorners.map((corner) => (
          <SliderField
            key={corner}
            label={state.unified ? "Радиус" : cornerLabels[corner]}
            value={state.corners[corner]}
            format={(value) => `${value}px`}
            onChange={(value) => onUpdateCorner(corner, value)}
          />
        ))}
      </div>

      {state.elliptical && (
        <p className="text-xs text-muted-foreground">
          Вертикальные радиусы вычисляются из соседних углов — например,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">
            8px 40px / 40px 8px
          </code>
        </p>
      )}

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
    </ToolControlsShell>
  );
}
