"use client";

import { FileImageIcon, Loader2Icon } from "lucide-react";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { SliderField } from "@/components/shared/slider-field";
import { FormatSelect } from "@/components/tools/file-converter/format-select";
import { ResultPanel } from "@/components/tools/file-converter/result-panel";
import { useFileConverter } from "@/components/tools/file-converter/use-file-converter";
import { ACCEPTED_EXTENSIONS } from "@/components/tools/file-converter/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function FileConverterTool() {
  const {
    files,
    effectiveOutputFormat,
    quality,
    scale,
    mergeToPdf,
    isConverting,
    progress,
    result,
    inputKind,
    availableOutputs,
    setFiles,
    setOutputFormat,
    setQuality,
    setScale,
    setMergeToPdf,
    convert,
    reset,
  } = useFileConverter();

  const showMergeOption =
    inputKind === "image" && files.length > 1 && effectiveOutputFormat === "pdf";
  const showQualitySlider =
    effectiveOutputFormat === "jpg" ||
    effectiveOutputFormat === "webp" ||
    inputKind === "pdf";
  const showScaleSlider = inputKind === "pdf";

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileImageIcon className="size-4" />
          <span className="text-sm">Инструменты</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">File Converter</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Конвертация PDF и изображений (JPG, PNG, WEBP) локально в браузере.
          Файлы не загружаются на сервер.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-4">
          <FileDropzone
            files={files}
            onFilesChange={setFiles}
            accept={ACCEPTED_EXTENSIONS}
            multiple
            disabled={isConverting}
            maxFiles={inputKind === "pdf" ? 1 : undefined}
          />

          <FormatSelect
            value={effectiveOutputFormat}
            options={availableOutputs}
            onChange={setOutputFormat}
            disabled={isConverting || availableOutputs.length === 0}
          />

          {showQualitySlider && (
            <SliderField
              label="Качество JPG / WEBP"
              value={Math.round(quality * 100)}
              min={60}
              max={100}
              step={5}
              format={(value) => `${value}%`}
              onChange={(value) => setQuality(value / 100)}
            />
          )}

          {showScaleSlider && (
            <SliderField
              label="Масштаб PDF → изображение"
              value={scale}
              min={1}
              max={2}
              step={0.5}
              format={(value) => `${value}x`}
              onChange={setScale}
            />
          )}

          {showMergeOption && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="merge-to-pdf"
                checked={mergeToPdf}
                onCheckedChange={(checked) => setMergeToPdf(checked === true)}
                disabled={isConverting}
              />
              <Label htmlFor="merge-to-pdf" className="font-normal">
                Объединить изображения в один PDF
              </Label>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={convert}
              disabled={isConverting || files.length === 0}
            >
              {isConverting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Конвертация…
                </>
              ) : (
                "Конвертировать"
              )}
            </Button>
            {files.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={isConverting}
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
            <ResultPanel result={result} />
          ) : (
            <section className="flex flex-col justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              <p>Результат появится здесь после конвертации.</p>
              <ul className="list-disc space-y-1 pl-5 text-xs">
                <li>PDF → JPG / PNG / WEBP (все страницы, ZIP при нескольких)</li>
                <li>Изображения → другой формат или PDF</li>
                <li>Лимит: 25 MB на файл, до 100 страниц PDF</li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
