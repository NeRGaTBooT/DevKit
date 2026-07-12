export interface TextShadowLayer {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

export interface TextShadowState {
  shadows: TextShadowLayer[];
  activeShadowId: string | null;
  sampleText: string;
  fontSize: number;
  textColor: string;
  bgColor: string;
}

export interface TextShadowPreset {
  id: string;
  name: string;
  state: Partial<TextShadowState>;
}

export function createTextShadowLayer(index = 0): TextShadowLayer {
  return {
    id: crypto.randomUUID(),
    offsetX: 0,
    offsetY: index === 0 ? 4 : 0,
    blur: index === 0 ? 8 : 0,
    color: "#000000",
    opacity: index === 0 ? 0.35 : 0.2,
  };
}

export const MAX_TEXT_SHADOWS = 5;
export const MIN_TEXT_SHADOWS = 1;

export const defaultTextShadowState: TextShadowState = {
  shadows: [createTextShadowLayer(0)],
  activeShadowId: null,
  sampleText: "Text Shadow",
  fontSize: 48,
  textColor: "#FFFFFF",
  bgColor: "#18181B",
};
