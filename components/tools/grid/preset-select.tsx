"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gridPresets } from "@/components/tools/grid/presets";
import type { GridPreset } from "@/components/tools/grid/types";

interface PresetSelectProps {
  onSelect: (preset: GridPreset) => void;
}

export function PresetSelect({ onSelect }: PresetSelectProps) {
  return (
    <Select
      onValueChange={(id) => {
        const preset = gridPresets.find((item) => item.id === id);
        if (preset) onSelect(preset);
      }}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Выбрать пресет..." />
      </SelectTrigger>
      <SelectContent>
        {gridPresets.map((preset) => (
          <SelectItem key={preset.id} value={preset.id}>
            {preset.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
