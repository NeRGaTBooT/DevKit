"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { getNavigationToolGroups } from "@/lib/tools/registry";
import { getToolPath } from "@/lib/tools/paths";
import { saveLastTool } from "@/lib/storage";
import { useModKeyLabel } from "@/hooks/use-mod-key";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const modKey = useModKeyLabel();
  const groups = getNavigationToolGroups();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const navigateToTool = (slug: string) => {
    saveLastTool(slug);
    onOpenChange(false);
    router.push(getToolPath(slug));
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Поиск инструментов"
      description="Быстрый переход к инструментам DevKit"
    >
      <CommandInput placeholder="Поиск по названию или ключевым словам..." />
      <CommandList>
        <CommandEmpty>Ничего не найдено.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.category.id} heading={group.category.title}>
            {group.tools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={[tool.title, tool.description, tool.slug, ...tool.keywords].join(
                  " ",
                )}
                onSelect={() => navigateToTool(tool.slug)}
              >
                <tool.icon />
                <span className="flex-1">{tool.title}</span>
                {tool.status === "coming-soon" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Скоро
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      <div className="flex items-center justify-end border-t px-3 py-2 text-xs text-muted-foreground">
        <CommandShortcut>{modKey}K</CommandShortcut>
      </div>
    </CommandDialog>
  );
}
