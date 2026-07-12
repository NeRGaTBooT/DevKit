import {
  snippetCategories as builtinSnippetCategories,
} from "@/lib/snippets/builtin-snippets";
import type { SnippetCategory } from "@/lib/snippets/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export const CUSTOM_CATEGORIES_KEY = "snippets:categories";

export interface CustomCategory extends SnippetCategory {
  isCustom: true;
}

export type SnippetCategoryWithMeta = SnippetCategory & { isCustom?: boolean };

function slugifyCategoryId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function isCustomCategory(value: unknown): value is CustomCategory {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CustomCategory>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.label === "string" &&
    candidate.id !== "all"
  );
}

function getBuiltinCategoryIds(): Set<string> {
  return new Set(
    builtinSnippetCategories
      .filter((category) => category.id !== "all")
      .map((category) => category.id),
  );
}

export function getCustomCategories(): CustomCategory[] {
  const stored = getStorageItem<unknown>(CUSTOM_CATEGORIES_KEY);

  if (!Array.isArray(stored)) return [];

  const builtinIds = getBuiltinCategoryIds();

  return stored
    .filter(isCustomCategory)
    .filter((category) => !builtinIds.has(category.id))
    .map((category) => ({ ...category, isCustom: true as const }));
}

function saveCustomCategories(categories: CustomCategory[]): void {
  setStorageItem(CUSTOM_CATEGORIES_KEY, categories);
}

function createUniqueCategoryId(label: string, existingIds: Set<string>): string {
  const base = slugifyCategoryId(label) || "category";
  let candidate = base;
  let index = 2;

  while (existingIds.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  return candidate;
}

export function getBuiltinSnippetCategories(): SnippetCategoryWithMeta[] {
  return builtinSnippetCategories.filter((category) => category.id !== "all");
}

export function getAllSnippetCategories(): SnippetCategoryWithMeta[] {
  return [
    { id: "all", label: "Все" },
    ...getBuiltinSnippetCategories(),
    ...getCustomCategories(),
  ];
}

export function getSelectableSnippetCategories(): SnippetCategoryWithMeta[] {
  return getAllSnippetCategories().filter((category) => category.id !== "all");
}

export function createCustomCategory(
  label: string,
): { category: CustomCategory } | { error: string } {
  const trimmed = label.trim();

  if (!trimmed) {
    return { error: "Введите название категории" };
  }

  const custom = getCustomCategories();
  const builtinIds = getBuiltinCategoryIds();
  const existingIds = new Set([
    ...builtinIds,
    ...custom.map((category) => category.id),
  ]);

  const duplicateLabel = [...getBuiltinSnippetCategories(), ...custom].some(
    (category) => category.label.toLowerCase() === trimmed.toLowerCase(),
  );

  if (duplicateLabel) {
    return { error: "Категория с таким названием уже существует" };
  }

  const category: CustomCategory = {
    id: createUniqueCategoryId(trimmed, existingIds),
    label: trimmed,
    isCustom: true,
  };

  saveCustomCategories([...custom, category]);
  return { category };
}

export function deleteCustomCategory(
  id: string,
  snippetCountInCategory: number,
): { success: true } | { error: string } {
  const custom = getCustomCategories();
  const target = custom.find((category) => category.id === id);

  if (!target) {
    return { error: "Категория не найдена" };
  }

  if (snippetCountInCategory > 0) {
    return {
      error: `Нельзя удалить категорию: в ней ${snippetCountInCategory} сниппет(ов)`,
    };
  }

  saveCustomCategories(custom.filter((category) => category.id !== id));
  return { success: true };
}

export function isCustomCategoryId(id: string): boolean {
  return getCustomCategories().some((category) => category.id === id);
}
