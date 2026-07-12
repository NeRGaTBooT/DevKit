"use client";

import {
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateCwIcon,
} from "lucide-react";

import { CROP_PRESETS } from "@/components/tools/image-cropper/crop-presets";
import type {
  CropRect,
  ExportOptions,
  ImageFormat,
  ImageTransform,
} from "@/components/tools/image-cropper/types";
import { SliderField } from "@/components/shared/slider-field";
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
import { FORMAT_LABELS } from "@/lib/media/format";

export interface CropControlsProps {
  presetId: string;
  cropRect: CropRect;
  transform: ImageTransform;
  exportOptions: ExportOptions;
  disabled?: boolean;
  onPresetChange: (presetId: string) => void;
  onCropFieldChange: (field: keyof CropRect, value: number) => void;
  onRotate: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onExportFormatChange: (format: ImageFormat) => void;
  onQualityChange: (quality: number) => void;
}

export function CropControls({
  presetId,
  cropRect,
  transform,
  exportOptions,
  disabled = false,
  onPresetChange,
  onCropFieldChange,
  onRotate,
  onFlipH,
  onFlipV,
  onExportFormatChange,
  onQualityChange,
}: CropControlsProps) {
  const showQuality =
    exportOptions.format === "jpg" || exportOptions.format === "webp";

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label>Пропорции</Label>
        <div className="flex flex-wrap gap-2">
          {CROP_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              size="sm"
              variant={presetId === preset.id ? "default" : "outline"}
              disabled={disabled}
              onClick={() => onPresetChange(preset.id)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["x", "y", "width", "height"] as const).map((field) => (
          <div key={field} className="space-y-1">
            <Label className="text-xs uppercase">{field}</Label>
            <Input
              type="number"
              min={0}
              value={Math.round(cropRect[field])}
              disabled={disabled}
              onChange={(event) =>
                onCropFieldChange(field, Number(event.target.value))
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onRotate}>
          <RotateCwIcon />
          90°
        </Button>
        <Button
          type="button"
          variant={transform.flipH ? "default" : "outline"}
          size="sm"
          disabled={disabled}
          onClick={onFlipH}
        >
          <FlipHorizontalIcon />
          Flip H
        </Button>
        <Button
          type="button"
          variant={transform.flipV ? "default" : "outline"}
          size="sm"
          disabled={disabled}
          onClick={onFlipV}
        >
          <FlipVerticalIcon />
          Flip V
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Формат экспорта</Label>
        <Select
          value={exportOptions.format}
          onValueChange={(value) => onExportFormatChange(value as ImageFormat)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(["jpg", "png", "webp"] as ImageFormat[]).map((format) => (
              <SelectItem key={format} value={format}>
                {FORMAT_LABELS[format]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showQuality && (
        <SliderField
          label="Качество"
          value={Math.round(exportOptions.quality * 100)}
          min={60}
          max={100}
          step={5}
          format={(value) => `${value}%`}
          onChange={(value) => onQualityChange(value / 100)}
        />
      )}
    </div>
  );
}
