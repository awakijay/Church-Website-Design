import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Expand,
  ImageIcon,
  Share2,
} from "lucide-react";
import { useChurchContent } from "../content/ChurchContentContext";
import { GraphicMemeItem } from "../content/churchContent";
import { getThumbnailObjectPosition } from "../lib/thumbnailPosition";
import { useInView } from "./hooks/useInView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getGraphicExtension(src: string) {
  if (src.startsWith("data:")) {
    const mimeType = src.match(/^data:image\/([a-z0-9.+-]+);/i)?.[1]?.toLowerCase();

    if (mimeType === "jpeg") {
      return "jpg";
    }

    if (mimeType?.includes("svg")) {
      return "svg";
    }

    return mimeType ?? "jpg";
  }

  try {
    const parsed = new URL(
      src,
      typeof window !== "undefined" ? window.location.origin : "https://example.com",
    );
    const extension = parsed.pathname.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();

    if (extension === "jpeg") {
      return "jpg";
    }

    return extension ?? "jpg";
  } catch {
    return "jpg";
  }
}

function getGraphicDownloadName(graphic: GraphicMemeItem) {
  return `${slugify(graphic.title || "graphic-meme")}.${getGraphicExtension(
    graphic.imageSrc,
  )}`;
}

function createGraphicShareText(graphic: GraphicMemeItem) {
  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#graphic-memes`
      : "#graphic-memes";

  return `${graphic.title}\n\n${graphic.summary}\n\n${pageUrl}`;
}

export function GraphicMemes() {
  const { ref, inView } = useInView();
  const {
    content: { graphicMemes },
  } = useChurchContent();
  const [selectedGraphicIndex, setSelectedGraphicIndex] = useState<number | null>(
    null,
  );
  const [shareFeedbackId, setShareFeedbackId] = useState<string | null>(null);
  const uploadedGraphics = useMemo(
    () => graphicMemes.filter((graphic) => graphic.imageSrc.trim()),
    [graphicMemes],
  );
  const canUseNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const selectedGraphic =
    selectedGraphicIndex !== null ? uploadedGraphics[selectedGraphicIndex] ?? null : null;

  function showShareFeedback(graphicId: string) {
    setShareFeedbackId(graphicId);
    window.setTimeout(() => setShareFeedbackId(null), 2000);
  }

  function showPreviousGraphic() {
    if (selectedGraphicIndex === null || uploadedGraphics.length <= 1) {
      return;
    }

    setSelectedGraphicIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current - 1 + uploadedGraphics.length) % uploadedGraphics.length;
    });
  }

  function showNextGraphic() {
    if (selectedGraphicIndex === null || uploadedGraphics.length <= 1) {
      return;
    }

    setSelectedGraphicIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current + 1) % uploadedGraphics.length;
    });
  }

  async function handleShareGraphic(graphic: GraphicMemeItem) {
    const shareText = createGraphicShareText(graphic);

    if (canUseNativeShare) {
      try {
        if (typeof File !== "undefined") {
          const response = await fetch(graphic.imageSrc);
          const blob = await response.blob();
          const file = new File([blob], getGraphicDownloadName(graphic), {
            type: blob.type || "image/jpeg",
          });

          if (
            typeof navigator.canShare === "function" &&
            navigator.canShare({ files: [file] })
          ) {
            await navigator.share({
              title: graphic.title,
              text: graphic.summary,
              files: [file],
            });
            return;
          }
        }

        await navigator.share({
          title: graphic.title,
          text: shareText,
        });
        return;
      } catch {
        // Fall back to clipboard when sharing is cancelled or file sharing is unavailable.
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        showShareFeedback(graphic.id);
      } catch {
        setShareFeedbackId(null);
      }
    }
  }

  return (
    <section
      id="graphic-memes"
      ref={ref}
      className="scroll-mt-28 bg-[#FFF8E8] px-4 py-16 sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >
          {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/18 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#FF6B00]">
            <ImageIcon className="h-4 w-4" />
            Graphic Memes
          </div> */}
          <h2 className="text-4xl text-[#1C2526] md:text-6xl">
            Shareable graphics with ministry-ready context.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#1C2526]/70">
            Explore polished church graphics, sermon creatives, and visual
            encouragement designed for real ministry use. Open any graphic to
            view it in a full lightbox with its caption and supporting details.
          </p>
        </motion.div>

        {uploadedGraphics.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {uploadedGraphics.map((graphic, index) => (
              <motion.button
                key={graphic.id}
                type="button"
                onClick={() => setSelectedGraphicIndex(index)}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group relative aspect-[0.95] overflow-hidden rounded-[34px] border border-[#1C2526]/10 text-left shadow-[0_24px_60px_rgba(28,37,38,0.16)]"
              >
                <ImageWithFallback
                  src={graphic.imageSrc}
                  alt={graphic.title || `Graphic meme ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    objectPosition: getThumbnailObjectPosition(
                      graphic.thumbnailPositionX,
                      graphic.thumbnailPositionY,
                    ),
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171E1F]/88 via-[#171E1F]/22 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5">
                  <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#FFD7BA]">
                    Graphic {index + 1}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white">
                    <Expand className="h-5 w-5" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xl">{graphic.title}</p>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/82">
                    {graphic.summary}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD7BA]">
                    Tap to open, share, or download
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#1C2526]/10 bg-white p-6 text-[#1C2526]/60 shadow-[0_18px_45px_rgba(28,37,38,0.08)]">
            Add graphic posts from the admin panel to publish them here with a
            polished popup experience.
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(selectedGraphic)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGraphicIndex(null);
          }
        }}
      >
        <DialogContent className="max-h-[95vh] max-w-[calc(100%-1rem)] overflow-hidden rounded-[24px] border-[#1C2526]/10 bg-[#FFFDF8] p-0 shadow-[0_30px_90px_rgba(28,37,38,0.18)] sm:max-w-6xl sm:rounded-[30px]">
          {selectedGraphic ? (
            <div className="grid max-h-[95vh] overflow-y-auto lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative border-b border-[#1C2526]/8 bg-[#111719] lg:border-b-0 lg:border-r">
                <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2 px-3 lg:inset-x-auto lg:bottom-auto lg:left-5 lg:top-5">
                  {uploadedGraphics.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={showPreviousGraphic}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white backdrop-blur transition-colors hover:bg-white/16 sm:h-11 sm:w-11"
                        aria-label="Show previous graphic"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={showNextGraphic}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white backdrop-blur transition-colors hover:bg-white/16 sm:h-11 sm:w-11"
                        aria-label="Show next graphic"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="flex min-h-[280px] items-center justify-center p-2 pb-16 sm:min-h-[360px] sm:p-4 sm:pb-20 lg:min-h-[620px] lg:p-5 lg:pb-5">
                  <ImageWithFallback
                    src={selectedGraphic.imageSrc}
                    alt={selectedGraphic.title || "Graphic meme preview"}
                    className="h-auto max-h-[52vh] w-auto max-w-full rounded-[18px] object-contain sm:max-h-[60vh] lg:max-h-[82vh] lg:rounded-[24px]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="border-b border-[#1C2526]/8 bg-gradient-to-br from-[#FFF8E8] via-white to-[#FFF4E8] px-4 py-5 pr-14 sm:px-6 sm:py-7 md:px-8 md:py-8">
                  <DialogHeader className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B00]">
                      Graphic Details
                    </p>
                    <DialogTitle className="mt-3 text-2xl text-[#1C2526] sm:text-3xl">
                      {selectedGraphic.title}
                    </DialogTitle>
                    <DialogDescription className="mt-3 text-base leading-7 text-[#1C2526]/68">
                      {selectedGraphic.summary}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#1C2526]/8 bg-white/75 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2526]/45">
                        Gallery Position
                      </p>
                      <p className="mt-2 text-sm text-[#1C2526]">
                        {selectedGraphicIndex !== null
                          ? `${selectedGraphicIndex + 1} of ${uploadedGraphics.length}`
                          : `1 of ${uploadedGraphics.length}`}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#1C2526]/8 bg-white/75 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2526]/45">
                        Use Case
                      </p>
                      <p className="mt-2 text-sm text-[#1C2526]">
                        Shareable church design
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
                  <div className="rounded-[24px] border border-[#1C2526]/8 bg-white p-5 shadow-[0_10px_30px_rgba(28,37,38,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
                      Lightbox Notes
                    </p>
                    <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#1C2526]/78">
                      {selectedGraphic.details}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void handleShareGraphic(selectedGraphic)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm text-white transition-colors hover:bg-[#FF6B00]/90"
                    >
                      {shareFeedbackId === selectedGraphic.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied For Sharing
                        </>
                      ) : canUseNativeShare ? (
                        <>
                          <Share2 className="h-4 w-4" />
                          Share Graphic
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Share Text
                        </>
                      )}
                    </button>
                    <a
                      href={selectedGraphic.imageSrc}
                      download={getGraphicDownloadName(selectedGraphic)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#1C2526]/12 bg-white px-5 py-3 text-sm text-[#1C2526] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      Download Graphic
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
