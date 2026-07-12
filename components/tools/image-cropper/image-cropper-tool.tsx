"use client";

import { CropIcon, DownloadIcon, Loader2Icon } from "lucide-react";

import { CropCanvas } from "@/components/tools/image-cropper/crop-canvas";
import { CropControls } from "@/components/tools/image-cropper/crop-controls";
import { downloadBlob } from "@/components/tools/image-cropper/image-cropper-logic";
import { useImageCropper } from "@/components/tools/image-cropper/use-image-cropper";
import { ACCEPTED_EXTENSIONS } from "@/components/tools/image-cropper/types";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { getPresetById } from "@/components/tools/image-cropper/crop-presets";
import { Button } from "@/components/ui/button";

export function ImageCropperTool() {
  const {
    file,
    imageUrl,
    imageSize,
    presetId,
    cropRect,
    transform,
    exportOptions,
    isExporting,
    exportPreviewUrl,
    exportName,
    handleFileChange,
    handlePresetChange,
    handleCropChange,
    handleCropFieldChange,
    handleRotate,
    handleFlipH,
    handleFlipV,
    handleExportFormatChange,
    handleQualityChange,
    exportCrop,
    reset,
  } = useImageCropper();

  const preset = getPresetById(presetId);

  const handleDownload = async () => {
    const result = await exportCrop();
    if (result) {
      downloadBlob(result.blob, result.name);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CropIcon className="size-4" />
          <span className="text-sm">Инструменты</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Image Cropper</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Обрезка изображения с presets, поворотом и экспортом в JPG, PNG или WEBP.
          Один файл за раз, обработка локально в браузере.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-4">
          <FileDropzone
            files={file ? [file] : []}
            onFilesChange={handleFileChange}
            accept={ACCEPTED_EXTENSIONS}
            multiple={false}
            maxFiles={1}
            disabled={isExporting}
          />

          {imageUrl && imageSize.width > 0 && (
            <>
              <CropCanvas
                imageUrl={imageUrl}
                imageWidth={imageSize.width}
                imageHeight={imageSize.height}
                cropRect={cropRect}
                aspectRatio={preset.aspectRatio}
                onCropChange={handleCropChange}
              />

              <CropControls
                presetId={presetId}
                cropRect={cropRect}
                transform={transform}
                exportOptions={exportOptions}
                disabled={isExporting}
                onPresetChange={handlePresetChange}
                onCropFieldChange={handleCropFieldChange}
                onRotate={handleRotate}
                onFlipH={handleFlipH}
                onFlipV={handleFlipV}
                onExportFormatChange={handleExportFormatChange}
                onQualityChange={handleQualityChange}
              />

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleDownload} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2Icon className="animate-spin" />
                      Экспорт…
                    </>
                  ) : (
                    <>
                      <DownloadIcon />
                      Скачать
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  disabled={isExporting}
                >
                  Очистить
                </Button>
              </div>
            </>
          )}
        </section>

        <div className="flex flex-col gap-4">
          {imageUrl ? (
            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-medium">Preview</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">До</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Original"
                    className="aspect-video w-full rounded border border-border object-contain bg-muted/20"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">После</p>
                  {exportPreviewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={exportPreviewUrl}
                      alt="Cropped"
                      className="aspect-video w-full rounded border border-border object-contain bg-muted/20"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
                      Нажмите «Скачать» для preview
                    </div>
                  )}
                </div>
              </div>
              {exportName && (
                <p className="text-xs text-muted-foreground">Файл: {exportName}</p>
              )}
            </section>
          ) : (
            <section className="flex flex-col justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              <p>Загрузите изображение для обрезки.</p>
              <ul className="list-disc space-y-1 pl-5 text-xs">
                <li>Presets: 1:1, 16:9, OG 1200×630, Stories 9:16</li>
                <li>Точная обрезка по X, Y, Width, Height</li>
                <li>Поворот 90° и отражение</li>
                <li>Лимит: 25 MB</li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
