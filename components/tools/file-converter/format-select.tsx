"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FORMAT_LABELS,
  type OutputFormat,
} from "@/components/tools/file-converter/types";

export interface FormatSelectProps {
  value: OutputFormat;
  options: OutputFormat[];
  onChange: (value: OutputFormat) => void;
  disabled?: boolean;
}

export function FormatSelect({
  value,
  options,
  onChange,
  disabled = false,
}: FormatSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Выходной формат</Label>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as OutputFormat)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите формат" />
        </SelectTrigger>
        <SelectContent>
          {options.map((format) => (
            <SelectItem key={format} value={format}>
              {FORMAT_LABELS[format]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
