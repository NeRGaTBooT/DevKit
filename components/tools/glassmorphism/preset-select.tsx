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
import { glassmorphismPresets } from "@/components/tools/glassmorphism/presets";
import type { GlassmorphismPreset } from "@/components/tools/glassmorphism/types";
import { cn } from "@/lib/utils";

interface PresetSelectProps {
  onSelect: (preset: GlassmorphismPreset) => void;
  className?: string;
}

export function PresetSelect({ onSelect, className }: PresetSelectProps) {
  const [value, setValue] = useState<string>("");

  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <Label
        htmlFor="glassmorphism-preset"
        className="shrink-0 text-sm font-medium"
      >
        Пресет
      </Label>
      <Select
        value={value}
        onValueChange={(presetId) => {
          const preset = glassmorphismPresets.find((item) => item.id === presetId);
          if (!preset) return;
          setValue(presetId);
          onSelect(preset);
        }}
      >
        <SelectTrigger id="glassmorphism-preset" className="w-full max-w-xs">
          <SelectValue placeholder="Выберите пресет" />
        </SelectTrigger>
        <SelectContent>
          {glassmorphismPresets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
