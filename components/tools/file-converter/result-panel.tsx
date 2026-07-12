"use client";

import { DownloadIcon, FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/components/tools/file-converter/file-converter-logic";
import type { ConversionResult } from "@/components/tools/file-converter/types";

export interface ResultPanelProps {
  result: ConversionResult;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const primaryDownload = result.zipBlob
    ? { blob: result.zipBlob, name: result.zipName ?? "converted.zip" }
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

      <ul className="flex flex-col gap-2">
        {result.files.map((file) => (
          <li
            key={file.name}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2"
          >
            {file.blob.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={file.previewUrl}
                alt={file.name}
                className="size-10 rounded object-cover"
              />
            ) : (
              <FileIcon className="size-10 shrink-0 p-2 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.blob.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {!result.zipBlob && result.files.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
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
