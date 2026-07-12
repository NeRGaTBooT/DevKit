"use client";

import { useState } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommandMenu } from "@/components/layout/command-menu";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="min-h-svh bg-background">
      <AppSidebar className="hidden lg:flex" />
      <div className="flex min-h-svh flex-col lg:pl-64">
        <AppHeader onSearchOpen={() => setCommandOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
