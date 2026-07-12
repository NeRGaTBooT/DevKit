export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type ColorInputFormat = "hex" | "rgb" | "hsl";

export interface ColorConverterState {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  activeFormat: ColorInputFormat;
}

export const DEFAULT_HEX = "#FF5733";

export const defaultColorConverterState: ColorConverterState = {
  hex: DEFAULT_HEX,
  rgb: { r: 255, g: 87, b: 51 },
  hsl: { h: 11, s: 100, l: 60 },
  activeFormat: "hex",
};
