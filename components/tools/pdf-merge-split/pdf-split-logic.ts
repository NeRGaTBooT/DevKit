import { PDFDocument } from "pdf-lib";

import type { SplitMode, SplitResult, SplitResultFile } from "@/components/tools/pdf-merge-split/types";
import { replaceExtension } from "@/lib/media/format";
import { getPdfErrorMessage } from "@/lib/media/pdf-utils";
import { packZip } from "@/lib/media/zip";

export function parsePageList(input: string, totalPages: number): number[] {
  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const indices = new Set<number>();

  for (const part of parts) {
    const page = Number(part);
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      throw new Error(`Некорректная страница: ${part}. Доступно 1–${totalPages}.`);
    }
    indices.add(page - 1);
  }

  if (indices.size === 0) {
    throw new Error("Укажите хотя бы одну страницу.");
  }

  return [...indices].sort((a, b) => a - b);
}

export function parsePageRanges(input: string, totalPages: number): number[][] {
  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Укажите хотя бы один диапазон.");
  }

  const ranges: number[][] = [];

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(end|\d+)$/i);
    if (!rangeMatch) {
      throw new Error(`Некорректный диапазон: ${part}. Пример: 1-5, 6-10, 11-end`);
    }

    const start = Number(rangeMatch[1]);
    const endToken = rangeMatch[2].toLowerCase();
    const end = endToken === "end" ? totalPages : Number(endToken);

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 1 ||
      end > totalPages ||
      start > end
    ) {
      throw new Error(`Некорректный диапазон: ${part}. Доступно 1–${totalPages}.`);
    }

    const indices: number[] = [];
    for (let page = start; page <= end; page += 1) {
      indices.push(page - 1);
    }
    ranges.push(indices);
  }

  return ranges;
}

async function createPdfFromIndices(
  sourceBytes: Uint8Array,
  indices: number[],
): Promise<Blob> {
  const source = await PDFDocument.load(sourceBytes);
  const target = await PDFDocument.create();
  const pages = await target.copyPages(source, indices);
  for (const page of pages) {
    target.addPage(page);
  }
  const bytes = await target.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function splitPdf(
  file: File,
  mode: SplitMode,
  input: string,
  totalPages: number,
): Promise<SplitResult> {
  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const baseName = replaceExtension(file.name, "");
  const files: SplitResultFile[] = [];

  try {
    if (mode === "pages") {
      for (let page = 0; page < totalPages; page += 1) {
        const blob = await createPdfFromIndices(sourceBytes, [page]);
        files.push({
          name: `${baseName}-page-${page + 1}.pdf`,
          blob,
        });
      }
    } else if (mode === "ranges") {
      const ranges = parsePageRanges(input, totalPages);
      for (let index = 0; index < ranges.length; index += 1) {
        const range = ranges[index];
        const blob = await createPdfFromIndices(sourceBytes, range);
        const start = range[0] + 1;
        const end = range[range.length - 1] + 1;
        files.push({
          name: `${baseName}-${start}-${end}.pdf`,
          blob,
        });
      }
    } else {
      const indices = parsePageList(input, totalPages);
      const blob = await createPdfFromIndices(sourceBytes, indices);
      files.push({
        name: `${baseName}-extract.pdf`,
        blob,
      });
    }
  } catch (error) {
    throw new Error(getPdfErrorMessage(error));
  }

  if (files.length === 1) {
    return { files };
  }

  const zipBlob = await packZip(files);
  return {
    files,
    zipBlob,
    zipName: `${baseName}-split.zip`,
  };
}
