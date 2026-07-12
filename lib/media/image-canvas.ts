import {
  getImageMimeType,
  type ImageFormat,
  supportsQuality,
} from "@/lib/media/format";

export type ResizeMode = "none" | "percent" | "maxLongSide";

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CompressOptions {
  quality: number;
  resizeMode: ResizeMode;
  resizeValue: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageTransform {
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
}

export function computeResizeDimensions(
  width: number,
  height: number,
  mode: ResizeMode,
  value: number,
): ImageDimensions {
  if (mode === "none" || width === 0 || height === 0) {
    return { width, height };
  }

  if (mode === "percent") {
    const scale = value / 100;
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  }

  const longSide = Math.max(width, height);
  if (longSide <= value) {
    return { width, height };
  }

  const scale = value / longSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function loadImageBitmap(source: Blob | File): Promise<ImageBitmap> {
  return createImageBitmap(source);
}

export async function bitmapToBlob(
  bitmap: ImageBitmap,
  mimeType: string,
  quality?: number,
  dimensions?: ImageDimensions,
): Promise<Blob> {
  const width = dimensions?.width ?? bitmap.width;
  const height = dimensions?.height ?? bitmap.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas недоступен в этом браузере.");
  }

  context.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Не удалось обработать изображение."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      supportsQuality(mimeType) ? quality : undefined,
    );
  });
}

export async function compressImage(
  file: File,
  options: CompressOptions,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await loadImageBitmap(file);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;

  const { width, height } = computeResizeDimensions(
    originalWidth,
    originalHeight,
    options.resizeMode,
    options.resizeValue,
  );

  const blob = await bitmapToBlob(bitmap, file.type, options.quality, {
    width,
    height,
  });
  bitmap.close();

  return { blob, width, height };
}

export async function convertImageFormat(
  blob: Blob,
  format: ImageFormat,
  quality: number,
): Promise<Blob> {
  const targetMime = getImageMimeType(format);
  if (blob.type === targetMime) {
    return blob;
  }

  const bitmap = await loadImageBitmap(blob);
  const result = await bitmapToBlob(bitmap, targetMime, quality);
  bitmap.close();
  return result;
}

export function getTransformedDimensions(
  width: number,
  height: number,
  rotation: ImageTransform["rotation"],
): ImageDimensions {
  if (rotation === 90 || rotation === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

export async function applyImageTransform(
  bitmap: ImageBitmap,
  transform: ImageTransform,
): Promise<ImageBitmap> {
  const { width, height } = getTransformedDimensions(
    bitmap.width,
    bitmap.height,
    transform.rotation,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas недоступен в этом браузере.");
  }

  context.translate(width / 2, height / 2);
  context.rotate((transform.rotation * Math.PI) / 180);
  context.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
  context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

  const transformed = await createImageBitmap(canvas);
  return transformed;
}

export async function cropImage(
  source: Blob | File,
  cropRect: CropRect,
  exportFormat: ImageFormat,
  quality: number,
  transform: ImageTransform,
  exportSize?: ImageDimensions,
): Promise<Blob> {
  const originalBitmap = await loadImageBitmap(source);
  const transformedBitmap = await applyImageTransform(originalBitmap, transform);
  originalBitmap.close();

  const canvas = document.createElement("canvas");
  const outputWidth = exportSize?.width ?? Math.round(cropRect.width);
  const outputHeight = exportSize?.height ?? Math.round(cropRect.height);
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    transformedBitmap.close();
    throw new Error("Canvas недоступен в этом браузере.");
  }

  context.drawImage(
    transformedBitmap,
    Math.round(cropRect.x),
    Math.round(cropRect.y),
    Math.round(cropRect.width),
    Math.round(cropRect.height),
    0,
    0,
    outputWidth,
    outputHeight,
  );
  transformedBitmap.close();

  const mimeType = getImageMimeType(exportFormat);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Не удалось экспортировать изображение."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      supportsQuality(mimeType) ? quality : undefined,
    );
  });
}

export function clampCropRect(
  rect: CropRect,
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null,
): CropRect {
  let { x, y, width, height } = rect;

  width = Math.max(1, Math.min(width, imageWidth));
  height = Math.max(1, Math.min(height, imageHeight));

  if (aspectRatio !== null) {
    height = width / aspectRatio;
    if (height > imageHeight) {
      height = imageHeight;
      width = height * aspectRatio;
    }
  }

  x = Math.max(0, Math.min(x, imageWidth - width));
  y = Math.max(0, Math.min(y, imageHeight - height));

  return { x, y, width, height };
}

export function createDefaultCropRect(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null,
): CropRect {
  if (aspectRatio === null) {
    const margin = Math.min(imageWidth, imageHeight) * 0.1;
    return {
      x: margin,
      y: margin,
      width: imageWidth - margin * 2,
      height: imageHeight - margin * 2,
    };
  }

  let width = imageWidth * 0.8;
  let height = width / aspectRatio;

  if (height > imageHeight * 0.8) {
    height = imageHeight * 0.8;
    width = height * aspectRatio;
  }

  return {
    x: (imageWidth - width) / 2,
    y: (imageHeight - height) / 2,
    width,
    height,
  };
}
