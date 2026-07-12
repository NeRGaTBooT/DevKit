"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { CropRect } from "@/components/tools/image-cropper/types";
import {
  clampCropRect,
  createDefaultCropRect,
} from "@/lib/media/image-canvas";

type HandlePosition =
  | "move"
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w";

export interface CropCanvasProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  cropRect: CropRect;
  aspectRatio: number | null;
  onCropChange: (rect: CropRect) => void;
}

interface DragState {
  handle: HandlePosition;
  startX: number;
  startY: number;
  startRect: CropRect;
}

function getDisplayScale(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): number {
  if (imageWidth === 0 || imageHeight === 0) return 1;
  return Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
}

function imageToDisplay(
  rect: CropRect,
  scale: number,
  offsetX: number,
  offsetY: number,
) {
  return {
    x: rect.x * scale + offsetX,
    y: rect.y * scale + offsetY,
    width: rect.width * scale,
    height: rect.height * scale,
  };
}

function displayToImage(
  x: number,
  y: number,
  scale: number,
  offsetX: number,
  offsetY: number,
) {
  return {
    x: (x - offsetX) / scale,
    y: (y - offsetY) / scale,
  };
}

function resizeRect(
  rect: CropRect,
  handle: HandlePosition,
  deltaX: number,
  deltaY: number,
  aspectRatio: number | null,
): CropRect {
  let { x, y, width, height } = rect;

  if (handle.includes("e")) width += deltaX;
  if (handle.includes("w")) {
    width -= deltaX;
    x += deltaX;
  }
  if (handle.includes("s")) height += deltaY;
  if (handle.includes("n")) {
    height -= deltaY;
    y += deltaY;
  }

  if (aspectRatio !== null) {
    if (handle === "e" || handle === "w") {
      height = width / aspectRatio;
      if (handle === "w") y = rect.y + rect.height - height;
    } else if (handle === "n" || handle === "s") {
      width = height * aspectRatio;
      if (handle === "n") x = rect.x + rect.width - width;
    } else {
      height = width / aspectRatio;
      if (handle.includes("n")) y = rect.y + rect.height - height;
      if (handle.includes("w")) x = rect.x + rect.width - width;
    }
  }

  return { x, y, width, height };
}

const HANDLES: Array<{ id: HandlePosition; className: string; cursor: string }> = [
  { id: "nw", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2", cursor: "nwse-resize" },
  { id: "n", className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", cursor: "ns-resize" },
  { id: "ne", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2", cursor: "nesw-resize" },
  { id: "e", className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2", cursor: "ew-resize" },
  { id: "se", className: "right-0 bottom-0 translate-x-1/2 translate-y-1/2", cursor: "nwse-resize" },
  { id: "s", className: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2", cursor: "ns-resize" },
  { id: "sw", className: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2", cursor: "nesw-resize" },
  { id: "w", className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2", cursor: "ew-resize" },
];

export function CropCanvas({
  imageUrl,
  imageWidth,
  imageHeight,
  cropRect,
  aspectRatio,
  onCropChange,
}: CropCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setLayout({
        width: entry.contentRect.width,
        height: Math.min(480, entry.contentRect.width * 0.75),
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const scale = getDisplayScale(layout.width, layout.height, imageWidth, imageHeight);
  const displayWidth = imageWidth * scale;
  const displayHeight = imageHeight * scale;
  const offsetX = (layout.width - displayWidth) / 2;
  const offsetY = (layout.height - displayHeight) / 2;
  const displayRect = imageToDisplay(cropRect, scale, offsetX, offsetY);

  const handlePointerDown = useCallback(
    (handle: HandlePosition) => (event: ReactPointerEvent) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        handle,
        startX: event.clientX,
        startY: event.clientY,
        startRect: cropRect,
      };
    },
    [cropRect],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const deltaX = (event.clientX - drag.startX) / scale;
      const deltaY = (event.clientY - drag.startY) / scale;

      let nextRect: CropRect;

      if (drag.handle === "move") {
        nextRect = {
          ...drag.startRect,
          x: drag.startRect.x + deltaX,
          y: drag.startRect.y + deltaY,
        };
      } else {
        nextRect = resizeRect(
          drag.startRect,
          drag.handle,
          deltaX,
          deltaY,
          aspectRatio,
        );
      }

      onCropChange(clampCropRect(nextRect, imageWidth, imageHeight, aspectRatio));
    },
    [aspectRatio, imageHeight, imageWidth, onCropChange, scale],
  );

  const handlePointerUp = useCallback((event: ReactPointerEvent) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      dragRef.current = null;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/30"
      style={{ height: layout.height || 320 }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Crop preview"
        draggable={false}
        className="pointer-events-none absolute select-none"
        style={{
          width: displayWidth,
          height: displayHeight,
          left: offsetX,
          top: offsetY,
        }}
      />

      <div
        className="absolute border-2 border-primary bg-primary/10"
        style={{
          left: displayRect.x,
          top: displayRect.y,
          width: displayRect.width,
          height: displayRect.height,
          cursor: "move",
        }}
        onPointerDown={handlePointerDown("move")}
      >
        {HANDLES.map((handle) => (
          <div
            key={handle.id}
            className={`absolute size-3 rounded-full border-2 border-primary bg-background ${handle.className}`}
            style={{ cursor: handle.cursor }}
            onPointerDown={(event) => {
              event.stopPropagation();
              handlePointerDown(handle.id)(event);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function initializeCropRect(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null,
): CropRect {
  return createDefaultCropRect(imageWidth, imageHeight, aspectRatio);
}

export function updateCropField(
  rect: CropRect,
  field: keyof CropRect,
  value: number,
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null,
): CropRect {
  const next = { ...rect, [field]: Math.max(0, value) };

  if (aspectRatio !== null && (field === "width" || field === "height")) {
    if (field === "width") {
      next.height = next.width / aspectRatio;
    } else {
      next.width = next.height * aspectRatio;
    }
  }

  return clampCropRect(next, imageWidth, imageHeight, aspectRatio);
}

export { displayToImage, getDisplayScale };
