"use client";

import { Trash2Icon } from "lucide-react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SnippetCategoryWithMeta } from "@/lib/snippets-categories";

interface SnippetCategoryTabsProps {
  categories: SnippetCategoryWithMeta[];
  onDeleteCategory?: (categoryId: string) => void;
}

export function SnippetCategoryTabs({
  categories,
  onDeleteCategory,
}: SnippetCategoryTabsProps) {
  return (
    <TabsList className="h-auto w-full flex-wrap justify-start">
      {categories.map((item) => (
        <TabsTrigger key={item.id} value={item.id} className="gap-1.5">
          <span>{item.label}</span>
          {item.isCustom && onDeleteCategory && (
            <span
              role="button"
              tabIndex={0}
              className="inline-flex rounded-sm p-0.5 text-muted-foreground hover:text-destructive"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDeleteCategory(item.id);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onDeleteCategory(item.id);
              }}
              aria-label={`Удалить категорию ${item.label}`}
            >
              <Trash2Icon className="size-3.5" />
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
