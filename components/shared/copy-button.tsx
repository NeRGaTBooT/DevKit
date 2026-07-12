"use client";

import type { ComponentProps } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  successMessage?: string;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
}

export function CopyButton({
  value,
  label = "Копировать",
  successMessage = "Скопировано!",
  className,
  size = "sm",
  variant = "outline",
}: CopyButtonProps) {
  const { copy, copied } = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copy(value);

    if (success) {
      toast.success(successMessage);
      return;
    }

    toast.error("Не удалось скопировать");
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("gap-1.5", className)}
      onClick={handleCopy}
      aria-label={label}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {label}
    </Button>
  );
}
