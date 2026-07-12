"use client";

import { DownloadIcon } from "lucide-react";

import { downloadBlob } from "@/components/tools/image-compressor/image-compressor-logic";
import type { CompressionResult } from "@/components/tools/image-compressor/types";
import { Button } from "@/components/ui/button";
import {
  formatFileSize,
  formatSizeReduction,
} from "@/lib/media/format";

export interface CompressionResultPanelProps {
  result: CompressionResult;
}

export function CompressionResultPanel({ result }: CompressionResultPanelProps) {
  const primaryDownload = result.zipBlob
    ? { blob: result.zipBlob, name: result.zipName ?? "compressed-images.zip" }
    : result.files.length === 1
      ? { blob: result.files[0].blob, name: result.files[0].name }
      : null;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-1">
        <h2 className="text-sm font-medium">Результат</h2>
        <p className="text-xs text-muted-foreground">
          {result.files.length} файл(ов)
          {result.zipBlob ? " · скачивание как ZIP" : ""}
        </p>
      </div>

      {primaryDownload && (
        <Button
          type="button"
          onClick={() => downloadBlob(primaryDownload.blob, primaryDownload.name)}
          className="w-fit"
        >
          <DownloadIcon />
          Скачать {primaryDownload.name}
        </Button>
      )}

      <ul className="flex flex-col gap-4">
        {result.files.map((file) => (
          <li
            key={file.name}
            className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3"
          >
            <div className="space-y-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.originalSize)} → {formatFileSize(file.blob.size)}{" "}
                ({formatSizeReduction(file.originalSize, file.blob.size)})
              </p>
              <p className="text-xs text-muted-foreground">
                {file.originalWidth}×{file.originalHeight} → {file.compressedWidth}×
                {file.compressedHeight} px
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">До</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.originalPreviewUrl}
                  alt={`${file.name} до`}
                  className="aspect-video w-full rounded border border-border object-contain bg-background"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">После</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.previewUrl}
                  alt={`${file.name} после`}
                  className="aspect-video w-full rounded border border-border object-contain bg-background"
                />
              </div>
            </div>

            {!result.zipBlob && result.files.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => downloadBlob(file.blob, file.name)}
              >
                <DownloadIcon />
                Скачать
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
