"use client";

import { usePathname } from "next/navigation";
import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export function ToolPinButton() {
  const pathname = usePathname();
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();

  const match = pathname.match(/^\/tools\/([^/]+)$/);
  const slug = match?.[1];

  if (!hydrated || !slug) return null;

  const pinned = isFavorite(slug);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 shrink-0"
      onClick={() => toggleFavorite(slug)}
      aria-label={pinned ? "Убрать из избранного" : "Добавить в избранное"}
      title={pinned ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <StarIcon
        className={cn(
          "size-4",
          pinned ? "fill-primary text-primary" : "text-muted-foreground",
        )}
      />
    </Button>
  );
}
