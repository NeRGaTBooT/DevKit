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
import { cssFilterPresets } from "@/components/tools/css-filter/presets";
import type { CssFilterPreset } from "@/components/tools/css-filter/types";
import { cn } from "@/lib/utils";

interface PresetSelectProps {
  onSelect: (preset: CssFilterPreset) => void;
  className?: string;
}

export function PresetSelect({ onSelect, className }: PresetSelectProps) {
  const [value, setValue] = useState<string>("");

  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <Label htmlFor="css-filter-preset" className="shrink-0 text-sm font-medium">
        Пресет
      </Label>
      <Select
        value={value}
        onValueChange={(presetId) => {
          const preset = cssFilterPresets.find((item) => item.id === presetId);
          if (!preset) return;
          setValue(presetId);
          onSelect(preset);
        }}
      >
        <SelectTrigger id="css-filter-preset" className="w-full max-w-xs">
          <SelectValue placeholder="Выберите пресет" />
        </SelectTrigger>
        <SelectContent>
          {cssFilterPresets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
