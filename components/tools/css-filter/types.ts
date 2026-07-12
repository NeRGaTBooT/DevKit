export type PreviewMode = "image" | "block";

export interface CssFilterState {
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  bgColor: string;
  previewMode: PreviewMode;
}

export interface CssFilterPreset {
  id: string;
  name: string;
  state: Partial<CssFilterState>;
}

export const defaultCssFilterState: CssFilterState = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  bgColor: "#F4F4F5",
  previewMode: "image",
};
