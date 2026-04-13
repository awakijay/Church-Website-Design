import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Camera,
  Download,
  Images,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  activityCategories,
  activityGallery,
  type ActivityCategory,
  type ActivityCategoryFilter,
  type ActivityPhoto,
  recentActivityGalleryLimit,
} from "../content/activityGallery";
import { useChurchContent } from "../content/ChurchContentContext";
import { ChurchMomentItem } from "../content/churchContent";
import { getThumbnailObjectPosition } from "../lib/thumbnailPosition";
import { useInView } from "./hooks/useInView";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type PhotoCardProps = {
  photo: ActivityPhoto;
  index: number;
  inView: boolean;
  onPreview: (photo: ActivityPhoto) => void;
  emphasized?: boolean;
};

const manualMomentDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const manualMomentTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMomentDate(value: string) {
  const parsed = value ? new Date(value) : new Date();

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function createManualChurchMomentPhoto(moment: ChurchMomentItem): ActivityPhoto {
  const capturedAt = getMomentDate(moment.capturedAt);
  const slug = slugify(`${moment.title}-${moment.id}`) || moment.id;

  return {
    id: `${moment.id}-manual`,
    src: moment.imageSrc,
    alt: moment.title || "Church moment",
    title: moment.title || "Church Moment",
    subtitle: moment.subtitle || "A new church moment has been added.",
    category: moment.category as ActivityCategory,
    objectPosition: getThumbnailObjectPosition(
      moment.thumbnailPositionX,
      moment.thumbnailPositionY,
    ),
    fileName: `${slug}.jpg`,
    capturedAt,
    dateKey: getDateKey(capturedAt),
    dateLabel: manualMomentDateFormatter.format(capturedAt),
    timeLabel: manualMomentTimeFormatter.format(capturedAt),
    downloadName: `${slug}.jpg`,
  };
}

function PhotoCard({
  photo,
  index,
  inView,
  onPreview,
  emphasized = false,
}: PhotoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.06 * index }}
      className={`group overflow-hidden rounded-[30px] border border-white/10 bg-white/6 shadow-[0_18px_40px_rgba(0,0,0,0.24)] ${
        emphasized ? "lg:col-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          emphasized ? "h-[300px] sm:h-[320px]" : "h-[260px] sm:h-[280px]"
        }`}
      >
        <ImageWithFallback
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: photo.objectPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090A]/88 via-[#09090A]/18 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/12 bg-[#09090A]/45 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFD7BA] backdrop-blur-xl">
          {photo.category}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-2xl text-white">{photo.title}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/72">
            {photo.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/58">
            <span>{photo.dateLabel}</span>
            <span>{photo.timeLabel}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onPreview(photo)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:border-[#FF6B00]/60 hover:bg-white/16 sm:w-auto"
            >
              Preview
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={photo.src}
              download={photo.downloadName}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-4 py-2 text-sm text-white transition-colors hover:bg-[#FF6B00]/90 sm:w-auto"
            >
              Download
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ChurchMoments() {
  const { ref, inView } = useInView();
  const {
    content: { churchMoments },
  } = useChurchContent();
  const archiveRef = useRef<HTMLDivElement | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<ActivityCategoryFilter>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityPhoto | null>(null);

  const allMoments = useMemo(() => {
    const managedMoments = churchMoments
      .filter((moment) => moment.imageSrc.trim())
      .map(createManualChurchMomentPhoto);

    return [...managedMoments, ...activityGallery].sort((left, right) => {
      const difference = right.capturedAt.getTime() - left.capturedAt.getTime();

      if (difference !== 0) {
        return difference;
      }

      return right.id.localeCompare(left.id);
    });
  }, [churchMoments]);

  const recentMoments = allMoments.slice(0, recentActivityGalleryLimit);
  const archivedMoments = allMoments.slice(recentActivityGalleryLimit);

  useEffect(() => {
    if (!showArchive) {
      return;
    }

    archiveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showArchive]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredArchivePhotos = archivedMoments.filter((photo) => {
    const matchesCategory =
      categoryFilter === "All" || photo.category === categoryFilter;
    const searchableContent = [
      photo.title,
      photo.subtitle,
      photo.category,
      photo.dateLabel,
      photo.timeLabel,
      photo.fileName,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && (!normalizedSearch || searchableContent.includes(normalizedSearch));
  });

  const archiveDateGroups: Array<{
    dateKey: string;
    dateLabel: string;
    photos: ActivityPhoto[];
  }> = [];

  for (const photo of filteredArchivePhotos) {
    const existingGroup = archiveDateGroups.at(-1);

    if (existingGroup?.dateKey === photo.dateKey) {
      existingGroup.photos.push(photo);
      continue;
    }

    archiveDateGroups.push({
      dateKey: photo.dateKey,
      dateLabel: photo.dateLabel,
      photos: [photo],
    });
  }

  return (
    <section
      id="moments"
      ref={ref}
      className="relative overflow-hidden bg-[#1C2526] px-4 py-16 text-white sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(17,132,204,0.24),_transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFD7BA]">
            <Camera className="h-4 w-4" />
            Church Moments
          </div>
          <h2 className="text-4xl md:text-6xl">
            Recent moments first, with the full archive close by.
          </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
            We now highlight the latest church photos here, including moments
            uploaded from the admin panel, while older memories stay tucked
            into an archive you can search, filter by category, and download
            from anytime.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recentMoments.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              inView={inView}
              onPreview={setSelectedPhoto}
              emphasized={index === 0}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 rounded-[30px] border border-white/10 bg-white/6 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFD7BA]">
                <Sparkles className="h-3.5 w-3.5" />
                Archive Ready
              </div>
              <h3 className="mt-4 text-2xl text-white sm:text-3xl">
                Explore every church memory in one place.
              </h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/72">
                {archivedMoments.length} more photo
                {archivedMoments.length === 1 ? "" : "s"} are waiting in
                the archive, grouped by date with quick search, filtering, and
                one-tap downloads.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="rounded-[24px] border border-white/10 bg-white/8 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/56">
                  Showing Now
                </p>
                <p className="mt-2 text-3xl text-white">{recentMoments.length}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowArchive((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-6 py-4 text-base text-white transition-colors hover:bg-[#FF6B00]/90"
              >
                <Images className="h-5 w-5" />
                {showArchive ? "Hide Archive" : "View All Archive"}
              </button>
            </div>
          </div>
        </motion.div>

        {showArchive ? (
          <motion.div
            ref={archiveRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-10 rounded-[32px] border border-white/10 bg-[#111719]/86 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#FFD7BA]">
                  Archive Search
                </p>
                <h3 className="mt-3 text-3xl text-white">Browse older church moments</h3>
              </div>
              <p className="text-sm text-white/62">
                {filteredArchivePhotos.length} result
                {filteredArchivePhotos.length === 1 ? "" : "s"} across{" "}
                {archiveDateGroups.length} date
                {archiveDateGroups.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-white/68">
                  <Search className="h-4 w-4" />
                  Search photos
                </span>
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title, category, date, or filename"
                  className="h-12 border-white/12 bg-white/8 px-4 text-white placeholder:text-white/34"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-white/68">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter by category
                </span>
                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value as ActivityCategoryFilter)
                  }
                  className="h-12 w-full rounded-md border border-white/12 bg-white/8 px-4 text-white outline-none transition-[color,box-shadow] focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
                >
                  {activityCategories.map((category) => (
                    <option key={category} value={category} className="bg-[#172021] text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {archiveDateGroups.length > 0 ? (
              <div className="mt-10 space-y-10">
                {archiveDateGroups.map((group) => (
                  <div key={group.dateKey}>
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <h4 className="text-2xl text-white">{group.dateLabel}</h4>
                      <p className="text-sm uppercase tracking-[0.2em] text-white/52">
                        {group.photos.length} photo
                        {group.photos.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {group.photos.map((photo, index) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          index={index}
                          inView
                          onPreview={setSelectedPhoto}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-[28px] border border-dashed border-white/14 bg-white/5 px-6 py-10 text-center">
                <p className="text-xl text-white">No archive photos match this search yet.</p>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  Try a different keyword or switch the filter back to `All`.
                </p>
              </div>
            )}
          </motion.div>
        ) : null}
      </div>

      <Dialog
        open={Boolean(selectedPhoto)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPhoto(null);
          }
        }}
      >
        <DialogContent className="max-h-[95vh] max-w-[calc(100%-1rem)] overflow-hidden rounded-[24px] border-white/10 bg-[#101718] p-0 text-white sm:max-w-5xl sm:rounded-[30px]">
          {selectedPhoto ? (
            <div className="grid max-h-[95vh] overflow-y-auto lg:grid-cols-[1.08fr_0.92fr]">
              <div className="flex min-h-[280px] items-center justify-center bg-[#0C1112] p-3 sm:min-h-[360px] sm:p-4 lg:min-h-[620px] lg:p-5">
                <ImageWithFallback
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="h-auto max-h-[54vh] w-auto max-w-full rounded-[20px] object-contain sm:max-h-[62vh] lg:max-h-[88vh]"
                  style={{ objectPosition: selectedPhoto.objectPosition }}
                />
              </div>

              <div className="flex flex-col justify-between gap-6 p-4 pr-12 sm:p-6 sm:pr-14 lg:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#FFD7BA]">
                    {selectedPhoto.category}
                  </p>
                  <DialogTitle className="mt-3 text-2xl text-white sm:text-3xl">
                    {selectedPhoto.title}
                  </DialogTitle>
                  <DialogDescription className="mt-4 text-base leading-7 text-white/68">
                    {selectedPhoto.subtitle}
                  </DialogDescription>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/48">Date</p>
                      <p className="mt-2 text-lg text-white">{selectedPhoto.dateLabel}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/48">Time</p>
                      <p className="mt-2 text-lg text-white">{selectedPhoto.timeLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={selectedPhoto.src}
                    download={selectedPhoto.downloadName}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm text-white transition-colors hover:bg-[#FF6B00]/90 sm:w-auto"
                  >
                    Download Photo
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm text-white transition-colors hover:border-white/30 hover:bg-white/10 sm:w-auto"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
