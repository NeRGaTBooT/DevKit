"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { addRecentTool } from "@/lib/favorites";
import { saveLastTool } from "@/lib/storage";
import { getToolPath } from "@/lib/tools/paths";
import type { ToolDefinition } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

interface ToolNavLinkProps {
  tool: ToolDefinition;
  onNavigate?: () => void;
}

export function ToolNavLink({ tool, onNavigate }: ToolNavLinkProps) {
  const pathname = usePathname();
  const href = getToolPath(tool.slug);
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={() => {
        saveLastTool(tool.slug);
        addRecentTool(tool.slug);
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
      {tool.status === "coming-soon" && (
        <Badge
          variant="outline"
          className="h-5 border-sidebar-border px-1.5 text-[10px] text-sidebar-foreground/70"
        >
          Скоро
        </Badge>
      )}
    </Link>
  );
}
