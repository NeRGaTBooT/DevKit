"use client";

import { SearchIcon } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ToolPinButton } from "@/components/layout/tool-pin-button";
import { Button } from "@/components/ui/button";
import { useModKeyLabel } from "@/hooks/use-mod-key";

interface AppHeaderProps {
  onSearchOpen: () => void;
}

export function AppHeader({ onSearchOpen }: AppHeaderProps) {
  const modKey = useModKeyLabel();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-sm">
      <MobileNav />
      <Button
        variant="outline"
        className="h-9 flex-1 justify-start gap-2 px-3 text-muted-foreground lg:max-w-md"
        onClick={onSearchOpen}
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="truncate text-sm">Поиск инструментов...</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          {modKey}K
        </kbd>
      </Button>
      <ToolPinButton />
      <ThemeToggle />
    </header>
  );
}
