"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  compressImages,
  revokeCompressionResult,
  validateImageFiles,
} from "@/components/tools/image-compressor/image-compressor-logic";
import type {
  CompressOptions,
  CompressionProgress,
  CompressionResult,
  ResizeMode,
} from "@/components/tools/image-compressor/types";
import { DEFAULT_COMPRESS_OPTIONS } from "@/components/tools/image-compressor/types";
import { supportsQuality } from "@/lib/media/format";

export function useImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<CompressOptions>(DEFAULT_COMPRESS_OPTIONS);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressionProgress | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const hasPngOnly = useMemo(
    () => files.length > 0 && files.every((file) => file.type === "image/png"),
    [files],
  );

  const showQualitySlider = useMemo(
    () => files.some((file) => supportsQuality(file.type)),
    [files],
  );

  useEffect(() => {
    return () => revokeCompressionResult(result);
  }, [result]);

  const handleFilesChange = useCallback((nextFiles: File[]) => {
    setFiles(nextFiles);
    setResult((previous) => {
      revokeCompressionResult(previous);
      return null;
    });
  }, []);

  const setQuality = useCallback((quality: number) => {
    setOptions((previous) => ({ ...previous, quality }));
  }, []);

  const setResizeMode = useCallback((resizeMode: ResizeMode) => {
    setOptions((previous) => ({
      ...previous,
      resizeMode,
      resizeValue:
        resizeMode === "percent"
          ? 80
          : resizeMode === "maxLongSide"
            ? 1920
            : previous.resizeValue,
    }));
  }, []);

  const setResizeValue = useCallback((resizeValue: number) => {
    setOptions((previous) => ({ ...previous, resizeValue }));
  }, []);

  const compress = useCallback(async () => {
    const validationError = validateImageFiles(files);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsCompressing(true);
    setProgress(null);
    setResult((previous) => {
      revokeCompressionResult(previous);
      return null;
    });

    try {
      const nextResult = await compressImages(files, options, setProgress);
      setResult(nextResult);
      toast.success("Сжатие завершено");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось сжать изображения.";
      toast.error(message);
    } finally {
      setIsCompressing(false);
      setProgress(null);
    }
  }, [files, options]);

  const reset = useCallback(() => {
    setFiles([]);
    setResult((previous) => {
      revokeCompressionResult(previous);
      return null;
    });
    setProgress(null);
  }, []);

  return {
    files,
    options,
    isCompressing,
    progress,
    result,
    hasPngOnly,
    showQualitySlider,
    setFiles: handleFilesChange,
    setQuality,
    setResizeMode,
    setResizeValue,
    compress,
    reset,
  };
}
