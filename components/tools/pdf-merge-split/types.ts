import { ACCEPTED_PDF_AND_IMAGE_EXTENSIONS } from "@/lib/media/constants";

export type MergeItemKind = "pdf" | "image";

export interface MergeItem {
  id: string;
  file: File;
  kind: MergeItemKind;
}

export interface PdfPageItem {
  id: string;
  file: File;
  kind: MergeItemKind;
  pageIndex: number;
  pageNumber: number;
  thumbnail: string;
  sourceLabel: string;
}

export type PdfPageGridMode = "reorder" | "select" | "highlight" | "readonly";

export type SplitMode = "pages" | "ranges" | "extract";

export interface SplitResultFile {
  name: string;
  blob: Blob;
}

export interface SplitResult {
  files: SplitResultFile[];
  zipBlob?: Blob;
  zipName?: string;
}

export interface MergeResult {
  name: string;
  blob: Blob;
}

export interface PdfProgress {
  current: number;
  total: number;
  message: string;
}

export { ACCEPTED_PDF_AND_IMAGE_EXTENSIONS as ACCEPTED_EXTENSIONS };

export const SPLIT_MODE_LABELS: Record<SplitMode, string> = {
  pages: "По страницам",
  ranges: "По диапазону",
  extract: "Extract (выбранные страницы)",
};
