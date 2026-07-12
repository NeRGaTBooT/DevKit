import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ToolWorkspaceProps {
  toolbar?: ReactNode;
  preview: ReactNode;
  controls: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ToolWorkspace({
  toolbar,
  preview,
  controls,
  footer,
  className,
}: ToolWorkspaceProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {toolbar}

      <div
        className={cn(
          "grid gap-4 lg:grid-cols-2 lg:items-stretch",
          "lg:h-[min(32rem,calc(100dvh-7rem))]",
        )}
      >
        <div className="min-h-0 h-full">{preview}</div>
        <div className="min-h-0 h-full">{controls}</div>
      </div>

      {footer}
    </div>
  );
}
