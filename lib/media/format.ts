export type ImageFormat = "jpg" | "png" | "webp";

export const FORMAT_LABELS: Record<ImageFormat, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WEBP",
};

export function replaceExtension(name: string, extension: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return extension ? `${base}.${extension}` : base;
}

export function getImageMimeType(format: ImageFormat): string {
  if (format === "jpg") return "image/jpeg";
  if (format === "png") return "image/png";
  return "image/webp";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatSizeReduction(
  originalBytes: number,
  compressedBytes: number,
): string {
  if (originalBytes === 0) return "0%";
  const reduction = ((originalBytes - compressedBytes) / originalBytes) * 100;
  if (reduction <= 0) return "0%";
  return `−${Math.round(reduction)}%`;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
    reader.readAsDataURL(blob);
  });
}

export function isImageFile(file: File): boolean {
  return (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp"
  );
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf";
}

export function supportsQuality(mimeType: string): boolean {
  return mimeType === "image/jpeg" || mimeType === "image/webp";
}
