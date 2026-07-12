"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderPlusIcon, PlusIcon, SearchIcon, StickyNoteIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { CategoryFormDialog } from "@/components/tools/snippets/category-form-dialog";
import {
  formToSnippetInput,
  SnippetFormDialog,
  type SnippetFormValues,
} from "@/components/tools/snippets/snippet-form-dialog";
import { SnippetCard } from "@/components/tools/snippets/snippet-card";
import { SnippetCategoryTabs } from "@/components/tools/snippets/snippet-category-tabs";
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
import { Tabs } from "@/components/ui/tabs";
import { useSnippetSearch } from "@/hooks/use-snippet-search";
import { snippets as builtinSnippets } from "@/lib/snippets/builtin-snippets";
import {
  createCustomCategory,
  deleteCustomCategory,
  getAllSnippetCategories,
  type SnippetCategoryWithMeta,
} from "@/lib/snippets-categories";
import {
  createCustomSnippet,
  deleteCustomSnippet,
  getCustomSnippets,
  updateCustomSnippet,
  type SnippetWithMeta,
} from "@/lib/snippets-custom";

export function SnippetsTool() {
  const [customSnippets, setCustomSnippets] = useState<SnippetWithMeta[]>([]);
  const [categories, setCategories] = useState<SnippetCategoryWithMeta[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<SnippetWithMeta | null>(
    null,
  );

  const refreshCategories = () => {
    setCategories(getAllSnippetCategories());
  };

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate custom data on mount */
  useEffect(() => {
    setCustomSnippets(getCustomSnippets());
    refreshCategories();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const allSnippets = useMemo(
    () => [...customSnippets, ...builtinSnippets],
    [customSnippets],
  );

  const {
    query,
    setQuery,
    category,
    setCategory,
    filteredItems,
    resetFilters,
    hasActiveFilters,
  } = useSnippetSearch(allSnippets);

  const refreshCustomSnippets = () => {
    setCustomSnippets(getCustomSnippets());
  };

  const handleOpenCreate = () => {
    setEditingSnippet(null);
    setDialogOpen(true);
  };

  const handleEdit = (snippet: SnippetWithMeta) => {
    setEditingSnippet(snippet);
    setDialogOpen(true);
  };

  const handleDelete = (snippet: SnippetWithMeta) => {
    if (!snippet.isCustom) return;

    const deleted = deleteCustomSnippet(snippet.id);

    if (deleted) {
      refreshCustomSnippets();
      toast.success("Сниппет удалён");
      return;
    }

    toast.error("Не удалось удалить сниппет");
  };

  const handleSubmit = (values: SnippetFormValues) => {
    const input = formToSnippetInput(values);

    if (editingSnippet?.isCustom) {
      updateCustomSnippet(editingSnippet.id, input);
      toast.success("Сниппет обновлён");
    } else {
      createCustomSnippet(input);
      toast.success("Сниппет создан");
    }

    refreshCustomSnippets();
  };

  const handleCreateCategory = (label: string) => {
    const result = createCustomCategory(label);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    refreshCategories();
    setCategoryDialogOpen(false);
    toast.success("Категория создана");
  };

  const handleRequestDeleteCategory = (categoryId: string) => {
    const snippetCount = allSnippets.filter(
      (snippet) => snippet.category === categoryId,
    ).length;

    if (snippetCount > 0) {
      toast.error(
        `Нельзя удалить категорию: в ней ${snippetCount} сниппет(ов)`,
      );
      return;
    }

    setDeleteCategoryId(categoryId);
  };

  const handleConfirmDeleteCategory = () => {
    if (!deleteCategoryId) return;

    const snippetCount = allSnippets.filter(
      (snippet) => snippet.category === deleteCategoryId,
    ).length;

    const result = deleteCustomCategory(deleteCategoryId, snippetCount);

    if ("error" in result) {
      toast.error(result.error);
      setDeleteCategoryId(null);
      return;
    }

    if (category === deleteCategoryId) {
      setCategory("all");
    }

    refreshCategories();
    setDeleteCategoryId(null);
    toast.success("Категория удалена");
  };

  const deleteCategoryLabel =
    categories.find((item) => item.id === deleteCategoryId)?.label ?? "";

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <header className="space-y-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <StickyNoteIcon className="size-4" />
              <span className="text-sm">Инструменты</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Snippets</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Библиотека готовых сниппетов с поиском, подсветкой синтаксиса,
              preview для CSS/HTML и копированием в один клик. Создавайте свои
              сниппеты и категории — они сохраняются локально.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryDialogOpen(true)}
            >
              <FolderPlusIcon />
              Новая категория
            </Button>
            <Button type="button" onClick={handleOpenCreate}>
              <PlusIcon />
              Новый сниппет
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию, описанию или тегам..."
            className="pl-8"
            aria-label="Поиск по сниппетам"
          />
        </div>

        <Tabs value={category} onValueChange={setCategory}>
          <SnippetCategoryTabs
            categories={categories}
            onDeleteCategory={handleRequestDeleteCategory}
          />
        </Tabs>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Ничего не найдено. Попробуйте изменить запрос или сбросить фильтры."
                : "Сниппеты не найдены."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <XIcon />
                Сбросить фильтры
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredItems.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet as SnippetWithMeta}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <SnippetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editingSnippet}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <CategoryFormDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSubmit={handleCreateCategory}
      />

      <Dialog
        open={deleteCategoryId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCategoryId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить категорию?</DialogTitle>
            <DialogDescription>
              Категория «{deleteCategoryLabel}» будет удалена без возможности
              восстановления.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteCategoryId(null)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDeleteCategory}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
