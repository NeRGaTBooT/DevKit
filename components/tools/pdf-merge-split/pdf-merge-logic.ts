import { PDFDocument } from "pdf-lib";

import { getFileKey } from "@/components/tools/pdf-merge-split/expand-files-to-pages";
import type {
  MergeItem,
  MergeResult,
  PdfPageItem,
  PdfProgress,
} from "@/components/tools/pdf-merge-split/types";
import { isImageFile, isPdfFile } from "@/lib/media/format";
import { bitmapToBlob, loadImageBitmap } from "@/lib/media/image-canvas";
import { getPdfErrorMessage } from "@/lib/media/pdf-utils";

export function createMergeItem(file: File): MergeItem | null {
  if (isPdfFile(file)) {
    return { id: crypto.randomUUID(), file, kind: "pdf" };
  }
  if (isImageFile(file)) {
    return { id: crypto.randomUUID(), file, kind: "image" };
  }
  return null;
}

async function embedImagePage(pdf: PDFDocument, file: File): Promise<void> {
  let bytes = new Uint8Array(await file.arrayBuffer());
  let isPng = file.type === "image/png";

  if (file.type === "image/webp") {
    const bitmap = await loadImageBitmap(file);
    const pngBlob = await bitmapToBlob(bitmap, "image/png");
    bitmap.close();
    bytes = new Uint8Array(await pngBlob.arrayBuffer());
    isPng = true;
  }

  const image = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);

  const page = pdf.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });
}

async function getOrLoadPdf(
  cache: Map<string, PDFDocument>,
  file: File,
): Promise<PDFDocument> {
  const key = getFileKey(file);
  const cached = cache.get(key);
  if (cached) return cached;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const source = await PDFDocument.load(bytes);
  cache.set(key, source);
  return source;
}

export async function mergePages(
  pages: PdfPageItem[],
  onProgress?: (progress: PdfProgress) => void,
): Promise<MergeResult> {
  if (pages.length === 0) {
    throw new Error("Добавьте хотя бы одну страницу.");
  }

  const merged = await PDFDocument.create();
  const pdfCache = new Map<string, PDFDocument>();

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    onProgress?.({
      current: index + 1,
      total: pages.length,
      message: `Добавление ${page.sourceLabel} · стр. ${page.pageNumber}`,
    });

    try {
      if (page.kind === "image") {
        await embedImagePage(merged, page.file);
      } else {
        const source = await getOrLoadPdf(pdfCache, page.file);
        const [copied] = await merged.copyPages(source, [page.pageIndex]);
        merged.addPage(copied);
      }
    } catch (error) {
      throw new Error(getPdfErrorMessage(error));
    }
  }

  const bytes = await merged.save();
  const blob = new Blob([bytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });

  return {
    name: "merged.pdf",
    blob,
  };
}

export { downloadBlob } from "@/lib/media/download";
