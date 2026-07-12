"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, WrenchIcon } from "lucide-react";

import { ToolNav } from "@/components/layout/tool-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Меню">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 bg-sidebar p-0 text-sidebar-foreground">
        <SheetHeader className="border-b border-sidebar-border">
          <SheetTitle className="sr-only">Навигация DevKit</SheetTitle>
          <Link
            href="/"
            className="flex items-center gap-2 px-1 py-0.5 font-medium text-sidebar-foreground"
            onClick={() => setOpen(false)}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <WrenchIcon className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">DevKit</span>
          </Link>
        </SheetHeader>
        <ToolNav className="min-h-0 flex-1" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
