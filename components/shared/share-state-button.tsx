"use client";

import { Share2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface ShareStateButtonProps {
  getShareUrl: () => string;
  label?: string;
  className?: string;
}

export function ShareStateButton({
  getShareUrl,
  label = "Поделиться",
  className,
}: ShareStateButtonProps) {
  const { copy } = useCopyToClipboard();

  const handleShare = async () => {
    const url = getShareUrl();
    const success = await copy(url);

    if (success) {
      toast.success("Ссылка скопирована!");
      return;
    }

    toast.error("Не удалось скопировать ссылку");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("gap-1.5", className)}
      onClick={handleShare}
    >
      <Share2Icon className="size-4" />
      {label}
    </Button>
  );
}
