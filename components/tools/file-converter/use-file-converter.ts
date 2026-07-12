"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  convertFiles,
  detectFilesKind,
  getAvailableOutputs,
  revokeConversionResult,
  validateFiles,
} from "@/components/tools/file-converter/file-converter-logic";
import type {
  ConversionProgress,
  ConversionResult,
  OutputFormat,
} from "@/components/tools/file-converter/types";

const DEFAULT_QUALITY = 0.85;
const DEFAULT_SCALE = 2;

export function useFileConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpg");
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [mergeToPdf, setMergeToPdf] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const inputKind = useMemo(() => detectFilesKind(files), [files]);

  const availableOutputs = useMemo(
    () => getAvailableOutputs(inputKind, files.length),
    [inputKind, files.length],
  );

  const effectiveOutputFormat = useMemo(() => {
    if (availableOutputs.includes(outputFormat)) return outputFormat;
    return availableOutputs[0] ?? "jpg";
  }, [availableOutputs, outputFormat]);

  useEffect(() => {
    return () => revokeConversionResult(result);
  }, [result]);

  const handleFilesChange = useCallback((nextFiles: File[]) => {
    setFiles(nextFiles);
    setResult((previous) => {
      revokeConversionResult(previous);
      return null;
    });
  }, []);

  const convert = useCallback(async () => {
    const validationError = validateFiles(files);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsConverting(true);
    setProgress(null);
    setResult((previous) => {
      revokeConversionResult(previous);
      return null;
    });

    try {
      const nextResult = await convertFiles(
        files,
        {
          outputFormat: effectiveOutputFormat,
          quality,
          scale,
          mergeToPdf,
        },
        setProgress,
      );
      setResult(nextResult);
      toast.success("Конвертация завершена");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось сконвертировать файлы.";
      toast.error(message);
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  }, [effectiveOutputFormat, files, mergeToPdf, quality, scale]);

  const reset = useCallback(() => {
    setFiles([]);
    setResult((previous) => {
      revokeConversionResult(previous);
      return null;
    });
    setProgress(null);
  }, []);

  return {
    files,
    outputFormat,
    quality,
    scale,
    mergeToPdf,
    isConverting,
    progress,
    result,
    inputKind,
    availableOutputs,
    effectiveOutputFormat,
    setFiles: handleFilesChange,
    setOutputFormat,
    setQuality,
    setScale,
    setMergeToPdf,
    convert,
    reset,
  };
}
