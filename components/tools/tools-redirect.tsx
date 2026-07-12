"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ToolLoading } from "@/components/tools/tool-loading";
import { getToolBySlug } from "@/lib/tools/registry";
import { getToolPath } from "@/lib/tools/paths";
import { getLastTool } from "@/lib/storage";

export function ToolsRedirect() {
  const router = useRouter();

  useEffect(() => {
    const lastTool = getLastTool();
    const slug =
      lastTool && getToolBySlug(lastTool) ? lastTool : "box-shadow";

    router.replace(getToolPath(slug));
  }, [router]);

  return <ToolLoading />;
}
