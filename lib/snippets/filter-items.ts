import type { SnippetItem } from "./types";

export function filterSnippetItems<T extends SnippetItem>(
  items: T[],
  query: string,
  category: string,
): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== "all" && item.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = Object.entries(item)
      .map(([, value]) => value)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
