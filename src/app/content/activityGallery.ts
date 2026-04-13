export type ActivityCategory =
  | "Worship"
  | "Fellowship"
  | "Teaching"
  | "Family"
  | "Service"
  | "Celebration";

export type ActivityPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  category: ActivityCategory;
  objectPosition?: string;
  fileName: string;
  capturedAt: Date;
  dateKey: string;
  dateLabel: string;
  timeLabel: string;
  downloadName: string;
};

type PhotoTemplate = Pick<
  ActivityPhoto,
  "alt" | "title" | "subtitle" | "category" | "objectPosition"
>;

const photoTemplates: PhotoTemplate[] = [
  {
    alt: "Church family gathered together after service",
    title: "Family Fellowship",
    subtitle: "A joyful church family growing together in love and worship.",
    category: "Fellowship",
    objectPosition: "center 24%",
  },
  {
    alt: "Young adults and leaders posing after an activity",
    title: "Community Moments",
    subtitle: "Beautiful friendships formed in God's presence.",
    category: "Fellowship",
    objectPosition: "center 22%",
  },
  {
    alt: "Members and children smiling together in church",
    title: "Generations Together",
    subtitle: "From children to adults, everyone belongs here.",
    category: "Family",
    objectPosition: "center 20%",
  },
  {
    alt: "A church minister speaking on stage",
    title: "Inspired Teaching",
    subtitle: "Messages that strengthen faith and stir purpose.",
    category: "Teaching",
    objectPosition: "center 18%",
  },
  {
    alt: "A speaker ministering during a church gathering",
    title: "Spirit-Led Ministry",
    subtitle: "Moments of truth, prayer, and spiritual encouragement.",
    category: "Worship",
    objectPosition: "center 18%",
  },
  {
    alt: "Men of the church standing together",
    title: "Brotherhood",
    subtitle: "Strong Christian fellowship built on shared faith.",
    category: "Fellowship",
    objectPosition: "center 22%",
  },
  {
    alt: "Church members posing in the auditorium",
    title: "Serving Together",
    subtitle: "Ordinary moments made meaningful in community.",
    category: "Service",
    objectPosition: "center 24%",
  },
  {
    alt: "Large church selfie after a lively gathering",
    title: "Joyful Celebrations",
    subtitle: "A vibrant church atmosphere full of warmth and life.",
    category: "Celebration",
    objectPosition: "center 18%",
  },
  {
    alt: "Church family photo with children and adults",
    title: "Church Family",
    subtitle: "A welcoming home for individuals, families, and children.",
    category: "Family",
    objectPosition: "center 20%",
  },
  {
    alt: "Worshippers engaged during a service",
    title: "Heartfelt Worship",
    subtitle: "Lives lifted in prayer, worship, and surrender to God.",
    category: "Worship",
    objectPosition: "center 18%",
  },
  {
    alt: "Another group portrait of the church family",
    title: "Together In Christ",
    subtitle: "A shared journey of growth, grace, and discipleship.",
    category: "Fellowship",
    objectPosition: "center 22%",
  },
  {
    alt: "Children and adults gathered together in church",
    title: "Raising A Generation",
    subtitle: "Helping children and families flourish in faith.",
    category: "Family",
    objectPosition: "center 20%",
  },
  {
    alt: "Church members taking a celebratory selfie",
    title: "Shared Testimony",
    subtitle: "Every smile reflects a story of grace and belonging.",
    category: "Celebration",
    objectPosition: "center 20%",
  },
  {
    alt: "A woman ministering with a microphone",
    title: "Voices Of Faith",
    subtitle: "Spaces where every gift can serve God's purpose.",
    category: "Teaching",
    objectPosition: "center 16%",
  },
];

const activityImageModules = import.meta.glob(
  "../../assets/activities/*.{avif,jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const archiveDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const archiveTimeFormatter = new Intl.DateTimeFormat("en-US", {
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

function parseCapturedAt(fileName: string) {
  const match = fileName.match(
    /(\d{4})-(\d{2})-(\d{2}) at (\d{1,2})\.(\d{2})\.(\d{2}) (AM|PM)/i,
  );

  if (!match) {
    return new Date(0);
  }

  const [, year, month, day, hourText, minute, second, meridiem] = match;
  let hour = Number(hourText);

  if (meridiem.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hour,
    Number(minute),
    Number(second),
  );
}

const sortedActivityEntries = Object.entries(activityImageModules)
  .map(([path, src]) => {
    const fileName = path.split("/").at(-1) ?? path;

    return {
      fileName,
      src,
      capturedAt: parseCapturedAt(fileName),
    };
  })
  .sort((left, right) => {
    const difference = right.capturedAt.getTime() - left.capturedAt.getTime();

    if (difference !== 0) {
      return difference;
    }

    return right.fileName.localeCompare(left.fileName);
  });

export const activityGallery: ActivityPhoto[] = sortedActivityEntries.map(
  ({ fileName, src, capturedAt }, index) => {
    const template = photoTemplates[index % photoTemplates.length];
    const slug = slugify(`${template.title}-${fileName.replace(/\.[^.]+$/, "")}`);
    const extension = fileName.split(".").at(-1)?.toLowerCase() ?? "jpg";

    return {
      id: slug,
      src,
      fileName,
      capturedAt,
      dateKey: getDateKey(capturedAt),
      dateLabel: archiveDateFormatter.format(capturedAt),
      timeLabel: archiveTimeFormatter.format(capturedAt),
      downloadName: `${slug}.${extension}`,
      ...template,
    };
  },
);

export const recentActivityGalleryLimit = 6;
export const recentActivityGallery = activityGallery.slice(
  0,
  recentActivityGalleryLimit,
);
export const archivedActivityGallery = activityGallery.slice(
  recentActivityGalleryLimit,
);

export const activityCategories = [
  "All",
  ...new Set(activityGallery.map((photo) => photo.category)),
] as const;

export type ActivityCategoryFilter = (typeof activityCategories)[number];
