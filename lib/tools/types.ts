import type { LucideIcon } from "lucide-react";

export type ToolCategory = "generators" | "utilities";

export type ToolStatus = "ready" | "coming-soon";

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  status: ToolStatus;
  keywords: string[];
  featured?: boolean;
}

export interface ToolCategoryMeta {
  id: ToolCategory;
  title: string;
  description: string;
}

export type NavigationToolGroup = {
  kind: "flat";
  category: ToolCategoryMeta;
  tools: ToolDefinition[];
};
