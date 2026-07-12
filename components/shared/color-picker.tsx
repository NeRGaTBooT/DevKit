"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { normalizeHex, rgbaFromHex } from "@/lib/color";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  color: string;
  opacity: number;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  onLiveColorChange?: (color: string) => void;
  onLiveOpacityChange?: (opacity: number) => void;
  showOpacity?: boolean;
  className?: string;
}

export const ColorPicker = memo(function ColorPicker({
  label,
  color,
  opacity,
  onColorChange,
  onOpacityChange,
  onLiveColorChange,
  onLiveOpacityChange,
  showOpacity = true,
  className,
}: ColorPickerProps) {
  const hexInputId = useId();
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const [localColor, setLocalColor] = useState(color);
  const [localOpacity, setLocalOpacity] = useState(opacity);

  const onColorChangeRef = useRef(onColorChange);
  const onOpacityChangeRef = useRef(onOpacityChange);
  const onLiveColorChangeRef = useRef(onLiveColorChange);
  const onLiveOpacityChangeRef = useRef(onLiveOpacityChange);

  useEffect(() => {
    onColorChangeRef.current = onColorChange;
  }, [onColorChange]);

  useEffect(() => {
    onOpacityChangeRef.current = onOpacityChange;
  }, [onOpacityChange]);

  useEffect(() => {
    onLiveColorChangeRef.current = onLiveColorChange;
  }, [onLiveColorChange]);

  useEffect(() => {
    onLiveOpacityChangeRef.current = onLiveOpacityChange;
  }, [onLiveOpacityChange]);

  useEffect(() => {
    if (!open) {
      setLocalColor(color);
      setLocalOpacity(opacity);
      setHexDraft(null);
    }
  }, [color, opacity, open]);

  const emitLiveColor = useCallback((nextColor: string) => {
    onLiveColorChangeRef.current?.(nextColor);
  }, []);

  const emitLiveOpacity = useCallback((nextOpacity: number) => {
    onLiveOpacityChangeRef.current?.(nextOpacity);
  }, []);

  const flushToParent = useCallback(() => {
    const normalized = normalizeHex(localColor);
    if (normalized) {
      onColorChangeRef.current(normalized);
    }
    onOpacityChangeRef.current(localOpacity);
  }, [localColor, localOpacity]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && open) {
        flushToParent();
      }
      setOpen(nextOpen);
    },
    [flushToParent, open],
  );

  const normalizedColor = normalizeHex(localColor) ?? "#000000";
  const previewColor = rgbaFromHex(localColor, localOpacity);
  const hexInput = hexDraft ?? normalizedColor;
  const triggerColor = open ? localColor : color;
  const triggerOpacity = open ? localOpacity : opacity;
  const triggerPreviewColor = rgbaFromHex(triggerColor, triggerOpacity);
  const triggerHex = normalizeHex(triggerColor) ?? "#000000";

  const commitHex = (value: string) => {
    const normalized = normalizeHex(value);
    if (!normalized) return;
    setLocalColor(normalized);
    setHexDraft(null);
    emitLiveColor(normalized);
    onColorChangeRef.current(normalized);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-left text-sm transition-colors hover:bg-muted/50"
          >
            <span
              className="size-5 shrink-0 rounded-md border border-border"
              style={{ backgroundColor: triggerPreviewColor }}
              aria-hidden
            />
            <span className="flex-1 truncate font-mono">{triggerHex}</span>
            {showOpacity && (
              <span className="text-xs text-muted-foreground">
                {Math.round(triggerOpacity * 100)}%
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="start">
          <PopoverHeader>
            <PopoverTitle>{label}</PopoverTitle>
          </PopoverHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={normalizedColor}
                onInput={(event) => {
                  const next = event.currentTarget.value.toUpperCase();
                  setLocalColor(next);
                  emitLiveColor(next);
                }}
                onChange={(event) => {
                  const next = event.currentTarget.value.toUpperCase();
                  setLocalColor(next);
                  emitLiveColor(next);
                  onColorChangeRef.current(next);
                }}
                className="size-10 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
                aria-label={`${label}: выбор цвета`}
              />
              <div
                className="h-10 flex-1 rounded-md border border-border"
                style={{ backgroundColor: previewColor }}
                aria-hidden
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={hexInputId}>HEX</Label>
              <Input
                id={hexInputId}
                value={hexInput}
                onChange={(event) => setHexDraft(event.target.value)}
                onBlur={() => commitHex(hexInput)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitHex(hexInput);
                  }
                }}
                placeholder="#000000"
                className="font-mono"
              />
            </div>

            {showOpacity && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${hexInputId}-opacity`}>Прозрачность</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(localOpacity * 100)}%
                  </span>
                </div>
                <Slider
                  id={`${hexInputId}-opacity`}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[localOpacity]}
                  onValueChange={(values) => {
                    const next = values[0] ?? localOpacity;
                    setLocalOpacity(next);
                    emitLiveOpacity(next);
                  }}
                  onValueCommit={(values) => {
                    const next = values[0] ?? localOpacity;
                    setLocalOpacity(next);
                    emitLiveOpacity(next);
                    onOpacityChangeRef.current(next);
                  }}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});
