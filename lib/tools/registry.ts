import {
  Layers,
  Palette,
  Box,
  Grid3x3,
  Sparkles,
  Type,
  Wand2,
  Image,
  StickyNote,
  Droplet,
  Blend,
  FileImage,
  Minimize2,
  Crop,
  Files,
} from "lucide-react";

import type {
  NavigationToolGroup,
  ToolCategory,
  ToolCategoryMeta,
  ToolDefinition,
} from "./types";

export const toolCategories: ToolCategoryMeta[] = [
  {
    id: "generators",
    title: "Генераторы",
    description: "CSS и визуальные инструменты для быстрой вёрстки",
  },
  {
    id: "utilities",
    title: "Инструменты",
    description: "Сниппеты и утилиты для ежедневной работы",
  },
];

export const tools: ToolDefinition[] = [
  {
    slug: "box-shadow",
    title: "Box Shadow",
    description: "Генератор CSS-теней с пресетами и live preview",
    category: "generators",
    icon: Layers,
    status: "ready",
    featured: true,
    keywords: ["тень", "shadow", "css", "box-shadow", "пресет"],
  },
  {
    slug: "gradient",
    title: "Gradient",
    description: "Конструктор CSS-градиентов",
    category: "generators",
    icon: Palette,
    status: "ready",
    featured: true,
    keywords: ["градиент", "gradient", "css", "linear", "radial"],
  },
  {
    slug: "flexbox",
    title: "Flexbox",
    description: "Визуальный playground для flexbox",
    category: "generators",
    icon: Box,
    status: "ready",
    featured: true,
    keywords: ["flex", "flexbox", "css", "layout", "вёрстка"],
  },
  {
    slug: "grid",
    title: "Grid Playground",
    description: "Визуальный playground для CSS Grid",
    category: "generators",
    icon: Grid3x3,
    status: "ready",
    keywords: ["grid", "css grid", "layout", "сетка", "вёрстка"],
  },
  {
    slug: "border-radius",
    title: "Border Radius",
    description: "Генератор border-radius с эллиптическим режимом",
    category: "generators",
    icon: Sparkles,
    status: "ready",
    keywords: ["border-radius", "радиус", "скругление", "css", "углы"],
  },
  {
    slug: "text-shadow",
    title: "Text Shadow",
    description: "Генератор CSS text-shadow с мульти-тенями",
    category: "generators",
    icon: Type,
    status: "ready",
    keywords: ["text-shadow", "тень текста", "css", "типографика"],
  },
  {
    slug: "css-filter",
    title: "CSS Filter",
    description: "Конструктор CSS-фильтров с live preview",
    category: "generators",
    icon: Image,
    status: "ready",
    keywords: ["filter", "blur", "grayscale", "css", "фильтр"],
  },
  {
    slug: "keyframes",
    title: "Animation Keyframes",
    description: "Генератор @keyframes с timeline и preview",
    category: "generators",
    icon: Wand2,
    status: "ready",
    keywords: ["keyframes", "animation", "css", "анимация"],
  },
  {
    slug: "glassmorphism",
    title: "Glassmorphism",
    description:
      "Генератор эффекта матового стекла: blur, прозрачность, блики и рамка",
    category: "generators",
    icon: Blend,
    status: "ready",
    keywords: [
      "glassmorphism",
      "glass",
      "backdrop-filter",
      "blur",
      "стекло",
      "матовое стекло",
      "css",
    ],
  },
  {
    slug: "snippets",
    title: "Snippets",
    description: "Библиотека готовых сниппетов",
    category: "utilities",
    icon: StickyNote,
    status: "ready",
    keywords: ["сниппеты", "snippets", "код", "шаблоны", "copy"],
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Конвертация HEX, RGB и HSL",
    category: "utilities",
    icon: Droplet,
    status: "ready",
    keywords: ["color", "hex", "rgb", "hsl", "цвет", "конвертер"],
  },
  {
    slug: "file-converter",
    title: "File Converter",
    description: "Конвертация PDF и изображений (JPG, PNG, WEBP)",
    category: "utilities",
    icon: FileImage,
    status: "ready",
    keywords: [
      "pdf",
      "jpg",
      "png",
      "webp",
      "конвертер",
      "convert",
      "файл",
      "изображение",
    ],
  },
  {
    slug: "image-compressor",
    title: "Image Compressor",
    description: "Сжатие изображений без смены формата",
    category: "utilities",
    icon: Minimize2,
    status: "ready",
    keywords: [
      "compress",
      "сжатие",
      "jpg",
      "png",
      "webp",
      "resize",
      "изображение",
      "optimize",
    ],
  },
  {
    slug: "image-cropper",
    title: "Image Cropper",
    description: "Обрезка изображений с presets и экспортом",
    category: "utilities",
    icon: Crop,
    status: "ready",
    keywords: [
      "crop",
      "обрезка",
      "avatar",
      "og",
      "jpg",
      "png",
      "webp",
      "изображение",
    ],
  },
  {
    slug: "pdf-merge-split",
    title: "PDF Merge / Split",
    description: "Объединение и разделение PDF файлов",
    category: "utilities",
    icon: Files,
    status: "ready",
    keywords: [
      "pdf",
      "merge",
      "split",
      "объединить",
      "разделить",
      "страницы",
      "extract",
    ],
  },
];

const toolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolsBySlug.get(slug);
}

export function isKnownToolSlug(slug: string): boolean {
  return toolsBySlug.has(slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}

export function getNavigationToolGroups(): NavigationToolGroup[] {
  return toolCategories.map((category) => ({
    kind: "flat",
    category,
    tools: getToolsByCategory(category.id),
  }));
}

export function getToolsGroupedByCategory(): Array<{
  category: ToolCategoryMeta;
  tools: ToolDefinition[];
}> {
  return toolCategories.map((category) => ({
    category,
    tools: getToolsByCategory(category.id),
  }));
}

export function getReadyTools(): ToolDefinition[] {
  return tools.filter((tool) => tool.status === "ready");
}

export function getFeaturedTools(): ToolDefinition[] {
  return tools.filter((tool) => tool.featured && tool.status === "ready");
}

export function searchTools(query: string): ToolDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tools;

  return tools.filter((tool) => {
    const haystack = [
      tool.title,
      tool.description,
      tool.slug,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
