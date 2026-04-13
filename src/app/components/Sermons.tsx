import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Facebook,
  Instagram,
  MonitorPlay,
  Play,
  Youtube,
} from "lucide-react";
import { prefillContactMessage } from "../lib/contactActions";
import { useChurchContent } from "../content/ChurchContentContext";
import { SermonItem } from "../content/churchContent";
import { useInView } from "./hooks/useInView";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { AspectRatio } from "./ui/aspect-ratio";

type WatchLink = {
  href: string;
  platform: "YouTube" | "Facebook" | "TikTok" | "Instagram" | "Video";
};

type EmbedConfig =
  | {
      kind: "iframe";
      embedUrl: string;
      platform: WatchLink["platform"];
    }
  | {
      kind: "video";
      videoUrl: string;
      platform: "Video";
    };

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className ?? "h-4 w-4"} fill-current`}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.35h-3.17v12.58a2.86 2.86 0 1 1-2-2.73V9a6.04 6.04 0 1 0 5.2 5.98V8.57a8 8 0 0 0 4.77 1.56V6.69h-1.03Z" />
    </svg>
  );
}

function normalizeUrl(url: string) {
  return url.trim();
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function getYoutubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = getHostname(url);

    if (hostname === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (!hostname.endsWith("youtube.com")) {
      return null;
    }

    const directId = parsed.searchParams.get("v");

    if (directId) {
      return directId;
    }

    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    const embedIndex = pathSegments.findIndex((segment) =>
      ["embed", "shorts", "live"].includes(segment),
    );

    if (embedIndex >= 0) {
      return pathSegments[embedIndex + 1] ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

function getTikTokVideoId(url: string) {
  const match = url.match(/\/video\/(\d+)/i);

  return match?.[1] ?? null;
}

function getInstagramEmbedPath(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = getHostname(url);

    if (!hostname.endsWith("instagram.com")) {
      return null;
    }

    const [resourceType, resourceId] = parsed.pathname.split("/").filter(Boolean);

    if (!resourceType || !resourceId) {
      return null;
    }

    if (!["reel", "tv", "p"].includes(resourceType)) {
      return null;
    }

    return `${resourceType}/${resourceId}`;
  } catch {
    return null;
  }
}

function getDirectVideoUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (/\.(mp4|m4v|webm|ogg|ogv|mov)$/i.test(parsed.pathname)) {
      return url;
    }
  } catch {
    return null;
  }

  return null;
}

function getPlatformForUrl(url: string): WatchLink["platform"] {
  const hostname = getHostname(url);

  if (getDirectVideoUrl(url)) {
    return "Video";
  }

  if (hostname === "youtu.be" || hostname.endsWith("youtube.com")) {
    return "YouTube";
  }

  if (hostname.endsWith("facebook.com") || hostname === "fb.watch") {
    return "Facebook";
  }

  if (hostname.endsWith("tiktok.com")) {
    return "TikTok";
  }

  if (hostname.endsWith("instagram.com")) {
    return "Instagram";
  }

  return "Video";
}

function getEmbedConfig(url: string): EmbedConfig | null {
  const trimmedUrl = normalizeUrl(url);

  if (!trimmedUrl) {
    return null;
  }

  const youtubeId = getYoutubeVideoId(trimmedUrl);

  if (youtubeId) {
    return {
      kind: "iframe",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
      platform: "YouTube",
    };
  }

  const tiktokId = getTikTokVideoId(trimmedUrl);

  if (tiktokId) {
    return {
      kind: "iframe",
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokId}`,
      platform: "TikTok",
    };
  }

  const platform = getPlatformForUrl(trimmedUrl);

  if (platform === "Facebook") {
    return {
      kind: "iframe",
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        trimmedUrl,
      )}&show_text=false&width=1280`,
      platform: "Facebook",
    };
  }

  const instagramEmbedPath = getInstagramEmbedPath(trimmedUrl);

  if (instagramEmbedPath) {
    return {
      kind: "iframe",
      embedUrl: `https://www.instagram.com/${instagramEmbedPath}/embed/captioned/`,
      platform: "Instagram",
    };
  }

  const directVideoUrl = getDirectVideoUrl(trimmedUrl);

  if (directVideoUrl) {
    return {
      kind: "video",
      videoUrl: directVideoUrl,
      platform: "Video",
    };
  }

  return null;
}

function getWatchLinks(sermon: SermonItem): WatchLink[] {
  const uniqueLinks = new Set<string>();
  const candidateLinks = [
    normalizeUrl(sermon.link),
    normalizeUrl(sermon.facebookLink),
    normalizeUrl(sermon.tiktokLink),
    normalizeUrl(sermon.instagramLink),
  ].filter(Boolean);

  return candidateLinks
    .filter((href) => {
      if (uniqueLinks.has(href)) {
        return false;
      }

      uniqueLinks.add(href);
      return true;
    })
    .map((href) => ({
      href,
      platform: getPlatformForUrl(href),
    }));
}

function getPlatformIcon(platform: WatchLink["platform"]) {
  switch (platform) {
    case "YouTube":
      return <Youtube className="h-4 w-4" />;
    case "Facebook":
      return <Facebook className="h-4 w-4" />;
    case "TikTok":
      return <TiktokIcon className="h-4 w-4" />;
    case "Instagram":
      return <Instagram className="h-4 w-4" />;
    default:
      return <MonitorPlay className="h-4 w-4" />;
  }
}

function getPreferredEmbed(sermon: SermonItem) {
  const candidateLinks = [
    normalizeUrl(sermon.link),
    normalizeUrl(sermon.facebookLink),
    normalizeUrl(sermon.tiktokLink),
    normalizeUrl(sermon.instagramLink),
  ].filter(Boolean);

  for (const href of candidateLinks) {
    const embed = getEmbedConfig(href);

    if (embed) {
      return embed;
    }
  }

  return null;
}

export function Sermons() {
  const { ref, inView } = useInView();
  const {
    content: { sermons },
  } = useChurchContent();
  const [selectedSermon, setSelectedSermon] = useState<SermonItem | null>(null);

  const selectedSermonEmbed = useMemo(
    () => (selectedSermon ? getPreferredEmbed(selectedSermon) : null),
    [selectedSermon],
  );
  const selectedSermonWatchLinks = useMemo(
    () => (selectedSermon ? getWatchLinks(selectedSermon) : []),
    [selectedSermon],
  );

  return (
    <section
      id="sermons"
      ref={ref}
      className="scroll-mt-28 bg-[#FFF8E8] px-4 py-16 sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#1C2526] mb-4">
            Latest Sermons
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-lg text-[#1C2526]/70 max-w-2xl mx-auto">
            Watch recent messages right here in the site player, then continue
            on YouTube, Facebook, TikTok, or Instagram when links are
            available.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {sermons.map((sermon, index) => {
            const watchLinks = getWatchLinks(sermon);

            return (
              <motion.button
                key={sermon.id}
                type="button"
                onClick={() => setSelectedSermon(sermon)}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-[32px] border border-[#1C2526]/8 bg-white p-6 text-left shadow-[0_18px_45px_rgba(28,37,38,0.08)] transition-all hover:-translate-y-2 hover:shadow-2xl sm:p-8"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#FF6B00] shadow-[0_16px_30px_rgba(255,107,0,0.2)] transition-transform group-hover:scale-110">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>

                <div className="text-sm text-[#FF6B00] mb-2">{sermon.series}</div>
                <h3 className="text-2xl text-[#1C2526] mb-3">{sermon.title}</h3>
                <p className="text-[#1C2526]/70 mb-4">{sermon.speaker}</p>
                <p className="mb-5 text-[#1C2526]/65">{sermon.summary}</p>

                <div className="flex items-center text-sm text-[#1C2526]/60">
                  <Calendar className="w-4 h-4 mr-2" />
                  {sermon.date}
                </div>

                {watchLinks.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {watchLinks.map((link) => (
                      <span
                        key={`${sermon.id}-${link.platform}-${link.href}`}
                        className="rounded-full border border-[#1C2526]/10 bg-[#FFF8E8] px-3 py-1 text-xs font-medium text-[#1C2526]/75"
                      >
                        {link.platform}
                      </span>
                    ))}
                  </div>
                ) : null}

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FF6B00]">
                  Watch In Site
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              prefillContactMessage(
                "Hello, I would love access to the full sermon archive and recent messages.",
              );
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-8 py-3 text-white shadow-[0_18px_35px_rgba(255,107,0,0.18)] transition-colors hover:bg-[#FF6B00]/90"
          >
            Request Sermon Archive
          </a>
        </motion.div>

        <Dialog
          open={Boolean(selectedSermon)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedSermon(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-[28px] border-[#1C2526]/10 bg-[#FFFDF8] p-0 shadow-[0_30px_90px_rgba(28,37,38,0.18)]">
            {selectedSermon ? (
              <div>
                <div className="border-b border-[#1C2526]/8 bg-gradient-to-br from-[#FFF8E8] via-white to-[#FFF4E8] px-6 py-8 md:px-8">
                  <DialogHeader className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B00]">
                      Sermon Viewer
                    </p>
                    <DialogTitle className="mt-3 text-3xl text-[#1C2526]">
                      {selectedSermon.title}
                    </DialogTitle>
                    <DialogDescription className="mt-3 max-w-3xl text-base leading-7 text-[#1C2526]/68">
                      {selectedSermon.summary}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Speaker", value: selectedSermon.speaker },
                      { label: "Series", value: selectedSermon.series },
                      { label: "Date", value: selectedSermon.date },
                    ].map((item) => (
                      <div
                        key={`${item.label}-${item.value}`}
                        className="rounded-2xl border border-[#1C2526]/8 bg-white/75 px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2526]/45">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm text-[#1C2526]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 px-6 py-7 md:px-8">
                  {selectedSermonEmbed ? (
                    <div className="overflow-hidden rounded-[28px] border border-[#1C2526]/10 bg-[#111719] shadow-[0_18px_40px_rgba(28,37,38,0.12)]">
                      <AspectRatio ratio={16 / 9}>
                        {selectedSermonEmbed.kind === "video" ? (
                          <video
                            src={selectedSermonEmbed.videoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-full w-full bg-black"
                          />
                        ) : (
                          <iframe
                            src={selectedSermonEmbed.embedUrl}
                            title={`${selectedSermon.title} video`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        )}
                      </AspectRatio>
                    </div>
                  ) : selectedSermonWatchLinks.length > 0 ? (
                    <div className="rounded-[28px] border border-[#1C2526]/10 bg-[#FFF8E8] p-6">
                      <p className="text-lg text-[#1C2526]">
                        This sermon has a watch link, but it cannot be previewed in-site from
                        that URL yet.
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#1C2526]/65">
                        Visitors can still use the watch buttons below to open it on the
                        original platform.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-[28px] border border-dashed border-[#1C2526]/12 bg-[#FFF8E8] p-6">
                      <p className="text-lg text-[#1C2526]">
                        No sermon video has been added yet for this message.
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#1C2526]/65">
                        The sermon details are ready below, and the admin can add video links
                        at any time.
                      </p>
                    </div>
                  )}

                  {selectedSermonWatchLinks.length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
                        Where To Watch
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {selectedSermonWatchLinks.map((link) => (
                          <a
                            key={`${selectedSermon.id}-${link.platform}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-[#1C2526]/10 bg-white px-4 py-2.5 text-sm text-[#1C2526] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
                          >
                            {getPlatformIcon(link.platform)}
                            {link.platform}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-[28px] border border-[#1C2526]/8 bg-white p-6 shadow-[0_10px_30px_rgba(28,37,38,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
                      Sermon Details
                    </p>
                    <div className="mt-4 whitespace-pre-line text-base leading-7 text-[#1C2526]/78">
                      {selectedSermon.details}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
