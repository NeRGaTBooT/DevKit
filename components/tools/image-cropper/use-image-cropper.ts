"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  initializeCropRect,
  updateCropField,
} from "@/components/tools/image-cropper/crop-canvas";
import { getPresetById } from "@/components/tools/image-cropper/crop-presets";
import {
  exportCroppedImage,
  getTransformedPreview,
  validateCropFile,
} from "@/components/tools/image-cropper/image-cropper-logic";
import type {
  CropRect,
  ExportOptions,
  ImageFormat,
  ImageTransform,
} from "@/components/tools/image-cropper/types";
import {
  DEFAULT_EXPORT_OPTIONS,
  DEFAULT_TRANSFORM,
} from "@/components/tools/image-cropper/types";
import { clampCropRect } from "@/lib/media/image-canvas";

export function useImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [presetId, setPresetId] = useState("free");
  const [cropRect, setCropRect] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [transform, setTransform] = useState<ImageTransform>(DEFAULT_TRANSFORM);
  const [exportOptions, setExportOptions] =
    useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);
  const [isExporting, setIsExporting] = useState(false);
  const [exportPreviewUrl, setExportPreviewUrl] = useState<string | null>(null);
  const [exportName, setExportName] = useState<string | null>(null);

  const preset = getPresetById(presetId);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (exportPreviewUrl) URL.revokeObjectURL(exportPreviewUrl);
    };
  }, [exportPreviewUrl, imageUrl]);

  const refreshPreview = useCallback(
    async (
      nextFile: File,
      nextTransform: ImageTransform,
      aspectRatio: number | null,
    ) => {
      const preview = await getTransformedPreview(nextFile, nextTransform);
      const rect = initializeCropRect(preview.width, preview.height, aspectRatio);

      setImageUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return preview.url;
      });
      setImageSize({ width: preview.width, height: preview.height });
      setCropRect(rect);
    },
    [],
  );

  const handleFileChange = useCallback(
    async (files: File[]) => {
      const nextFile = files[0] ?? null;
      setExportPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      setExportName(null);

      if (!nextFile) {
        setFile(null);
        setImageUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return null;
        });
        return;
      }

      const validationError = validateCropFile(nextFile);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setFile(nextFile);
      setTransform(DEFAULT_TRANSFORM);
      setPresetId("free");
      await refreshPreview(nextFile, DEFAULT_TRANSFORM, null);
    },
    [refreshPreview],
  );

  const handlePresetChange = useCallback(
    async (nextPresetId: string) => {
      if (!file) return;

      const nextPreset = getPresetById(nextPresetId);
      setPresetId(nextPresetId);
      setCropRect(
        initializeCropRect(imageSize.width, imageSize.height, nextPreset.aspectRatio),
      );
    },
    [file, imageSize.height, imageSize.width],
  );

  const handleCropChange = useCallback(
    (rect: CropRect) => {
      setCropRect(clampCropRect(rect, imageSize.width, imageSize.height, preset.aspectRatio));
    },
    [imageSize.height, imageSize.width, preset.aspectRatio],
  );

  const handleCropFieldChange = useCallback(
    (field: keyof CropRect, value: number) => {
      setCropRect((previous) =>
        updateCropField(
          previous,
          field,
          value,
          imageSize.width,
          imageSize.height,
          preset.aspectRatio,
        ),
      );
    },
    [imageSize.height, imageSize.width, preset.aspectRatio],
  );

  const handleRotate = useCallback(async () => {
    if (!file) return;

    const nextTransform: ImageTransform = {
      ...transform,
      rotation: ((transform.rotation + 90) % 360) as ImageTransform["rotation"],
    };
    setTransform(nextTransform);
    await refreshPreview(file, nextTransform, getPresetById(presetId).aspectRatio);
  }, [file, presetId, refreshPreview, transform]);

  const handleFlipH = useCallback(async () => {
    if (!file) return;
    const nextTransform = { ...transform, flipH: !transform.flipH };
    setTransform(nextTransform);
    await refreshPreview(file, nextTransform, getPresetById(presetId).aspectRatio);
  }, [file, presetId, refreshPreview, transform]);

  const handleFlipV = useCallback(async () => {
    if (!file) return;
    const nextTransform = { ...transform, flipV: !transform.flipV };
    setTransform(nextTransform);
    await refreshPreview(file, nextTransform, getPresetById(presetId).aspectRatio);
  }, [file, presetId, refreshPreview, transform]);

  const handleExportFormatChange = useCallback((format: ImageFormat) => {
    setExportOptions((previous) => ({ ...previous, format }));
  }, []);

  const handleQualityChange = useCallback((quality: number) => {
    setExportOptions((previous) => ({ ...previous, quality }));
  }, []);

  const exportCrop = useCallback(async () => {
    if (!file) {
      toast.error("Выберите изображение.");
      return;
    }

    setIsExporting(true);
    setExportPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });

    try {
      const result = await exportCroppedImage(
        file,
        cropRect,
        transform,
        exportOptions,
        preset.exportSize,
      );
      setExportPreviewUrl(result.previewUrl);
      setExportName(result.name);
      toast.success("Экспорт готов");
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось экспортировать изображение.";
      toast.error(message);
      return null;
    } finally {
      setIsExporting(false);
    }
  }, [cropRect, exportOptions, file, preset.exportSize, transform]);

  const reset = useCallback(() => {
    handleFileChange([]);
    setTransform(DEFAULT_TRANSFORM);
    setExportOptions(DEFAULT_EXPORT_OPTIONS);
    setPresetId("free");
  }, [handleFileChange]);

  return {
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
  };
}
