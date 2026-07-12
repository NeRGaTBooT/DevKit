"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  TextShadowLayer,
  TextShadowState,
} from "@/components/tools/text-shadow/types";
import { MAX_TEXT_SHADOWS, MIN_TEXT_SHADOWS } from "@/components/tools/text-shadow/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: TextShadowState;
  activeShadow: TextShadowLayer | null;
  onUpdate: (partial: Partial<TextShadowState>) => void;
  onUpdateShadow: (id: string, partial: Partial<TextShadowLayer>) => void;
  onReset: () => void;
  onSelectShadow: (id: string) => void;
  onAddShadow: () => void;
  onRemoveShadow: (id: string) => void;
  className?: string;
}

export function ControlsPanel({
  state,
  activeShadow,
  onUpdate,
  onUpdateShadow,
  onReset,
  onSelectShadow,
  onAddShadow,
  onRemoveShadow,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<TextShadowState>();

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Слои тени</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddShadow}
            disabled={state.shadows.length >= MAX_TEXT_SHADOWS}
          >
            <PlusIcon />
            Добавить
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {state.shadows.map((layer, index) => (
            <div key={layer.id} className="flex items-center gap-1">
              <Button
                type="button"
                variant={
                  state.activeShadowId === layer.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => onSelectShadow(layer.id)}
              >
                Слой {index + 1}
              </Button>
              {state.shadows.length > MIN_TEXT_SHADOWS && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemoveShadow(layer.id)}
                  aria-label={`Удалить слой ${index + 1}`}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeShadow && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <SliderField
              label="Смещение X"
              value={activeShadow.offsetX}
              min={-50}
              max={50}
              step={0.5}
              format={(value) => `${value}px`}
              onChange={(offsetX) =>
                onUpdateShadow(activeShadow.id, { offsetX })
              }
            />
            <SliderField
              label="Смещение Y"
              value={activeShadow.offsetY}
              min={-50}
              max={50}
              step={0.5}
              format={(value) => `${value}px`}
              onChange={(offsetY) =>
                onUpdateShadow(activeShadow.id, { offsetY })
              }
            />
            <SliderField
              label="Размытие"
              value={activeShadow.blur}
              min={0}
              max={50}
              step={0.5}
              format={(value) => `${value}px`}
              onChange={(blur) => onUpdateShadow(activeShadow.id, { blur })}
            />
          </div>

          <ColorPicker
            label="Цвет тени"
            color={activeShadow.color}
            opacity={activeShadow.opacity}
            onLiveColorChange={(color) =>
              setLive((prev) => ({
                ...prev,
                shadows: prev.shadows.map((layer) =>
                  layer.id === activeShadow.id ? { ...layer, color } : layer,
                ),
              }))
            }
            onLiveOpacityChange={(opacity) =>
              setLive((prev) => ({
                ...prev,
                shadows: prev.shadows.map((layer) =>
                  layer.id === activeShadow.id ? { ...layer, opacity } : layer,
                ),
              }))
            }
            onColorChange={(color) =>
              onUpdateShadow(activeShadow.id, { color })
            }
            onOpacityChange={(opacity) =>
              onUpdateShadow(activeShadow.id, { opacity })
            }
          />
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="text-shadow-sample">Текст preview</Label>
        <Input
          id="text-shadow-sample"
          value={state.sampleText}
          onChange={(event) => onUpdate({ sampleText: event.target.value })}
        />
      </div>

      <SliderField
        label="Размер шрифта"
        value={state.fontSize}
        min={16}
        max={96}
        step={1}
        format={(value) => `${value}px`}
        onChange={(fontSize) => onUpdate({ fontSize })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ColorPicker
          label="Цвет текста"
          color={state.textColor}
          opacity={1}
          showOpacity={false}
          onLiveColorChange={(textColor) =>
            setLive((prev) => ({ ...prev, textColor }))
          }
          onColorChange={(textColor) => onUpdate({ textColor })}
          onOpacityChange={() => undefined}
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
      </div>
    </ToolControlsShell>
  );
}
