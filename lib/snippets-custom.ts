import type { SnippetItem } from "@/lib/snippets/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

export const CUSTOM_SNIPPETS_KEY = "snippets:custom";

export interface CustomSnippet extends SnippetItem {
  isCustom: true;
}

export type SnippetWithMeta = SnippetItem & { isCustom?: boolean };

function isCustomSnippet(value: unknown): value is CustomSnippet {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CustomSnippet>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.language === "string" &&
    typeof candidate.code === "string"
  );
}

export function getCustomSnippets(): CustomSnippet[] {
  const stored = getStorageItem<unknown>(CUSTOM_SNIPPETS_KEY);

  if (!Array.isArray(stored)) return [];

  return stored
    .filter(isCustomSnippet)
    .map((snippet) => ({ ...snippet, isCustom: true as const }));
}

export function saveCustomSnippets(snippets: CustomSnippet[]): void {
  setStorageItem(CUSTOM_SNIPPETS_KEY, snippets);
}

export function createCustomSnippet(
  input: Omit<SnippetItem, "id">,
): CustomSnippet {
  const snippets = getCustomSnippets();
  const snippet: CustomSnippet = {
    ...input,
    id: `custom-${crypto.randomUUID()}`,
    isCustom: true,
  };

  saveCustomSnippets([snippet, ...snippets]);
  return snippet;
}

export function updateCustomSnippet(
  id: string,
  input: Omit<SnippetItem, "id">,
): CustomSnippet | null {
  const snippets = getCustomSnippets();
  const index = snippets.findIndex((snippet) => snippet.id === id);

  if (index === -1) return null;

  const updated: CustomSnippet = {
    ...input,
    id,
    isCustom: true,
  };

  snippets[index] = updated;
  saveCustomSnippets(snippets);
  return updated;
}

export function deleteCustomSnippet(id: string): boolean {
  const snippets = getCustomSnippets();
  const next = snippets.filter((snippet) => snippet.id !== id);

  if (next.length === snippets.length) return false;

  saveCustomSnippets(next);
  return true;
}

export function mergeSnippets(builtin: SnippetItem[]): SnippetWithMeta[] {
  const custom = getCustomSnippets();
  return [...custom, ...builtin];
}
