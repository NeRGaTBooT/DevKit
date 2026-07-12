import { MAX_FILE_SIZE_BYTES } from "@/lib/media/constants";
import { isImageFile, replaceExtension } from "@/lib/media/format";
import {
  applyImageTransform,
  bitmapToBlob,
  cropImage,
  loadImageBitmap,
  type CropRect,
  type ImageTransform,
} from "@/lib/media/image-canvas";

import type { ExportOptions } from "@/components/tools/image-cropper/types";

export function validateCropFile(file: File | null): string | null {
  if (!file) {
    return "Выберите изображение.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Файл «${file.name}» превышает лимит 25 MB.`;
  }

  if (!isImageFile(file)) {
    return "Поддерживаются только JPG, PNG, WEBP.";
  }

  return null;
}

export async function getTransformedPreview(
  file: File,
  transform: ImageTransform,
): Promise<{ url: string; blob: Blob; width: number; height: number }> {
  const bitmap = await loadImageBitmap(file);
  const transformed = await applyImageTransform(bitmap, transform);
  bitmap.close();

  const blob = await bitmapToBlob(transformed, file.type);
  const width = transformed.width;
  const height = transformed.height;
  transformed.close();

  return {
    url: URL.createObjectURL(blob),
    blob,
    width,
    height,
  };
}

export async function getTransformedImageSize(
  file: File,
  transform: ImageTransform,
): Promise<{ width: number; height: number }> {
  const preview = await getTransformedPreview(file, transform);
  URL.revokeObjectURL(preview.url);
  return { width: preview.width, height: preview.height };
}

export async function exportCroppedImage(
  file: File,
  cropRect: CropRect,
  transform: ImageTransform,
  options: ExportOptions,
  exportSize?: { width: number; height: number },
): Promise<{ blob: Blob; previewUrl: string; name: string }> {
  const validationError = validateCropFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const preview = await getTransformedPreview(file, transform);
  const identityTransform: ImageTransform = {
    rotation: 0,
    flipH: false,
    flipV: false,
  };

  const blob = await cropImage(
    preview.blob,
    cropRect,
    options.format,
    options.quality,
    identityTransform,
    exportSize,
  );

  URL.revokeObjectURL(preview.url);

  return {
    blob,
    previewUrl: URL.createObjectURL(blob),
    name: replaceExtension(file.name, options.format === "jpg" ? "jpg" : options.format),
  };
}

export { downloadBlob } from "@/lib/media/download";
