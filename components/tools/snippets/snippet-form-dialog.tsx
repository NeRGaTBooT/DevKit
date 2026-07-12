"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  isSnippetPreviewable,
  SnippetPreview,
} from "@/components/tools/snippets/snippet-preview";
import {
  getSelectableSnippetCategories,
  type SnippetCategoryWithMeta,
} from "@/lib/snippets-categories";
import type { SnippetItem } from "@/lib/snippets/types";

const languageOptions = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "css", label: "CSS" },
  { value: "markup", label: "HTML" },
  { value: "bash", label: "Bash" },
];

function resolveCategoryOptions(
  categories?: SnippetCategoryWithMeta[],
): SnippetCategoryWithMeta[] {
  if (categories && categories.length > 0) {
    return categories.filter((category) => category.id !== "all");
  }

  return getSelectableSnippetCategories();
}

export interface SnippetFormValues {
  title: string;
  description: string;
  language: string;
  code: string;
  category: string;
  tags: string;
}

const emptyForm: SnippetFormValues = {
  title: "",
  description: "",
  language: "typescript",
  code: "",
  category: "typescript",
  tags: "",
};

interface SnippetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: SnippetItem | null;
  categories?: SnippetCategoryWithMeta[];
  onSubmit: (values: SnippetFormValues) => void;
}

export function SnippetFormDialog({
  open,
  onOpenChange,
  initial,
  categories,
  onSubmit,
}: SnippetFormDialogProps) {
  const [form, setForm] = useState<SnippetFormValues>(emptyForm);
  const selectableCategories = resolveCategoryOptions(categories);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description,
        language: initial.language,
        code: initial.code,
        category: initial.category,
        tags: initial.tags?.join(", ") ?? "",
      });
      return;
    }

    setForm(emptyForm);
  }, [open, initial]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initial ? "Редактировать сниппет" : "Новый сниппет"}
            </DialogTitle>
            <DialogDescription>
              Сниппет сохраняется локально в браузере.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="snippet-title">Название</Label>
              <Input
                id="snippet-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="snippet-description">Описание</Label>
              <Input
                id="snippet-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Категория</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, category: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Язык</Label>
                <Select
                  value={form.language}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, language: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="snippet-tags">Теги</Label>
              <Input
                id="snippet-tags"
                value={form.tags}
                onChange={(event) =>
                  setForm((current) => ({ ...current, tags: event.target.value }))
                }
                placeholder="hooks, react, state"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="snippet-code">Код</Label>
              <Textarea
                id="snippet-code"
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({ ...current, code: event.target.value }))
                }
                className="min-h-40 font-mono text-xs"
                required
              />
            </div>

            {isSnippetPreviewable(form.language) && form.code.trim().length > 0 && (
              <div className="grid gap-2">
                <Label>Preview</Label>
                <SnippetPreview
                  code={form.code}
                  language={form.language}
                  className="h-48 w-full rounded-lg border border-border bg-background"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">
              {initial ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function formToSnippetInput(values: SnippetFormValues): Omit<SnippetItem, "id"> {
  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    language: values.language,
    code: values.code,
    category: values.category,
    tags: tags.length > 0 ? tags : undefined,
  };
}

export { formToSnippetInput };
