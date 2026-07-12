export type PreviewBgPreset = "gradient" | "image" | "dark";

export interface GlassmorphismState {
  blur: number;
  opacity: number;
  tintColor: string;
  highlightColor: string;
  highlightOpacity: number;
  borderWidth: number;
  borderColor: string;
  borderOpacity: number;
  borderRadius: number;
  shadowDepth: number;
  highlights: boolean;
  bgPreset: PreviewBgPreset;
}

export interface GlassmorphismPreset {
  id: string;
  name: string;
  state: Partial<GlassmorphismState>;
}

export const defaultGlassmorphismState: GlassmorphismState = {
  blur: 20,
  opacity: 0.15,
  tintColor: "#FFFFFF",
  highlightColor: "#FFFFFF",
  highlightOpacity: 0.5,
  borderWidth: 1,
  borderColor: "#FFFFFF",
  borderOpacity: 0.3,
  borderRadius: 20,
  shadowDepth: 10,
  highlights: true,
  bgPreset: "gradient",
};
