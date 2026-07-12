"use client";

import { FavoritesSection } from "@/components/layout/favorites-section";
import { ToolNavLink } from "@/components/layout/tool-nav-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getNavigationToolGroups } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

interface ToolNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function ToolNav({ onNavigate, className }: ToolNavProps) {
  const groups = getNavigationToolGroups();

  return (
    <ScrollArea className={cn("flex-1", className)}>
      <nav className="flex flex-col gap-4 p-3">
        <FavoritesSection onNavigate={onNavigate} />
        {groups.map((group, index) => (
          <div key={group.category.id} className="flex flex-col gap-1">
            <p className="px-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
              {group.category.title}
            </p>

            <ul className="flex flex-col gap-0.5">
              {group.tools.map((tool) => (
                <li key={tool.slug}>
                  <ToolNavLink tool={tool} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>

            {index < groups.length - 1 && (
              <Separator className="mt-2 bg-sidebar-border" />
            )}
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}
