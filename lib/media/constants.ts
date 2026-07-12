export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const MAX_PDF_PAGES = 100;

export const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const ACCEPTED_IMAGE_EXTENSIONS =
  ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export const ACCEPTED_PDF_EXTENSIONS = ".pdf,application/pdf";

export const ACCEPTED_PDF_AND_IMAGE_EXTENSIONS = `${ACCEPTED_PDF_EXTENSIONS},${ACCEPTED_IMAGE_EXTENSIONS}`;
