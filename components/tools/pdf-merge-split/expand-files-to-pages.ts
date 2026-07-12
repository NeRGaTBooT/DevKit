import type { PdfPageItem } from "@/components/tools/pdf-merge-split/types";
import { MAX_PDF_PAGES } from "@/lib/media/constants";
import { isImageFile, isPdfFile } from "@/lib/media/format";
import {
  getPdfPageCount,
  renderFilePageThumbnails,
} from "@/lib/media/pdf-utils";

export function getFileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export async function expandFilesToPages(
  files: File[],
  existingPageCount: number,
  onProgress?: (current: number, total: number, message: string) => void,
): Promise<PdfPageItem[]> {
  const newPages: PdfPageItem[] = [];
  let totalNewPages = 0;

  for (const file of files) {
    if (isPdfFile(file)) {
      totalNewPages += await getPdfPageCount(file);
    } else if (isImageFile(file)) {
      totalNewPages += 1;
    }
  }

  if (existingPageCount + totalNewPages > MAX_PDF_PAGES) {
    throw new Error(
      `Суммарно ${existingPageCount + totalNewPages} страниц. Максимум — ${MAX_PDF_PAGES}.`,
    );
  }

  let processedPages = 0;

  for (const file of files) {
    if (isPdfFile(file)) {
      const pageCount = await getPdfPageCount(file);
      const thumbnails = await renderFilePageThumbnails(
        file,
        pageCount,
        0.2,
        (current, total) => {
          onProgress?.(
            existingPageCount + processedPages + current,
            existingPageCount + totalNewPages,
            `Preview ${file.name} · ${current}/${total}`,
          );
        },
      );

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
        newPages.push({
          id: crypto.randomUUID(),
          file,
          kind: "pdf",
          pageIndex,
          pageNumber: pageIndex + 1,
          thumbnail: thumbnails[pageIndex] ?? "",
          sourceLabel: file.name,
        });
      }

      processedPages += pageCount;
    } else if (isImageFile(file)) {
      onProgress?.(
        existingPageCount + processedPages + 1,
        existingPageCount + totalNewPages,
        `Preview ${file.name}`,
      );

      newPages.push({
        id: crypto.randomUUID(),
        file,
        kind: "image",
        pageIndex: 0,
        pageNumber: 1,
        thumbnail: URL.createObjectURL(file),
        sourceLabel: file.name,
      });

      processedPages += 1;
    }
  }

  return newPages;
}

export async function fileToSplitPages(
  file: File,
  onProgress?: (current: number, total: number) => void,
): Promise<PdfPageItem[]> {
  const pageCount = await getPdfPageCount(file);
  if (pageCount > MAX_PDF_PAGES) {
    throw new Error(
      `PDF содержит ${pageCount} страниц. Максимум — ${MAX_PDF_PAGES}.`,
    );
  }

  const thumbnails = await renderFilePageThumbnails(
    file,
    pageCount,
    0.2,
    onProgress,
  );

  return thumbnails.map((thumbnail, pageIndex) => ({
    id: crypto.randomUUID(),
    file,
    kind: "pdf" as const,
    pageIndex,
    pageNumber: pageIndex + 1,
    thumbnail,
    sourceLabel: file.name,
  }));
}
