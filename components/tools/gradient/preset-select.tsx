"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { gradientPresets } from "@/components/tools/gradient/presets";
import type { GradientPreset } from "@/components/tools/gradient/types";
import { cn } from "@/lib/utils";

interface PresetSelectProps {
  onSelect: (preset: GradientPreset) => void;
  className?: string;
}

export function PresetSelect({ onSelect, className }: PresetSelectProps) {
  const [value, setValue] = useState<string>("");

  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <Label htmlFor="gradient-preset" className="shrink-0 text-sm font-medium">
        Пресет
      </Label>
      <Select
        value={value}
        onValueChange={(presetId) => {
          const preset = gradientPresets.find((item) => item.id === presetId);
          if (!preset) return;
          setValue(presetId);
          onSelect(preset);
        }}
      >
        <SelectTrigger id="gradient-preset" className="w-full max-w-xs">
          <SelectValue placeholder="Выберите пресет" />
        </SelectTrigger>
        <SelectContent>
          {gradientPresets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
