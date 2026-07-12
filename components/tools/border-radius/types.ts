export interface CornerRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface BorderRadiusState {
  corners: CornerRadii;
  unified: boolean;
  elliptical: boolean;
  bgColor: string;
  objectColor: string;
}

export interface BorderRadiusPreset {
  id: string;
  name: string;
  state: Partial<BorderRadiusState>;
}

export const defaultCornerRadii: CornerRadii = {
  topLeft: 12,
  topRight: 12,
  bottomRight: 12,
  bottomLeft: 12,
};

export const defaultBorderRadiusState: BorderRadiusState = {
  corners: defaultCornerRadii,
  unified: true,
  elliptical: false,
  bgColor: "#F4F4F5",
  objectColor: "#FFFFFF",
};
