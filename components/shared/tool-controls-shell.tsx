"use client";

import { RotateCcwIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolControlsShellProps {
  onReset: () => void;
  beforeScroll?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ToolControlsShell({
  onReset,
  beforeScroll,
  children,
  className,
}: ToolControlsShellProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3 lg:px-5">
        <p className="text-sm font-medium">Параметры</p>
        <Button type="button" variant="outline" size="sm" onClick={onReset}>
          <RotateCcwIcon />
          Сбросить
        </Button>
      </div>

      {beforeScroll ? (
        <div className="shrink-0 border-b border-border px-4 py-3 lg:px-5">
          {beforeScroll}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 lg:px-5 lg:py-5">
        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </div>
  );
}
