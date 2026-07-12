"use client";

import { CopyIcon, Trash2Icon } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";

import { ColorPicker } from "@/components/shared/color-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { buildGradient } from "@/components/tools/gradient/gradient-logic";
import type { ColorStop, GradientState } from "@/components/tools/gradient/types";
import { useLivePreviewActions } from "@/hooks/use-live-preview";
import { rgbaFromHex } from "@/lib/color";
import { cn } from "@/lib/utils";

interface ColorStopsEditorProps {
  state: GradientState;
  onUpdateStop: (id: string, partial: Partial<ColorStop>) => void;
  onAddStop: (position: number) => void;
  onRemoveStop: (id: string) => void;
  onDuplicateStop: (id: string) => void;
  className?: string;
}

interface ColorStopRowProps {
  stop: ColorStop;
  index: number;
  stopsCount: number;
  onUpdateStop: (id: string, partial: Partial<ColorStop>) => void;
  onRemoveStop: (id: string) => void;
  onDuplicateStop: (id: string) => void;
}

const ColorStopRow = memo(function ColorStopRow({
  stop,
  index,
  stopsCount,
  onUpdateStop,
  onRemoveStop,
  onDuplicateStop,
}: ColorStopRowProps) {
  const { setLive } = useLivePreviewActions<GradientState>();

  const handleColorChange = useCallback(
    (color: string) => onUpdateStop(stop.id, { color }),
    [onUpdateStop, stop.id],
  );

  const handleOpacityChange = useCallback(
    (opacity: number) => onUpdateStop(stop.id, { opacity }),
    [onUpdateStop, stop.id],
  );

  const handleLiveColorChange = useCallback(
    (color: string) => {
      setLive((prev) => ({
        ...prev,
        stops: prev.stops.map((item) =>
          item.id === stop.id ? { ...item, color } : item,
        ),
      }));
    },
    [setLive, stop.id],
  );

  const handleLiveOpacityChange = useCallback(
    (opacity: number) => {
      setLive((prev) => ({
        ...prev,
        stops: prev.stops.map((item) =>
          item.id === stop.id ? { ...item, opacity } : item,
        ),
      }));
    },
    [setLive, stop.id],
  );

  const handlePositionChange = useCallback(
    (position: number) => onUpdateStop(stop.id, { position }),
    [onUpdateStop, stop.id],
  );

  return (
    <div className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_auto] md:items-end">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Стоп {index + 1}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(stop.position)}%
          </span>
        </div>
        <ColorPicker
          label={`Цвет стопа ${index + 1}`}
          color={stop.color}
          opacity={stop.opacity}
          onLiveColorChange={handleLiveColorChange}
          onLiveOpacityChange={handleLiveOpacityChange}
          onColorChange={handleColorChange}
          onOpacityChange={handleOpacityChange}
        />
        <div className="space-y-2">
          <Label>Позиция</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[stop.position]}
            onValueChange={(values) =>
              handlePositionChange(values[0] ?? stop.position)
            }
          />
        </div>
      </div>

      <div className="flex gap-2 md:flex-col">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onDuplicateStop(stop.id)}
          disabled={stopsCount >= 10}
        >
          <CopyIcon />
          Дублировать
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRemoveStop(stop.id)}
          disabled={stopsCount <= 2}
        >
          <Trash2Icon />
          Удалить
        </Button>
      </div>
    </div>
  );
});

export function ColorStopsEditor({
  state,
  onUpdateStop,
  onAddStop,
  onRemoveStop,
  onDuplicateStop,
  className,
}: ColorStopsEditorProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sortedStops = useMemo(
    () => [...state.stops].sort((left, right) => left.position - right.position),
    [state.stops],
  );

  const gradientBackground = useMemo(
    () => buildGradient(state),
    [state],
  );

  const getPositionFromClientX = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar) return 0;

    const rect = bar.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.round(Math.max(0, Math.min(100, ratio * 100)));
  }, []);

  const handleBarPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (state.stops.length >= 10) return;

    onAddStop(getPositionFromClientX(event.clientX));
  };

  const startDrag = (event: React.PointerEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggingId(id);

    const handleMove = (moveEvent: PointerEvent) => {
      onUpdateStop(id, { position: getPositionFromClientX(moveEvent.clientX) });
    };

    const handleUp = () => {
      setDraggingId(null);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label>Цветовые стопы</Label>
        <div
          ref={barRef}
          className="relative h-12 cursor-crosshair rounded-lg border border-border"
          style={{ background: gradientBackground }}
          onPointerDown={handleBarPointerDown}
          role="presentation"
        >
          {state.stops.map((stop) => (
            <button
              key={stop.id}
              type="button"
              className={cn(
                "absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-transform",
                draggingId === stop.id && "scale-125",
              )}
              style={{
                left: `${stop.position}%`,
                backgroundColor: rgbaFromHex(stop.color, stop.opacity),
              }}
              onPointerDown={(event) => startDrag(event, stop.id)}
              aria-label={`Стоп ${Math.round(stop.position)}%`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Перетащите стоп или кликните по полосе, чтобы добавить новый (макс. 10).
        </p>
      </div>

      <div className="space-y-3">
        {sortedStops.map((stop, index) => (
          <ColorStopRow
            key={stop.id}
            stop={stop}
            index={index}
            stopsCount={state.stops.length}
            onUpdateStop={onUpdateStop}
            onRemoveStop={onRemoveStop}
            onDuplicateStop={onDuplicateStop}
          />
        ))}
      </div>
    </div>
  );
}
