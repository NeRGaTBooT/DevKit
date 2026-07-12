"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { LastToolTracker } from "@/components/layout/last-tool-tracker";
import { ComingSoon } from "@/components/tools/coming-soon";
import { ToolLoading } from "@/components/tools/tool-loading";
import { getToolBySlug } from "@/lib/tools/registry";
import {
  isReadyToolSlug,
  readyToolComponents,
  type ReadyToolSlug,
} from "@/lib/tools/ready-components";

const readyToolComponentMap = Object.fromEntries(
  (Object.keys(readyToolComponents) as ReadyToolSlug[]).map((slug) => [
    slug,
    dynamic(readyToolComponents[slug], {
      loading: () => <ToolLoading />,
    }),
  ]),
) as Record<ReadyToolSlug, ComponentType>;

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  const tool = getToolBySlug(slug);

  if (!tool) {
    return null;
  }

  if (tool.status === "coming-soon") {
    return (
      <>
        <LastToolTracker slug={slug} />
        <ComingSoon tool={tool} />
      </>
    );
  }

  if (!isReadyToolSlug(slug)) {
    return null;
  }

  const ReadyTool = readyToolComponentMap[slug];

  return (
    <>
      <LastToolTracker slug={slug} />
      <ReadyTool />
    </>
  );
}
