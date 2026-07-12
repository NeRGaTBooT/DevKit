export type GradientType = "linear" | "radial" | "conic";

export type RadialShape = "circle" | "ellipse";

export type RadialSize =
  | "closest-side"
  | "closest-corner"
  | "farthest-side"
  | "farthest-corner";

export type PreviewShape = "rectangle" | "circle" | "full";

export interface ColorStop {
  id: string;
  color: string;
  opacity: number;
  position: number;
}

export interface GradientState {
  type: GradientType;
  repeating: boolean;
  angle: number;
  stops: ColorStop[];
  radialShape: RadialShape;
  radialSize: RadialSize;
  position: { x: number; y: number };
  previewSize: { width: number; height: number };
  previewShape: PreviewShape;
  bgColor: string;
}

export interface GradientPreset {
  id: string;
  name: string;
  state: Partial<GradientState>;
}

function createStop(
  color: string,
  position: number,
  opacity = 1,
): ColorStop {
  return {
    id: crypto.randomUUID(),
    color,
    opacity,
    position,
  };
}

export const defaultGradientStops: ColorStop[] = [
  createStop("#6366F1", 0),
  createStop("#EC4899", 100),
];

export const defaultGradientState: GradientState = {
  type: "linear",
  repeating: false,
  angle: 90,
  stops: defaultGradientStops,
  radialShape: "ellipse",
  radialSize: "farthest-corner",
  position: { x: 50, y: 50 },
  previewSize: { width: 320, height: 200 },
  previewShape: "rectangle",
  bgColor: "#F4F4F5",
};

export function createColorStop(
  color: string,
  position: number,
  opacity = 1,
): ColorStop {
  return createStop(color, position, opacity);
}
