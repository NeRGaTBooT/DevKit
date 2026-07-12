"use client";

import { useState } from "react";

import { borderRadiusPresets } from "@/components/tools/border-radius/presets";
import type { BorderRadiusPreset } from "@/components/tools/border-radius/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PresetSelectProps {
  onSelect: (preset: BorderRadiusPreset) => void;
  className?: string;
}

export function PresetSelect({ onSelect, className }: PresetSelectProps) {
  const [value, setValue] = useState<string>("");

  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <Label htmlFor="border-radius-preset" className="shrink-0 text-sm font-medium">
        Пресет
      </Label>
      <Select
        value={value}
        onValueChange={(presetId) => {
          const preset = borderRadiusPresets.find((item) => item.id === presetId);
          if (!preset) return;
          setValue(presetId);
          onSelect(preset);
        }}
      >
        <SelectTrigger id="border-radius-preset" className="w-full max-w-xs">
          <SelectValue placeholder="Выберите пресет" />
        </SelectTrigger>
        <SelectContent>
          {borderRadiusPresets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
