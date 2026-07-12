import type { ImageFormat } from "@/lib/media/format";
import type { CropRect, ImageTransform } from "@/lib/media/image-canvas";
import { ACCEPTED_IMAGE_EXTENSIONS } from "@/lib/media/constants";

export type { CropRect, ImageTransform, ImageFormat };

export interface CropPreset {
  id: string;
  label: string;
  aspectRatio: number | null;
  exportSize?: { width: number; height: number };
}

export interface ExportOptions {
  format: ImageFormat;
  quality: number;
}

export { ACCEPTED_IMAGE_EXTENSIONS as ACCEPTED_EXTENSIONS };

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: "jpg",
  quality: 0.85,
};

export const DEFAULT_TRANSFORM: ImageTransform = {
  rotation: 0,
  flipH: false,
  flipV: false,
};
