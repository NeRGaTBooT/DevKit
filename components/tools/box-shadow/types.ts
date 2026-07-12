export type PreviewShape = "card" | "circle" | "button";

export interface BoxShadowState {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
  bgColor: string;
  objectColor: string;
  shape: PreviewShape;
}

export interface BoxShadowPreset {
  id: string;
  name: string;
  state: Partial<BoxShadowState>;
}

export const defaultBoxShadowState: BoxShadowState = {
  offsetX: 0,
  offsetY: 8,
  blur: 24,
  spread: 0,
  color: "#000000",
  opacity: 0.12,
  inset: false,
  bgColor: "#F4F4F5",
  objectColor: "#FFFFFF",
  shape: "card",
};
