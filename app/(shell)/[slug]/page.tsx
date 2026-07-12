import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolRenderer } from "@/components/tools/tool-renderer";
import { isReadyToolSlug } from "@/lib/tools/ready-components";
import { getToolBySlug, tools } from "@/lib/tools/registry";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: "Инструмент не найден | DevKit" };
  }

  return {
    title: `${tool.title} | DevKit`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  if (tool.status === "ready" && !isReadyToolSlug(tool.slug)) {
    notFound();
  }

  return <ToolRenderer slug={slug} />;
}
