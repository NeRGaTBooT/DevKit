"use client";

import type { SplitMode } from "@/components/tools/pdf-merge-split/types";
import { SPLIT_MODE_LABELS } from "@/components/tools/pdf-merge-split/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SplitOptionsPanelProps {
  mode: SplitMode;
  input: string;
  totalPages: number;
  disabled?: boolean;
  onModeChange: (mode: SplitMode) => void;
  onInputChange: (input: string) => void;
}

export function SplitOptionsPanel({
  mode,
  input,
  totalPages,
  disabled = false,
  onModeChange,
  onInputChange,
}: SplitOptionsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label>Режим разделения</Label>
        <Select
          value={mode}
          onValueChange={(value) => onModeChange(value as SplitMode)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SPLIT_MODE_LABELS) as SplitMode[]).map((splitMode) => (
              <SelectItem key={splitMode} value={splitMode}>
                {SPLIT_MODE_LABELS[splitMode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {mode === "pages" && (
        <p className="text-xs text-muted-foreground">
          Каждая из {totalPages} страниц будет сохранена в отдельный PDF. Результат — ZIP.
        </p>
      )}

      {mode === "ranges" && (
        <div className="space-y-2">
          <Label>Диапазоны</Label>
          <Input
            value={input}
            placeholder="1-5, 6-10, 11-end"
            disabled={disabled}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Пример: 1-5, 6-10, 11-end · подсветка в превью · всего страниц:{" "}
            {totalPages}
          </p>
        </div>
      )}

      {mode === "extract" && (
        <div className="space-y-2">
          <Label>Страницы</Label>
          <Input
            value={input}
            placeholder="3, 7, 12"
            disabled={disabled}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Номера через запятую или кликните по превью · всего страниц:{" "}
            {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}

export function getExtractSelectedPages(input: string): number[] {
  return input
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((page) => Number.isInteger(page) && page > 0);
}
