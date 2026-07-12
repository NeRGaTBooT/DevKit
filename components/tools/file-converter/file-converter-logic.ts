import type {
  ConversionOptions,
  ConversionProgress,
  ConversionResult,
  ConvertedFile,
  ImageFormat,
  InputKind,
  OutputFormat,
} from "@/components/tools/file-converter/types";
import { MAX_FILE_SIZE_BYTES, MAX_PDF_PAGES } from "@/lib/media/constants";
import { downloadBlob, revokeObjectUrls } from "@/lib/media/download";
import {
  blobToDataUrl,
  dataUrlToBlob,
  getImageMimeType,
  replaceExtension,
} from "@/lib/media/format";
import { convertImageFormat } from "@/lib/media/image-canvas";
import { getPdfPageCount } from "@/lib/media/pdf-utils";
import { packZip } from "@/lib/media/zip";

export { downloadBlob };

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function detectInputKind(file: File): InputKind | null {
  if (file.type === "application/pdf") return "pdf";
  if (IMAGE_MIME_TYPES.has(file.type)) return "image";
  return null;
}

export function detectFilesKind(files: File[]): InputKind | null {
  if (files.length === 0) return null;

  const kinds = new Set<InputKind>();
  for (const file of files) {
    const kind = detectInputKind(file);
    if (!kind) return null;
    kinds.add(kind);
  }

  if (kinds.size > 1) return null;
  return kinds.values().next().value ?? null;
}

export function getAvailableOutputs(
  inputKind: InputKind | null,
  fileCount: number,
): OutputFormat[] {
  if (!inputKind) return [];

  if (inputKind === "pdf") {
    return ["jpg", "png", "webp"];
  }

  if (fileCount > 1) {
    return ["jpg", "png", "webp", "pdf"];
  }

  return ["jpg", "png", "webp", "pdf"];
}

export function validateFiles(files: File[]): string | null {
  if (files.length === 0) {
    return "Выберите хотя бы один файл.";
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Файл «${file.name}» превышает лимит 25 MB.`;
    }

    if (!detectInputKind(file)) {
      return `Файл «${file.name}» имеет неподдерживаемый формат.`;
    }
  }

  const inputKind = detectFilesKind(files);
  if (!inputKind) {
    return "Нельзя смешивать PDF и изображения в одной конвертации.";
  }

  if (inputKind === "pdf" && files.length > 1) {
    return "За один раз можно конвертировать только один PDF.";
  }

  return null;
}

async function convertImageFile(
  file: File,
  format: ImageFormat,
  quality: number,
): Promise<ConvertedFile> {
  const blob = await convertImageFormat(file, format, quality);
  return {
    name: replaceExtension(file.name, format === "jpg" ? "jpg" : format),
    blob,
    previewUrl: URL.createObjectURL(blob),
  };
}

async function pdfToImages(
  file: File,
  format: ImageFormat,
  options: Pick<ConversionOptions, "quality" | "scale">,
  onProgress?: (progress: ConversionProgress) => void,
): Promise<ConvertedFile[]> {
  const pageCount = await getPdfPageCount(file);
  if (pageCount > MAX_PDF_PAGES) {
    throw new Error(
      `PDF содержит ${pageCount} страниц. Максимум — ${MAX_PDF_PAGES}.`,
    );
  }

  onProgress?.({
    current: 0,
    total: pageCount,
    message: "Рендер PDF…",
  });

  const { pdfToImg } = await import("pdftoimg-js/browser");
  const pdfImgType = format === "jpg" ? "jpg" : "png";
  const objectUrl = URL.createObjectURL(file);
  const dataUrls = await pdfToImg(objectUrl, {
    pages: "all",
    imgType: pdfImgType,
    scale: options.scale,
    scaleForBrowserSupport: true,
  });
  URL.revokeObjectURL(objectUrl);

  const urls = Array.isArray(dataUrls) ? dataUrls : [dataUrls];
  const baseName = replaceExtension(file.name, "");

  const converted: ConvertedFile[] = [];
  for (let index = 0; index < urls.length; index += 1) {
    onProgress?.({
      current: index + 1,
      total: urls.length,
      message: `Страница ${index + 1} из ${urls.length}`,
    });

    let blob = dataUrlToBlob(urls[index]);
    if (format === "webp" || (format === "jpg" && pdfImgType === "png")) {
      blob = await convertImageFormat(blob, format, options.quality);
    }

    converted.push({
      name: `${baseName}-page-${index + 1}.${format === "jpg" ? "jpg" : format}`,
      blob,
      previewUrl: URL.createObjectURL(blob),
    });
  }

  return converted;
}

async function imagesToPdf(
  files: File[],
  onProgress?: (progress: ConversionProgress) => void,
): Promise<ConvertedFile> {
  const { jsPDF } = await import("jspdf");
  let pdf: InstanceType<typeof jsPDF> | null = null;

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    onProgress?.({
      current: index + 1,
      total: files.length,
      message: `Добавление ${file.name}`,
    });

    const dataUrl = await blobToDataUrl(file);
    const bitmap = await createImageBitmap(file);
    const width = bitmap.width;
    const height = bitmap.height;
    bitmap.close();

    const orientation = width >= height ? "landscape" : "portrait";

    if (!pdf) {
      pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [width, height],
      });
    } else {
      pdf.addPage([width, height], orientation);
    }

    const format = file.type === "image/png" ? "PNG" : "JPEG";
    pdf.addImage(dataUrl, format, 0, 0, width, height);
  }

  if (!pdf) {
    throw new Error("Не удалось создать PDF.");
  }

  const blob = pdf.output("blob");
  const name =
    files.length === 1
      ? replaceExtension(files[0].name, "pdf")
      : "converted-images.pdf";

  return {
    name,
    blob,
    previewUrl: URL.createObjectURL(blob),
  };
}

export async function convertFiles(
  files: File[],
  options: ConversionOptions,
  onProgress?: (progress: ConversionProgress) => void,
): Promise<ConversionResult> {
  const validationError = validateFiles(files);
  if (validationError) {
    throw new Error(validationError);
  }

  const inputKind = detectFilesKind(files);
  if (!inputKind) {
    throw new Error("Не удалось определить тип файлов.");
  }

  if (inputKind === "pdf") {
    const converted = await pdfToImages(
      files[0],
      options.outputFormat as ImageFormat,
      options,
      onProgress,
    );

    if (converted.length === 1) {
      return { files: converted };
    }

    const zipBlob = await packZip(converted);

    return {
      files: converted,
      zipBlob,
      zipName: replaceExtension(files[0].name, "zip"),
    };
  }

  if (options.outputFormat === "pdf") {
    if (options.mergeToPdf || files.length === 1) {
      const pdfFile = await imagesToPdf(files, onProgress);
      return { files: [pdfFile] };
    }

    const pdfFiles: ConvertedFile[] = [];
    for (let index = 0; index < files.length; index += 1) {
      onProgress?.({
        current: index + 1,
        total: files.length,
        message: `PDF из ${files[index].name}`,
      });
      pdfFiles.push(await imagesToPdf([files[index]], onProgress));
    }

    if (pdfFiles.length === 1) {
      return { files: pdfFiles };
    }

    const zipBlob = await packZip(pdfFiles);
    return {
      files: pdfFiles,
      zipBlob,
      zipName: "converted-pdfs.zip",
    };
  }

  const imageFormat = options.outputFormat as ImageFormat;
  const converted: ConvertedFile[] = [];

  for (let index = 0; index < files.length; index += 1) {
    onProgress?.({
      current: index + 1,
      total: files.length,
      message: `Конвертация ${files[index].name}`,
    });
    converted.push(
      await convertImageFile(files[index], imageFormat, options.quality),
    );
  }

  if (converted.length === 1) {
    return { files: converted };
  }

  const zipBlob = await packZip(converted);
  return {
    files: converted,
    zipBlob,
    zipName: "converted-images.zip",
  };
}

export function revokeConversionResult(result: ConversionResult | null): void {
  if (!result) return;
  revokeObjectUrls(result.files.map((file) => file.previewUrl));
}

// Re-export for backward compatibility in types
export { getImageMimeType };
