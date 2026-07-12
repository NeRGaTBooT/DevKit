"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  expandFilesToPages,
  fileToSplitPages,
} from "@/components/tools/pdf-merge-split/expand-files-to-pages";
import {
  downloadBlob,
  mergePages,
} from "@/components/tools/pdf-merge-split/pdf-merge-logic";
import {
  parsePageRanges,
  splitPdf,
} from "@/components/tools/pdf-merge-split/pdf-split-logic";
import type {
  MergeResult,
  PdfPageGridMode,
  PdfPageItem,
  PdfProgress,
  SplitMode,
  SplitResult,
} from "@/components/tools/pdf-merge-split/types";
import { MAX_FILE_SIZE_BYTES } from "@/lib/media/constants";
import { isImageFile, isPdfFile } from "@/lib/media/format";
import { getPdfErrorMessage } from "@/lib/media/pdf-utils";

function formatSelectedPages(pageNumbers: number[]): string {
  return [...pageNumbers].sort((a, b) => a - b).join(", ");
}

function parseSelectedPages(input: string): number[] {
  return input
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((page) => Number.isInteger(page) && page > 0);
}

export function usePdfMergeSplit() {
  const [activeTab, setActiveTab] = useState<"merge" | "split">("merge");

  const [mergePagesState, setMergePagesState] = useState<PdfPageItem[]>([]);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [isLoadingMergePreview, setIsLoadingMergePreview] = useState(false);
  const [mergeProgress, setMergeProgress] = useState<PdfProgress | null>(null);

  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPages, setSplitPages] = useState<PdfPageItem[]>([]);
  const [splitMode, setSplitMode] = useState<SplitMode>("pages");
  const [splitInput, setSplitInput] = useState("");
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [splitProgress, setSplitProgress] = useState<PdfProgress | null>(null);

  const splitPageCount = splitPages.length;

  const validateFileSize = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Файл «${file.name}» превышает лимит 25 MB.`;
    }
    return null;
  }, []);

  const addMergeFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const validFiles: File[] = [];

      for (const file of files) {
        const sizeError = validateFileSize(file);
        if (sizeError) {
          toast.error(sizeError);
          continue;
        }

        if (!isPdfFile(file) && !isImageFile(file)) {
          toast.error(
            `Файл «${file.name}» не поддерживается. Допустимы PDF и изображения.`,
          );
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setIsLoadingMergePreview(true);
      setMergeProgress(null);
      setMergeResult(null);

      try {
        const newPages = await expandFilesToPages(
          validFiles,
          mergePagesState.length,
          (current, total, message) => {
            setMergeProgress({ current, total, message });
          },
        );
        setMergePagesState((previous) => [...previous, ...newPages]);
      } catch (error) {
        toast.error(getPdfErrorMessage(error));
      } finally {
        setIsLoadingMergePreview(false);
        setMergeProgress(null);
      }
    },
    [mergePagesState.length, validateFileSize],
  );

  const removeMergePage = useCallback((id: string) => {
    setMergePagesState((previous) => previous.filter((page) => page.id !== id));
    setMergeResult(null);
  }, []);

  const reorderMergePages = useCallback((pages: PdfPageItem[]) => {
    setMergePagesState(pages);
    setMergeResult(null);
  }, []);

  const merge = useCallback(async () => {
    if (mergePagesState.length === 0) {
      toast.error("Добавьте хотя бы одну страницу.");
      return;
    }

    setIsMerging(true);
    setMergeProgress(null);
    setMergeResult(null);

    try {
      const result = await mergePages(mergePagesState, setMergeProgress);
      setMergeResult(result);
      toast.success("PDF объединён");
    } catch (error) {
      toast.error(getPdfErrorMessage(error));
    } finally {
      setIsMerging(false);
      setMergeProgress(null);
    }
  }, [mergePagesState]);

  const loadSplitFile = useCallback(
    async (file: File | null) => {
      setSplitFile(file);
      setSplitResult(null);
      setSplitPages([]);
      setSplitInput("");

      if (!file) return;

      const sizeError = validateFileSize(file);
      if (sizeError) {
        toast.error(sizeError);
        setSplitFile(null);
        return;
      }

      if (!isPdfFile(file)) {
        toast.error("Для разделения нужен PDF файл.");
        setSplitFile(null);
        return;
      }

      setIsLoadingPreview(true);
      try {
        const pages = await fileToSplitPages(file, (current, total) => {
          setSplitProgress({
            current,
            total,
            message: `Preview ${current}/${total}`,
          });
        });
        setSplitPages(pages);
      } catch (error) {
        toast.error(getPdfErrorMessage(error));
        setSplitFile(null);
      } finally {
        setIsLoadingPreview(false);
        setSplitProgress(null);
      }
    },
    [validateFileSize],
  );

  const setSplitInputValue = useCallback((input: string) => {
    setSplitInput(input);
    setSplitResult(null);
  }, []);

  const toggleSplitPageSelect = useCallback((pageNumber: number) => {
    setSplitInput((previous) => {
      const selected = new Set(parseSelectedPages(previous));
      if (selected.has(pageNumber)) {
        selected.delete(pageNumber);
      } else {
        selected.add(pageNumber);
      }
      return formatSelectedPages([...selected]);
    });
    setSplitResult(null);
  }, []);

  const splitGridMode: PdfPageGridMode = useMemo(() => {
    if (splitMode === "pages") return "readonly";
    if (splitMode === "ranges") return "highlight";
    return "select";
  }, [splitMode]);

  const splitSelectedPages = useMemo(
    () => parseSelectedPages(splitInput),
    [splitInput],
  );

  const splitHighlightedPages = useMemo(() => {
    if (splitMode !== "ranges" || !splitInput.trim() || splitPageCount === 0) {
      return [];
    }

    try {
      const ranges = parsePageRanges(splitInput, splitPageCount);
      const highlighted = new Set<number>();
      for (const range of ranges) {
        for (const pageIndex of range) {
          highlighted.add(pageIndex + 1);
        }
      }
      return [...highlighted];
    } catch {
      return [];
    }
  }, [splitInput, splitMode, splitPageCount]);

  const split = useCallback(async () => {
    if (!splitFile || splitPageCount === 0) {
      toast.error("Загрузите PDF файл.");
      return;
    }

    if (splitMode !== "pages" && !splitInput.trim()) {
      toast.error("Укажите страницы или диапазоны.");
      return;
    }

    setIsSplitting(true);
    setSplitResult(null);

    try {
      const result = await splitPdf(
        splitFile,
        splitMode,
        splitInput,
        splitPageCount,
      );
      setSplitResult(result);
      toast.success("PDF разделён");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : getPdfErrorMessage(error),
      );
    } finally {
      setIsSplitting(false);
    }
  }, [splitFile, splitInput, splitMode, splitPageCount]);

  const downloadMergeResult = useCallback(() => {
    if (mergeResult) {
      downloadBlob(mergeResult.blob, mergeResult.name);
    }
  }, [mergeResult]);

  const downloadSplitResult = useCallback(() => {
    if (!splitResult) return;

    if (splitResult.zipBlob) {
      downloadBlob(splitResult.zipBlob, splitResult.zipName ?? "split.zip");
      return;
    }

    const file = splitResult.files[0];
    if (file) {
      downloadBlob(file.blob, file.name);
    }
  }, [splitResult]);

  const resetMerge = useCallback(() => {
    for (const page of mergePagesState) {
      if (page.kind === "image" && page.thumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(page.thumbnail);
      }
    }
    setMergePagesState([]);
    setMergeResult(null);
  }, [mergePagesState]);

  const resetSplit = useCallback(() => {
    setSplitFile(null);
    setSplitPages([]);
    setSplitInput("");
    setSplitResult(null);
  }, []);

  return {
    activeTab,
    setActiveTab,
    mergePages: mergePagesState,
    mergeResult,
    isMerging,
    isLoadingMergePreview,
    mergeProgress,
    addMergeFiles,
    removeMergePage,
    reorderMergePages,
    merge,
    downloadMergeResult,
    resetMerge,
    splitFile,
    splitPageCount,
    splitPages,
    splitMode,
    splitInput,
    splitResult,
    isSplitting,
    isLoadingPreview,
    splitProgress,
    splitGridMode,
    splitSelectedPages,
    splitHighlightedPages,
    setSplitMode,
    setSplitInput: setSplitInputValue,
    toggleSplitPageSelect,
    loadSplitFile,
    split,
    downloadSplitResult,
    resetSplit,
  };
}
