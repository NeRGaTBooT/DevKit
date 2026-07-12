"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";

import { CodeOutput } from "@/components/shared/code-output";
import { CopyButton } from "@/components/shared/copy-button";
import {
  isSnippetPreviewable,
  SnippetPreview,
} from "@/components/tools/snippets/snippet-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SnippetWithMeta } from "@/lib/snippets-custom";

interface SnippetCardProps {
  snippet: SnippetWithMeta;
  onEdit?: (snippet: SnippetWithMeta) => void;
  onDelete?: (snippet: SnippetWithMeta) => void;
}

const languageLabels: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  css: "CSS",
  markup: "HTML",
  bash: "Bash",
};

export function SnippetCard({
  snippet,
  onEdit,
  onDelete,
}: SnippetCardProps) {
  const previewable = isSnippetPreviewable(snippet.language);

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{snippet.title}</h2>
            {snippet.isCustom && (
              <Badge variant="default" className="text-xs">
                Мои
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{snippet.description}</p>
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {snippet.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {languageLabels[snippet.language] ?? snippet.language}
          </Badge>
          {snippet.isCustom && onEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(snippet)}
              aria-label="Редактировать"
            >
              <PencilIcon />
            </Button>
          )}
          {snippet.isCustom && onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete(snippet)}
              aria-label="Удалить"
            >
              <Trash2Icon />
            </Button>
          )}
          <CopyButton value={snippet.code} label="Копировать" />
        </div>
      </div>

      {previewable ? (
        <Tabs defaultValue="code">
          <TabsList>
            <TabsTrigger value="code">Код</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-3">
            <CodeOutput code={snippet.code} language={snippet.language} />
          </TabsContent>
          <TabsContent value="preview" className="mt-3">
            <SnippetPreview code={snippet.code} language={snippet.language} />
          </TabsContent>
        </Tabs>
      ) : (
        <CodeOutput code={snippet.code} language={snippet.language} />
      )}
    </article>
  );
}
