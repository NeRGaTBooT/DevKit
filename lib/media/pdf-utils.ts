import { MAX_PDF_PAGES } from "@/lib/media/constants";

let workerInitialized = false;

export async function setupPdfJsWorker(): Promise<
  typeof import("pdfjs-dist")
> {
  const pdfjs = await import("pdfjs-dist");

  if (!workerInitialized) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url,
    ).toString();
    workerInitialized = true;
  }

  return pdfjs;
}

export async function getPdfPageCount(file: File | Blob): Promise<number> {
  const pdfjs = await setupPdfJsWorker();
  const data =
    file instanceof File
      ? new Uint8Array(await file.arrayBuffer())
      : new Uint8Array(await file.arrayBuffer());

  const document = await pdfjs.getDocument({ data }).promise;
  return document.numPages;
}

export async function loadPdfDocument(file: File | Blob) {
  const pdfjs = await setupPdfJsWorker();
  const data = new Uint8Array(await file.arrayBuffer());
  return pdfjs.getDocument({ data }).promise;
}

export async function renderPageThumbnail(
  file: File | Blob,
  pageNumber: number,
  scale = 0.2,
): Promise<string> {
  const pdf = await loadPdfDocument(file);
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas недоступен в этом браузере.");
  }

  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas.toDataURL("image/jpeg", 0.7);
}

export async function renderAllPageThumbnails(
  file: File | Blob,
  scale = 0.2,
  onProgress?: (current: number, total: number) => void,
): Promise<string[]> {
  const pageCount = await getPdfPageCount(file);
  if (pageCount > MAX_PDF_PAGES) {
    throw new Error(
      `PDF содержит ${pageCount} страниц. Максимум — ${MAX_PDF_PAGES}.`,
    );
  }

  return renderFilePageThumbnails(file, pageCount, scale, onProgress);
}

export async function renderFilePageThumbnails(
  file: File | Blob,
  pageCount: number,
  scale = 0.2,
  onProgress?: (current: number, total: number) => void,
): Promise<string[]> {
  const pdf = await loadPdfDocument(file);
  const thumbnails: string[] = [];

  for (let page = 1; page <= pageCount; page += 1) {
    onProgress?.(page, pageCount);
    const pdfPage = await pdf.getPage(page);
    const viewport = pdfPage.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas недоступен в этом браузере.");
    }

    await pdfPage.render({ canvasContext: context, viewport, canvas }).promise;
    thumbnails.push(canvas.toDataURL("image/jpeg", 0.7));
  }

  return thumbnails;
}

export function isEncryptedPdfError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("password") ||
    message.includes("encrypted") ||
    message.includes("decrypt")
  );
}

export function getPdfErrorMessage(error: unknown): string {
  if (isEncryptedPdfError(error)) {
    return "PDF защищён паролем. Разблокируйте файл перед загрузкой.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Не удалось обработать PDF.";
}
