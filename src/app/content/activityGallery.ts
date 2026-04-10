import photo01 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.19 AM.jpeg";
import photo02 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.21 AM.jpeg";
import photo03 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.23 AM.jpeg";
import photo04 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.25 AM.jpeg";
import photo05 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.26 AM.jpeg";
import photo06 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.28 AM.jpeg";
import photo07 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.31 AM.jpeg";
import photo08 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.34 AM.jpeg";
import photo09 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.35 AM.jpeg";
import photo10 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.42 AM.jpeg";
import photo11 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.43 AM.jpeg";
import photo12 from "../../assets/activities/WhatsApp Image 2026-04-10 at 10.31.44 AM.jpeg";

type ActivityPhoto = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  objectPosition?: string;
};

const photoMeta: Array<Omit<ActivityPhoto, "src">> = [
  {
    alt: "Church family gathered together after service",
    title: "Family Fellowship",
    subtitle: "A joyful church family growing together in love and worship.",
    objectPosition: "center 24%",
  },
  {
    alt: "Young adults and leaders posing after an activity",
    title: "Community Moments",
    subtitle: "Beautiful friendships formed in God's presence.",
    objectPosition: "center 22%",
  },
  {
    alt: "Members and children smiling together in church",
    title: "Generations Together",
    subtitle: "From children to adults, everyone belongs here.",
    objectPosition: "center 20%",
  },
  {
    alt: "A church minister speaking on stage",
    title: "Inspired Teaching",
    subtitle: "Messages that strengthen faith and stir purpose.",
    objectPosition: "center 18%",
  },
  {
    alt: "A speaker ministering during a church gathering",
    title: "Spirit-Led Ministry",
    subtitle: "Moments of truth, prayer, and spiritual encouragement.",
    objectPosition: "center 18%",
  },
  {
    alt: "Men of the church standing together",
    title: "Brotherhood",
    subtitle: "Strong Christian fellowship built on shared faith.",
    objectPosition: "center 22%",
  },
  {
    alt: "Church members posing in the auditorium",
    title: "Serving Together",
    subtitle: "Ordinary moments made meaningful in community.",
    objectPosition: "center 24%",
  },
  {
    alt: "Large church selfie after a lively gathering",
    title: "Joyful Celebrations",
    subtitle: "A vibrant church atmosphere full of warmth and life.",
    objectPosition: "center 18%",
  },
  {
    alt: "Church family photo with children and adults",
    title: "Church Family",
    subtitle: "A welcoming home for individuals, families, and children.",
    objectPosition: "center 20%",
  },
  {
    alt: "Worshippers engaged during a service",
    title: "Heartfelt Worship",
    subtitle: "Lives lifted in prayer, worship, and surrender to God.",
    objectPosition: "center 18%",
  },
  {
    alt: "Another group portrait of the church family",
    title: "Together In Christ",
    subtitle: "A shared journey of growth, grace, and discipleship.",
    objectPosition: "center 22%",
  },
  {
    alt: "Children and adults gathered together in church",
    title: "Raising A Generation",
    subtitle: "Helping children and families flourish in faith.",
    objectPosition: "center 20%",
  },
  {
    alt: "Church members taking a celebratory selfie",
    title: "Shared Testimony",
    subtitle: "Every smile reflects a story of grace and belonging.",
    objectPosition: "center 20%",
  },
  {
    alt: "A woman ministering with a microphone",
    title: "Voices Of Faith",
    subtitle: "Spaces where every gift can serve God's purpose.",
    objectPosition: "center 16%",
  },
];

const curatedChurchPhotos = [
  photo01,
  photo02,
  photo03,
  photo04,
  photo05,
  photo06,
  photo07,
  photo08,
  photo09,
  photo10,
  photo11,
  photo12,
];

export const activityGallery: ActivityPhoto[] = curatedChurchPhotos.map((src, index) => ({
  src,
  ...photoMeta[index % photoMeta.length],
}));
