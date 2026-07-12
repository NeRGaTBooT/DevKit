"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockIcon, StarIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useFavorites } from "@/hooks/use-favorites";
import { getToolBySlug } from "@/lib/tools/registry";
import { saveLastTool } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import { cn } from "@/lib/utils";

interface FavoritesSectionProps {
  onNavigate?: () => void;
}

export function FavoritesSection({ onNavigate }: FavoritesSectionProps) {
  const pathname = usePathname();
  const { favorites, recent, hydrated } = useFavorites();

  if (!hydrated) return null;

  const favoriteTools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool !== undefined);

  const recentTools = recent
    .filter((slug) => !favorites.includes(slug))
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool !== undefined);

  if (favoriteTools.length === 0 && recentTools.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 px-3 pt-3">
      {favoriteTools.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
            <StarIcon className="size-3" />
            Избранное
          </p>
          <ul className="flex flex-col gap-0.5">
            {favoriteTools.map((tool) => {
              const href = getToolPath(tool.slug);
              const isActive = pathname === href;

              return (
                <li key={tool.slug}>
                  <Link
                    href={href}
                    onClick={() => {
                      saveLastTool(tool.slug);
                      onNavigate?.();
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <tool.icon className="size-4 shrink-0" />
                    <span className="flex-1 truncate">{tool.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {recentTools.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
            <ClockIcon className="size-3" />
            Недавние
          </p>
          <ul className="flex flex-col gap-0.5">
            {recentTools.map((tool) => {
              const href = getToolPath(tool.slug);
              const isActive = pathname === href;

              return (
                <li key={tool.slug}>
                  <Link
                    href={href}
                    onClick={() => {
                      saveLastTool(tool.slug);
                      onNavigate?.();
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <tool.icon className="size-4 shrink-0" />
                    <span className="flex-1 truncate">{tool.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Separator className="bg-sidebar-border" />
    </div>
  );
}
