"use client";

import { useMemo, useState } from "react";

import { filterSnippetItems } from "@/lib/snippets/filter-items";
import type { SnippetItem } from "@/lib/snippets/types";

export function useSnippetSearch<T extends SnippetItem>(items: T[]) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filteredItems = useMemo(
    () => filterSnippetItems(items, query, category),
    [items, query, category],
  );

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
  };

  const hasActiveFilters = query.trim().length > 0 || category !== "all";

  return {
    query,
    setQuery,
    category,
    setCategory,
    filteredItems,
    resetFilters,
    hasActiveFilters,
  };
}
