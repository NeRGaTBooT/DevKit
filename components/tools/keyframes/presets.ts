import { createKeyframeStep } from "./types";
import type { KeyframesPreset } from "./types";

export const keyframesPresets: KeyframesPreset[] = [
  {
    id: "bounce",
    name: "Bounce",
    state: {
      name: "bounce",
      duration: 1.5,
      timingFunction: "ease-in-out",
      iterationCount: "infinite",
      steps: [
        {
          ...createKeyframeStep(0),
          translateY: 0,
          scale: 1,
          opacity: 1,
          backgroundColor: "#6366F1",
        },
        {
          ...createKeyframeStep(50),
          translateY: -40,
          scale: 1.1,
          opacity: 0.9,
          backgroundColor: "#818CF8",
        },
        {
          ...createKeyframeStep(100),
          translateY: 0,
          scale: 1,
          opacity: 1,
          backgroundColor: "#6366F1",
        },
      ],
    },
  },
  {
    id: "pulse",
    name: "Pulse",
    state: {
      name: "pulse",
      duration: 2,
      timingFunction: "ease-in-out",
      iterationCount: "infinite",
      steps: [
        {
          ...createKeyframeStep(0),
          scale: 1,
          opacity: 1,
          backgroundColor: "#EC4899",
        },
        {
          ...createKeyframeStep(50),
          scale: 1.3,
          opacity: 0.7,
          backgroundColor: "#F472B6",
        },
        {
          ...createKeyframeStep(100),
          scale: 1,
          opacity: 1,
          backgroundColor: "#EC4899",
        },
      ],
    },
  },
  {
    id: "slide",
    name: "Slide",
    state: {
      name: "slide",
      duration: 2,
      timingFunction: "ease-in-out",
      iterationCount: "infinite",
      steps: [
        {
          ...createKeyframeStep(0),
          translateX: -80,
          opacity: 0.5,
          backgroundColor: "#10B981",
        },
        {
          ...createKeyframeStep(50),
          translateX: 80,
          opacity: 1,
          backgroundColor: "#34D399",
        },
        {
          ...createKeyframeStep(100),
          translateX: -80,
          opacity: 0.5,
          backgroundColor: "#10B981",
        },
      ],
    },
  },
  {
    id: "spin",
    name: "Spin",
    state: {
      name: "spin",
      duration: 3,
      timingFunction: "linear",
      iterationCount: "infinite",
      steps: [
        {
          ...createKeyframeStep(0),
          rotate: 0,
          scale: 1,
          backgroundColor: "#F59E0B",
        },
        {
          ...createKeyframeStep(50),
          rotate: 180,
          scale: 1.1,
          backgroundColor: "#FBBF24",
        },
        {
          ...createKeyframeStep(100),
          rotate: 360,
          scale: 1,
          backgroundColor: "#F59E0B",
        },
      ],
    },
  },
  {
    id: "fade",
    name: "Fade",
    state: {
      name: "fade",
      duration: 2,
      timingFunction: "ease-in-out",
      iterationCount: "infinite",
      steps: [
        {
          ...createKeyframeStep(0),
          opacity: 1,
          backgroundColor: "#8B5CF6",
        },
        {
          ...createKeyframeStep(50),
          opacity: 0.2,
          backgroundColor: "#A78BFA",
        },
        {
          ...createKeyframeStep(100),
          opacity: 1,
          backgroundColor: "#8B5CF6",
        },
      ],
    },
  },
  {
    id: "shake",
    name: "Shake",
    state: {
      name: "shake",
      duration: 0.6,
      timingFunction: "ease-in-out",
      iterationCount: "infinite",
      steps: [
        {
          ...createKeyframeStep(0),
          translateX: 0,
          rotate: 0,
          backgroundColor: "#EF4444",
        },
        {
          ...createKeyframeStep(25),
          translateX: -10,
          rotate: -5,
          backgroundColor: "#F87171",
        },
        {
          ...createKeyframeStep(50),
          translateX: 10,
          rotate: 5,
          backgroundColor: "#EF4444",
        },
        {
          ...createKeyframeStep(75),
          translateX: -10,
          rotate: -5,
          backgroundColor: "#F87171",
        },
        {
          ...createKeyframeStep(100),
          translateX: 0,
          rotate: 0,
          backgroundColor: "#EF4444",
        },
      ],
    },
  },
];
