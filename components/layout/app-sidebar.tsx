"use client";

import Link from "next/link";
import { KeyboardIcon, WrenchIcon } from "lucide-react";

import { ToolNav } from "@/components/layout/tool-nav";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-sidebar-foreground transition-colors hover:text-sidebar-primary-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <WrenchIcon className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">DevKit</span>
        </Link>
      </div>
      <ToolNav className="min-h-0 flex-1" />
      <footer className="border-t border-sidebar-border p-3">
        <Link
          href="/shortcuts"
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <KeyboardIcon className="size-4 shrink-0" />
          Горячие клавиши
        </Link>
      </footer>
    </aside>
  );
}
