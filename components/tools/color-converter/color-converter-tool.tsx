"use client";

import { DropletIcon } from "lucide-react";

import { ColorPicker } from "@/components/shared/color-picker";
import { CopyButton } from "@/components/shared/copy-button";
import { SliderField } from "@/components/shared/slider-field";
import {
  formatColorMix,
  formatHsl,
  formatRgb,
} from "@/components/tools/color-converter/color-converter-logic";
import { useColorConverter } from "@/components/tools/color-converter/use-color-converter";
import { ToolLoading } from "@/components/tools/tool-loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ColorConverterTool() {
  const {
    state,
    hydrated,
    setFromHex,
    setRgbChannel,
    setHslChannel,
  } = useColorConverter();

  if (!hydrated) {
    return <ToolLoading />;
  }

  const rgbString = formatRgb(state.rgb);
  const hslString = formatHsl(state.hsl);
  const colorMixString = formatColorMix(state.hex);

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DropletIcon className="size-4" />
          <span className="text-sm">Инструменты</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Color Converter</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Конвертация между HEX, RGB и HSL с color picker и копированием значений.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-4">
          <div
            className="h-32 w-full rounded-lg border border-border"
            style={{ backgroundColor: state.hex }}
            aria-label="Предпросмотр цвета"
          />

          <ColorPicker
            label="Color Picker"
            color={state.hex}
            opacity={1}
            onColorChange={setFromHex}
            onOpacityChange={() => {}}
            showOpacity={false}
          />

          <div className="space-y-2">
            <Label htmlFor="hex-input">HEX</Label>
            <Input
              id="hex-input"
              value={state.hex}
              onChange={(event) => setFromHex(event.target.value)}
              className="font-mono"
              spellCheck={false}
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">RGB</p>
            {(["r", "g", "b"] as const).map((channel) => (
              <SliderField
                key={channel}
                label={channel.toUpperCase()}
                value={state.rgb[channel]}
                max={255}
                onChange={(value) => setRgbChannel(channel, value)}
              />
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium">HSL</p>
            {(
              [
                { key: "h" as const, max: 360, label: "H", suffix: "°" },
                { key: "s" as const, max: 100, label: "S", suffix: "%" },
                { key: "l" as const, max: 100, label: "L", suffix: "%" },
              ] as const
            ).map(({ key, max, label, suffix }) => (
              <SliderField
                key={key}
                label={label}
                value={state.hsl[key]}
                max={max}
                format={(value) => `${value}${suffix}`}
                onChange={(value) => setHslChannel(key, value)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          {[
            { label: "HEX", value: state.hex },
            { label: "RGB", value: rgbString },
            { label: "HSL", value: hslString },
            { label: "color-mix()", value: colorMixString },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <Label>{item.label}</Label>
                <CopyButton value={item.value} />
              </div>
              <code className="rounded-md bg-muted px-3 py-2 font-mono text-sm break-all">
                {item.value}
              </code>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
