"use client";

import {
  buildSnippetPreviewSrcDoc,
  isSnippetPreviewable,
} from "@/components/tools/snippets/snippet-preview-logic";

interface SnippetPreviewProps {
  code: string;
  language: string;
  className?: string;
}

export function SnippetPreview({ code, language, className }: SnippetPreviewProps) {
  if (!isSnippetPreviewable(language)) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Preview доступен только для CSS и HTML сниппетов.
      </div>
    );
  }

  const srcDoc = buildSnippetPreviewSrcDoc(code, language);

  return (
    <iframe
      title="Snippet preview"
      sandbox=""
      srcDoc={srcDoc}
      className={className ?? "h-64 w-full rounded-lg border border-border bg-background"}
    />
  );
}

export { isSnippetPreviewable };
