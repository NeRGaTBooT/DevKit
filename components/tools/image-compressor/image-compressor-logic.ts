import { MAX_FILE_SIZE_BYTES } from "@/lib/media/constants";
import { isImageFile } from "@/lib/media/format";
import { compressImage } from "@/lib/media/image-canvas";
import { packZip } from "@/lib/media/zip";

import type {
  CompressOptions,
  CompressedFile,
  CompressionProgress,
  CompressionResult,
} from "@/components/tools/image-compressor/types";

export function validateImageFiles(files: File[]): string | null {
  if (files.length === 0) {
    return "Выберите хотя бы одно изображение.";
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Файл «${file.name}» превышает лимит 25 MB.`;
    }

    if (!isImageFile(file)) {
      return `Файл «${file.name}» имеет неподдерживаемый формат. Поддерживаются JPG, PNG, WEBP.`;
    }
  }

  return null;
}

async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

async function compressImageFile(
  file: File,
  options: CompressOptions,
): Promise<CompressedFile> {
  const { width: originalWidth, height: originalHeight } =
    await getImageDimensions(file);

  const { blob, width, height } = await compressImage(file, options);

  return {
    name: file.name,
    blob,
    previewUrl: URL.createObjectURL(blob),
    originalPreviewUrl: URL.createObjectURL(file),
    originalSize: file.size,
    originalWidth,
    originalHeight,
    compressedWidth: width,
    compressedHeight: height,
  };
}

export async function compressImages(
  files: File[],
  options: CompressOptions,
  onProgress?: (progress: CompressionProgress) => void,
): Promise<CompressionResult> {
  const validationError = validateImageFiles(files);
  if (validationError) {
    throw new Error(validationError);
  }

  const compressed: CompressedFile[] = [];

  for (let index = 0; index < files.length; index += 1) {
    onProgress?.({
      current: index + 1,
      total: files.length,
      message: `Сжатие ${files[index].name}`,
    });
    compressed.push(await compressImageFile(files[index], options));
  }

  if (compressed.length === 1) {
    return { files: compressed };
  }

  const zipBlob = await packZip(
    compressed.map((file) => ({ name: file.name, blob: file.blob })),
  );

  return {
    files: compressed,
    zipBlob,
    zipName: "compressed-images.zip",
  };
}

export function revokeCompressionResult(result: CompressionResult | null): void {
  if (!result) return;

  for (const file of result.files) {
    URL.revokeObjectURL(file.previewUrl);
    URL.revokeObjectURL(file.originalPreviewUrl);
  }
}

export { downloadBlob } from "@/lib/media/download";
