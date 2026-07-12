import type { ResizeMode } from "@/lib/media/image-canvas";
import { ACCEPTED_IMAGE_EXTENSIONS } from "@/lib/media/constants";

export type { ResizeMode };

export interface CompressOptions {
  quality: number;
  resizeMode: ResizeMode;
  resizeValue: number;
}

export interface CompressedFile {
  name: string;
  blob: Blob;
  previewUrl: string;
  originalPreviewUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
}

export interface CompressionResult {
  files: CompressedFile[];
  zipBlob?: Blob;
  zipName?: string;
}

export interface CompressionProgress {
  current: number;
  total: number;
  message: string;
}

export { ACCEPTED_IMAGE_EXTENSIONS as ACCEPTED_EXTENSIONS };

export const RESIZE_MODE_LABELS: Record<ResizeMode, string> = {
  none: "Без изменения",
  percent: "Процент от оригинала",
  maxLongSide: "Макс. длинная сторона (px)",
};

export const DEFAULT_COMPRESS_OPTIONS: CompressOptions = {
  quality: 0.85,
  resizeMode: "maxLongSide",
  resizeValue: 1920,
};
