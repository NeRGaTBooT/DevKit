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
import type {
  AlignContent,
  AlignItems,
  AlignSelf,
  FlexDirection,
  FlexItem,
  FlexboxState,
  FlexWrap,
  JustifyContent,
} from "@/components/tools/flexbox/types";
import { ItemListPanel } from "@/components/tools/flexbox/item-list-panel";
import { useLivePreviewActions } from "@/hooks/use-live-preview";

interface ControlsPanelProps {
  state: FlexboxState;
  selectedItem: FlexItem | null;
  onUpdate: (partial: Partial<FlexboxState>) => void;
  onUpdateItem: (id: string, partial: Partial<FlexItem>) => void;
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
      <Select value={value} onValueChange={(next) => onChange(next as T)}>
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

const directionOptions: Array<{ value: FlexDirection; label: string }> = [
  { value: "row", label: "row" },
  { value: "row-reverse", label: "row-reverse" },
  { value: "column", label: "column" },
  { value: "column-reverse", label: "column-reverse" },
];

const justifyOptions: Array<{ value: JustifyContent; label: string }> = [
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "space-between", label: "space-between" },
  { value: "space-around", label: "space-around" },
  { value: "space-evenly", label: "space-evenly" },
];

const alignItemsOptions: Array<{ value: AlignItems; label: string }> = [
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "baseline", label: "baseline" },
];

const alignContentOptions: Array<{ value: AlignContent; label: string }> = [
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "space-between", label: "space-between" },
  { value: "space-around", label: "space-around" },
];

const wrapOptions: Array<{ value: FlexWrap; label: string }> = [
  { value: "nowrap", label: "nowrap" },
  { value: "wrap", label: "wrap" },
  { value: "wrap-reverse", label: "wrap-reverse" },
];

const alignSelfOptions: Array<{ value: AlignSelf; label: string }> = [
  { value: "auto", label: "auto" },
  { value: "flex-start", label: "flex-start" },
  { value: "flex-end", label: "flex-end" },
  { value: "center", label: "center" },
  { value: "stretch", label: "stretch" },
  { value: "baseline", label: "baseline" },
];

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
  const { setLive } = useLivePreviewActions<FlexboxState>();

  return (
    <ToolControlsShell
      onReset={onReset}
      className={className}
      beforeScroll={
        <ItemListPanel
          embedded
          state={state}
          onSelectItem={onSelectItem}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      }
    >
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium">Контейнер</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="flex-direction"
            value={state.flexDirection}
            options={directionOptions}
            onChange={(flexDirection) => onUpdate({ flexDirection })}
          />
          <SelectField
            label="justify-content"
            value={state.justifyContent}
            options={justifyOptions}
            onChange={(justifyContent) => onUpdate({ justifyContent })}
          />
          <SelectField
            label="align-items"
            value={state.alignItems}
            options={alignItemsOptions}
            onChange={(alignItems) => onUpdate({ alignItems })}
          />
          <SelectField
            label="align-content"
            value={state.alignContent}
            options={alignContentOptions}
            onChange={(alignContent) => onUpdate({ alignContent })}
          />
          <SelectField
            label="flex-wrap"
            value={state.flexWrap}
            options={wrapOptions}
            onChange={(flexWrap) => onUpdate({ flexWrap })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SliderField
            label="gap"
            value={state.gap}
            min={0}
            max={48}
            step={1}
            format={(value) => `${value}px`}
            onChange={(gap) => onUpdate({ gap })}
          />
          <SliderField
            label="padding"
            value={state.padding}
            min={0}
            max={48}
            step={1}
            format={(value) => `${value}px`}
            onChange={(padding) => onUpdate({ padding })}
          />
          <SliderField
            label="min-height"
            value={state.minHeight}
            min={120}
            max={480}
            step={4}
            format={(value) => `${value}px`}
            onChange={(minHeight) => onUpdate({ minHeight })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ColorPicker
            label="Фон контейнера"
            color={state.bgColor}
            opacity={1}
            showOpacity={false}
            onLiveColorChange={(bgColor) => setLive((prev) => ({ ...prev, bgColor }))}
            onColorChange={(bgColor) => onUpdate({ bgColor })}
            onOpacityChange={() => undefined}
          />
          <ColorPicker
            label="Фон preview"
            color={state.containerBgColor}
            opacity={1}
            showOpacity={false}
            onLiveColorChange={(containerBgColor) =>
              setLive((prev) => ({ ...prev, containerBgColor }))
            }
            onColorChange={(containerBgColor) => onUpdate({ containerBgColor })}
            onOpacityChange={() => undefined}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium">
          {selectedItem
            ? `Элемент ${selectedItem.label}`
            : "Элемент (выберите в preview)"}
        </h3>

        {!selectedItem ? (
          <p className="text-sm text-muted-foreground">
            Выберите элемент, чтобы настроить flex-grow, order и другие свойства.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <SliderField
                label="flex-grow"
                value={selectedItem.flexGrow}
                min={0}
                max={5}
                step={1}
                format={(value) => String(value)}
                onChange={(flexGrow) =>
                  onUpdateItem(selectedItem.id, { flexGrow })
                }
              />
              <SliderField
                label="flex-shrink"
                value={selectedItem.flexShrink}
                min={0}
                max={5}
                step={1}
                format={(value) => String(value)}
                onChange={(flexShrink) =>
                  onUpdateItem(selectedItem.id, { flexShrink })
                }
              />
              <SliderField
                label="order"
                value={selectedItem.order}
                min={-5}
                max={5}
                step={1}
                format={(value) => String(value)}
                onChange={(order) => onUpdateItem(selectedItem.id, { order })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="flex-basis-auto"
                checked={selectedItem.flexBasisAuto}
                onCheckedChange={(checked) =>
                  onUpdateItem(selectedItem.id, {
                    flexBasisAuto: checked === true,
                  })
                }
              />
              <Label htmlFor="flex-basis-auto">flex-basis: auto</Label>
            </div>

            {!selectedItem.flexBasisAuto && (
              <SliderField
                label="flex-basis"
                value={selectedItem.flexBasis}
                min={0}
                max={320}
                step={4}
                format={(value) => `${value}px`}
                onChange={(flexBasis) =>
                  onUpdateItem(selectedItem.id, { flexBasis })
                }
              />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="align-self"
                value={selectedItem.alignSelf}
                options={alignSelfOptions}
                onChange={(alignSelf) =>
                  onUpdateItem(selectedItem.id, { alignSelf })
                }
              />
              <ColorPicker
                label="Цвет элемента"
                color={selectedItem.bgColor}
                opacity={1}
                showOpacity={false}
                onLiveColorChange={(bgColor) =>
                  setLive((prev) => ({
                    ...prev,
                    items: prev.items.map((item) =>
                      item.id === selectedItem.id ? { ...item, bgColor } : item,
                    ),
                  }))
                }
                onColorChange={(bgColor) =>
                  onUpdateItem(selectedItem.id, { bgColor })
                }
                onOpacityChange={() => undefined}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SliderField
                label="width (0 = auto)"
                value={selectedItem.width ?? 0}
                min={0}
                max={320}
                step={4}
                format={(value) => (value === 0 ? "auto" : `${value}px`)}
                onChange={(width) =>
                  onUpdateItem(selectedItem.id, {
                    width: width === 0 ? null : width,
                  })
                }
              />
              <SliderField
                label="height (0 = auto)"
                value={selectedItem.height ?? 0}
                min={0}
                max={320}
                step={4}
                format={(value) => (value === 0 ? "auto" : `${value}px`)}
                onChange={(height) =>
                  onUpdateItem(selectedItem.id, {
                    height: height === 0 ? null : height,
                  })
                }
              />
            </div>
          </>
        )}
      </div>
    </ToolControlsShell>
  );
}
