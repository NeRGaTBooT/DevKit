"use client";

import { Loader2Icon, Minimize2Icon } from "lucide-react";

import { CompressionResultPanel } from "@/components/tools/image-compressor/compression-result-panel";
import { useImageCompressor } from "@/components/tools/image-compressor/use-image-compressor";
import {
  ACCEPTED_EXTENSIONS,
  RESIZE_MODE_LABELS,
  type ResizeMode,
} from "@/components/tools/image-compressor/types";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { SliderField } from "@/components/shared/slider-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ImageCompressorTool() {
  const {
    files,
    options,
    isCompressing,
    progress,
    result,
    hasPngOnly,
    showQualitySlider,
    setFiles,
    setQuality,
    setResizeMode,
    setResizeValue,
    compress,
    reset,
  } = useImageCompressor();

  const resizeSliderConfig =
    options.resizeMode === "percent"
      ? { min: 10, max: 100, step: 5, format: (value: number) => `${value}%` }
      : options.resizeMode === "maxLongSide"
        ? { min: 320, max: 4096, step: 80, format: (value: number) => `${value} px` }
        : null;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Minimize2Icon className="size-4" />
          <span className="text-sm">Инструменты</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Image Compressor</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Сжатие изображений без смены формата (JPG → JPG, PNG → PNG, WEBP → WEBP).
          Обработка локально в браузере.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-4">
          <FileDropzone
            files={files}
            onFilesChange={setFiles}
            accept={ACCEPTED_EXTENSIONS}
            multiple
            disabled={isCompressing}
          />

          <div className="space-y-2">
            <Label>Изменение разрешения</Label>
            <Select
              value={options.resizeMode}
              onValueChange={(value) => setResizeMode(value as ResizeMode)}
              disabled={isCompressing}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(RESIZE_MODE_LABELS) as ResizeMode[]).map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {RESIZE_MODE_LABELS[mode]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {resizeSliderConfig && (
            <SliderField
              label={
                options.resizeMode === "percent"
                  ? "Масштаб"
                  : "Макс. длинная сторона"
              }
              value={options.resizeValue}
              min={resizeSliderConfig.min}
              max={resizeSliderConfig.max}
              step={resizeSliderConfig.step}
              format={resizeSliderConfig.format}
              onChange={setResizeValue}
            />
          )}

          {showQualitySlider && (
            <SliderField
              label="Качество JPG / WEBP"
              value={Math.round(options.quality * 100)}
              min={60}
              max={100}
              step={5}
              format={(value) => `${value}%`}
              onChange={(value) => setQuality(value / 100)}
            />
          )}

          {hasPngOnly && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
              PNG — lossless: качество не влияет на размер. Уменьшите разрешение или
              используйте File Converter для смены формата.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={compress}
              disabled={isCompressing || files.length === 0}
            >
              {isCompressing ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Сжатие…
                </>
              ) : (
                "Сжать"
              )}
            </Button>
            {files.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={isCompressing}
              >
                Очистить
              </Button>
            )}
          </div>

          {progress && (
            <p className="text-sm text-muted-foreground">
              {progress.message} ({progress.current}/{progress.total})
            </p>
          )}
        </section>

        <div className="flex flex-col gap-4">
          {result ? (
            <CompressionResultPanel result={result} />
          ) : (
            <section className="flex flex-col justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              <p>Результат появится здесь после сжатия.</p>
              <ul className="list-disc space-y-1 pl-5 text-xs">
                <li>Формат на выходе совпадает с исходным</li>
                <li>Preview «до / после» с размером в KB и px</li>
                <li>Несколько файлов → ZIP</li>
                <li>Лимит: 25 MB на файл</li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
