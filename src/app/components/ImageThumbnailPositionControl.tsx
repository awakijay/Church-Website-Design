import { PointerEvent, useState } from "react";
import { Move, RotateCcw } from "lucide-react";
import {
  clampThumbnailPosition,
  DEFAULT_THUMBNAIL_POSITION,
  getThumbnailObjectPosition,
} from "../lib/thumbnailPosition";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type ImageThumbnailPositionControlProps = {
  src: string;
  alt: string;
  thumbnailPositionX: number;
  thumbnailPositionY: number;
  onChange: (next: { thumbnailPositionX: number; thumbnailPositionY: number }) => void;
  previewClassName?: string;
};

function getRelativeThumbnailPosition(
  event: PointerEvent<HTMLDivElement>,
  axis: "x" | "y",
) {
  const bounds = event.currentTarget.getBoundingClientRect();

  if (axis === "x") {
    return clampThumbnailPosition(((event.clientX - bounds.left) / bounds.width) * 100);
  }

  return clampThumbnailPosition(((event.clientY - bounds.top) / bounds.height) * 100);
}

export function ImageThumbnailPositionControl({
  src,
  alt,
  thumbnailPositionX,
  thumbnailPositionY,
  onChange,
  previewClassName = "aspect-[1.08]",
}: ImageThumbnailPositionControlProps) {
  const [isDragging, setIsDragging] = useState(false);

  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    onChange({
      thumbnailPositionX: getRelativeThumbnailPosition(event, "x"),
      thumbnailPositionY: getRelativeThumbnailPosition(event, "y"),
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    updateFromPointer(event);
  }

  function handlePointerRelease(event: PointerEvent<HTMLDivElement>) {
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="grid gap-4">
      <div
        className={`relative overflow-hidden rounded-[24px] border border-[#1C2526]/10 bg-[#1C2526] ${previewClassName} cursor-move touch-none select-none`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerRelease}
        onPointerCancel={handlePointerRelease}
      >
        <ImageWithFallback
          src={src}
          alt={alt}
          draggable={false}
          className="h-full w-full object-cover"
          style={{
            objectPosition: getThumbnailObjectPosition(
              thumbnailPositionX,
              thumbnailPositionY,
            ),
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:25%_25%]" />
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-white/60"
          style={{ left: `${thumbnailPositionX}%` }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 h-px bg-white/60"
          style={{ top: `${thumbnailPositionY}%` }}
        />
        <div
          className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-white bg-[#FF6B00] shadow-[0_0_0_4px_rgba(255,255,255,0.18)]"
          style={{
            left: `${thumbnailPositionX}%`,
            top: `${thumbnailPositionY}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full border border-white/12 bg-[#09090A]/55 px-3 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-white/88 backdrop-blur-md">
          <span className="inline-flex items-center gap-2">
            <Move className="h-3.5 w-3.5" />
            Drag preview to set thumbnail
          </span>
          <span>
            {thumbnailPositionX}% / {thumbnailPositionY}%
          </span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <label className="grid gap-2 rounded-[22px] border border-[#1C2526]/8 bg-white p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2526]/52">
            Horizontal Focus
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={thumbnailPositionX}
            onChange={(event) =>
              onChange({
                thumbnailPositionX: clampThumbnailPosition(Number(event.target.value)),
                thumbnailPositionY,
              })
            }
            className="accent-[#FF6B00]"
          />
        </label>

        <label className="grid gap-2 rounded-[22px] border border-[#1C2526]/8 bg-white p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2526]/52">
            Vertical Focus
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={thumbnailPositionY}
            onChange={(event) =>
              onChange({
                thumbnailPositionX,
                thumbnailPositionY: clampThumbnailPosition(Number(event.target.value)),
              })
            }
            className="accent-[#FF6B00]"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#1C2526]/8 bg-white px-4 py-3 text-sm text-[#1C2526]/68">
        <p>Use the live preview above to decide what part of the image shows on the website card.</p>
        <button
          type="button"
          onClick={() =>
            onChange({
              thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
              thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
            })
          }
          className="inline-flex items-center gap-2 rounded-full border border-[#1C2526]/10 px-4 py-2 text-[#1C2526] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Focus
        </button>
      </div>
    </div>
  );
}
