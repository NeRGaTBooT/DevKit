import type { CropPreset } from "@/components/tools/image-cropper/types";

export const CROP_PRESETS: CropPreset[] = [
  { id: "free", label: "Свободно", aspectRatio: null },
  { id: "1:1", label: "1:1", aspectRatio: 1 },
  { id: "16:9", label: "16:9", aspectRatio: 16 / 9 },
  { id: "4:3", label: "4:3", aspectRatio: 4 / 3 },
  {
    id: "og",
    label: "OG 1200×630",
    aspectRatio: 1200 / 630,
    exportSize: { width: 1200, height: 630 },
  },
  { id: "stories", label: "Stories 9:16", aspectRatio: 9 / 16 },
];

export function getPresetById(id: string): CropPreset {
  return CROP_PRESETS.find((preset) => preset.id === id) ?? CROP_PRESETS[0];
}
