export const DEFAULT_THUMBNAIL_POSITION = 50;

export function clampThumbnailPosition(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function normalizeThumbnailPosition(
  value: unknown,
  fallback = DEFAULT_THUMBNAIL_POSITION,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return clampThumbnailPosition(fallback);
  }

  return clampThumbnailPosition(value);
}

export function getThumbnailObjectPosition(positionX: number, positionY: number) {
  return `${clampThumbnailPosition(positionX)}% ${clampThumbnailPosition(positionY)}%`;
}
