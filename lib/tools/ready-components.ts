import type { ComponentType } from "react";

export type ReadyToolLoader = () => Promise<{ default: ComponentType }>;

export const readyToolComponents = {
  "box-shadow": () =>
    import("@/components/tools/box-shadow/box-shadow-tool").then((module) => ({
      default: module.BoxShadowTool,
    })),
  gradient: () =>
    import("@/components/tools/gradient/gradient-tool").then((module) => ({
      default: module.GradientTool,
    })),
  flexbox: () =>
    import("@/components/tools/flexbox/flexbox-tool").then((module) => ({
      default: module.FlexboxTool,
    })),
  grid: () =>
    import("@/components/tools/grid/grid-tool").then((module) => ({
      default: module.GridTool,
    })),
  "border-radius": () =>
    import("@/components/tools/border-radius/border-radius-tool").then(
      (module) => ({
        default: module.BorderRadiusTool,
      }),
    ),
  "text-shadow": () =>
    import("@/components/tools/text-shadow/text-shadow-tool").then((module) => ({
      default: module.TextShadowTool,
    })),
  "css-filter": () =>
    import("@/components/tools/css-filter/css-filter-tool").then((module) => ({
      default: module.CssFilterTool,
    })),
  keyframes: () =>
    import("@/components/tools/keyframes/keyframes-tool").then((module) => ({
      default: module.KeyframesTool,
    })),
  glassmorphism: () =>
    import("@/components/tools/glassmorphism/glassmorphism-tool").then(
      (module) => ({
        default: module.GlassmorphismTool,
      }),
    ),
  snippets: () =>
    import("@/components/tools/snippets/snippets-tool").then((module) => ({
      default: module.SnippetsTool,
    })),
  "color-converter": () =>
    import("@/components/tools/color-converter/color-converter-tool").then(
      (module) => ({
        default: module.ColorConverterTool,
      }),
    ),
  "file-converter": () =>
    import("@/components/tools/file-converter/file-converter-tool").then(
      (module) => ({
        default: module.FileConverterTool,
      }),
    ),
  "image-compressor": () =>
    import("@/components/tools/image-compressor/image-compressor-tool").then(
      (module) => ({
        default: module.ImageCompressorTool,
      }),
    ),
  "image-cropper": () =>
    import("@/components/tools/image-cropper/image-cropper-tool").then(
      (module) => ({
        default: module.ImageCropperTool,
      }),
    ),
  "pdf-merge-split": () =>
    import("@/components/tools/pdf-merge-split/pdf-merge-split-tool").then(
      (module) => ({
        default: module.PdfMergeSplitTool,
      }),
    ),
} satisfies Record<string, ReadyToolLoader>;

export type ReadyToolSlug = keyof typeof readyToolComponents;

export function isReadyToolSlug(slug: string): slug is ReadyToolSlug {
  return slug in readyToolComponents;
}
