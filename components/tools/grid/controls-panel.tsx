"use client";

import { ColorPicker } from "@/components/shared/color-picker";
import { SliderField } from "@/components/shared/slider-field";
import { ToolControlsShell } from "@/components/shared/tool-controls-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AlignItems,
  GridAutoFlow,
  GridItem,
  GridState,
  JustifyItems,
} from "@/components/tools/grid/types";
import { MAX_GRID_ITEMS, MIN_GRID_ITEMS } from "@/components/tools/grid/types";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useLivePreviewActions } from "@/hooks/use-live-preview";
import { cn } from "@/lib/utils";

interface ControlsPanelProps {
  state: GridState;
  selectedItem: GridItem | null;
  onUpdate: (partial: Partial<GridState>) => void;
  onUpdateItem: (id: string, partial: Partial<GridItem>) => void;
  onReset: () => void;
  onSelectItem: (id: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  className?: string;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ControlsPanel({
  state,
  selectedItem,
  onUpdate,
  onUpdateItem,
  onReset,
  onSelectItem,
  onAddItem,
  onRemoveItem,
  className,
}: ControlsPanelProps) {
  const { setLive } = useLivePreviewActions<GridState>();

  return (
    <ToolControlsShell onReset={onReset} className={className}>
      <div className="space-y-2">
        <Label htmlFor="grid-template-columns">grid-template-columns</Label>
        <Input
          id="grid-template-columns"
          value={state.gridTemplateColumns}
          onChange={(event) => onUpdate({ gridTemplateColumns: event.target.value })}
          className="font-mono text-sm"
          placeholder="1fr 1fr 1fr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grid-template-rows">grid-template-rows</Label>
        <Input
          id="grid-template-rows"
          value={state.gridTemplateRows}
          onChange={(event) => onUpdate({ gridTemplateRows: event.target.value })}
          className="font-mono text-sm"
          placeholder="auto"
        />
      </div>

      <SliderField
        label="gap"
        value={state.gap}
        max={48}
        format={(value) => `${value}px`}
        onChange={(gap) => onUpdate({ gap })}
      />

      <SelectField<JustifyItems>
        label="justify-items"
        value={state.justifyItems}
        options={[
          { value: "start", label: "start" },
          { value: "end", label: "end" },
          { value: "center", label: "center" },
          { value: "stretch", label: "stretch" },
        ]}
        onChange={(justifyItems) => onUpdate({ justifyItems })}
      />

      <SelectField<AlignItems>
        label="align-items"
        value={state.alignItems}
        options={[
          { value: "start", label: "start" },
          { value: "end", label: "end" },
          { value: "center", label: "center" },
          { value: "stretch", label: "stretch" },
        ]}
        onChange={(alignItems) => onUpdate({ alignItems })}
      />

      <SelectField<GridAutoFlow>
        label="grid-auto-flow"
        value={state.gridAutoFlow}
        options={[
          { value: "row", label: "row" },
          { value: "column", label: "column" },
          { value: "row dense", label: "row dense" },
          { value: "column dense", label: "column dense" },
        ]}
        onChange={(gridAutoFlow) => onUpdate({ gridAutoFlow })}
      />

      <SliderField
        label="padding"
        value={state.padding}
        max={48}
        format={(value) => `${value}px`}
        onChange={(padding) => onUpdate({ padding })}
      />

      <ColorPicker
        label="Фон контейнера"
        color={state.bgColor}
        opacity={1}
        onColorChange={(bgColor) => onUpdate({ bgColor })}
        onOpacityChange={() => undefined}
        onLiveColorChange={(bgColor) =>
          setLive((prev) => ({ ...prev, bgColor }))
        }
        showOpacity={false}
      />

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <Label>Ячейки ({state.items.length})</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddItem}
            disabled={state.items.length >= MAX_GRID_ITEMS}
          >
            <PlusIcon />
            Добавить
          </Button>
        </div>

        <ul className="flex flex-col gap-1">
          {state.items.map((item) => (
            <li key={item.id}>
              <div
                className={cn(
                  "flex w-full items-center gap-2 rounded-md border border-border px-2 py-1.5 text-sm transition-colors",
                  selectedItem?.id === item.id && "ring-2 ring-primary",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectItem(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left transition-colors hover:opacity-80"
                >
                  <span
                    className="size-4 shrink-0 rounded"
                    style={{ backgroundColor: item.bgColor }}
                  />
                  <span className="truncate">Ячейка {item.label}</span>
                </button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7 shrink-0"
                  disabled={state.items.length <= MIN_GRID_ITEMS}
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Удалить ячейку ${item.label}`}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {selectedItem && (
          <ColorPicker
            label={`Цвет ячейки ${selectedItem.label}`}
            color={selectedItem.bgColor}
            opacity={1}
            onColorChange={(bgColor) => onUpdateItem(selectedItem.id, { bgColor })}
            onOpacityChange={() => undefined}
            onLiveColorChange={(bgColor) => {
              setLive((current) => ({
                ...current,
                items: current.items.map((item) =>
                  item.id === selectedItem.id ? { ...item, bgColor } : item,
                ),
              }));
            }}
            showOpacity={false}
          />
        )}
      </div>
    </ToolControlsShell>
  );
}
