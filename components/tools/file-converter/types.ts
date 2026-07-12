export type ImageFormat = "jpg" | "png" | "webp";

export type OutputFormat = ImageFormat | "pdf";

export type InputKind = "pdf" | "image";

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;
  scale: number;
  mergeToPdf: boolean;
}

export interface ConvertedFile {
  name: string;
  blob: Blob;
  previewUrl: string;
}

export interface ConversionResult {
  files: ConvertedFile[];
  zipBlob?: Blob;
  zipName?: string;
}

export interface ConversionProgress {
  current: number;
  total: number;
  message: string;
}

export {
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_PAGES,
  ACCEPTED_PDF_AND_IMAGE_EXTENSIONS as ACCEPTED_EXTENSIONS,
} from "@/lib/media/constants";

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WEBP",
  pdf: "PDF",
};
