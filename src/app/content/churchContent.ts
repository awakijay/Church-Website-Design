import type { ActivityCategory } from "./activityGallery";
import {
  DEFAULT_THUMBNAIL_POSITION,
  normalizeThumbnailPosition,
} from "../lib/thumbnailPosition";

export type MinistryIconName =
  | "users"
  | "baby"
  | "sparkles"
  | "music"
  | "globe"
  | "book-heart";

export type MinistryItem = {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: MinistryIconName;
};

export type SermonItem = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  series: string;
  summary: string;
  details: string;
  link: string;
  facebookLink: string;
  tiktokLink: string;
  instagramLink: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  details: string;
};

export type QuoteCategory =
  | "Faith"
  | "Prayer"
  | "Love"
  | "Hope"
  | "Teaching";

export type QuoteItem = {
  id: string;
  text: string;
  reference: string;
  category: QuoteCategory;
  details: string;
};

export type GraphicMemeItem = {
  id: string;
  title: string;
  summary: string;
  details: string;
  imageSrc: string;
  thumbnailPositionX: number;
  thumbnailPositionY: number;
};

export type ChurchMomentItem = {
  id: string;
  title: string;
  subtitle: string;
  category: ActivityCategory;
  capturedAt: string;
  imageSrc: string;
  thumbnailPositionX: number;
  thumbnailPositionY: number;
};

export type ChurchContent = {
  ministries: MinistryItem[];
  sermons: SermonItem[];
  events: EventItem[];
  quotes: QuoteItem[];
  graphicMemes: GraphicMemeItem[];
  churchMoments: ChurchMomentItem[];
};

export const DEFAULT_CHURCH_CONTENT: ChurchContent = {
  ministries: [
    {
      id: "adult-ministry",
      icon: "users",
      title: "Adult Ministry",
      description:
        "Bible studies, small groups, and discipleship opportunities for spiritual growth.",
      details:
        "Our Adult Ministry helps men and women grow deeper in the Word, build healthy Christian relationships, and serve with purpose. Through weekly Bible study gatherings, discipleship circles, and prayer-centered fellowship, adults are equipped to follow Jesus faithfully in every season of life.",
    },
    {
      id: "childrens-ministry",
      icon: "baby",
      title: "Children's Ministry",
      description:
        "Engaging programs teaching children about God's love in age-appropriate ways.",
      details:
        "Children in our church are nurtured in a safe, joyful, and Bible-rich environment. Each session is designed to help them understand God's love, learn foundational truths from Scripture, and build a faith that grows with them at every stage.",
    },
    {
      id: "youth-ministry",
      icon: "sparkles",
      title: "Youth Ministry",
      description:
        "Dynamic gatherings helping teens build authentic faith and lasting friendships.",
      details:
        "Our Youth Ministry creates space for teenagers to ask real questions, encounter God personally, and develop strong Christ-centered friendships. Through teaching, worship, mentoring, and youth-focused events, young people are encouraged to stand boldly for Jesus.",
    },
    {
      id: "worship-ministry",
      icon: "music",
      title: "Worship Ministry",
      description:
        "Leading the congregation in spirit-filled worship and musical excellence.",
      details:
        "The Worship Ministry serves the church by leading sincere, Spirit-led worship that points hearts to Christ. From rehearsals to live services, the team is committed to excellence, unity, and creating an atmosphere where the congregation can respond to God in praise.",
    },
    {
      id: "missions",
      icon: "globe",
      title: "Missions",
      description:
        "Local and global outreach sharing the Gospel and serving those in need.",
      details:
        "Our Missions Ministry reaches beyond the church walls to share the Gospel and serve communities with compassion. Whether through evangelism, practical care, or support for outreach initiatives, this ministry carries the heart of Christ into the world.",
    },
    {
      id: "care-ministry",
      icon: "book-heart",
      title: "Care Ministry",
      description:
        "Supporting our church family through prayer, counseling, and practical help.",
      details:
        "The Care Ministry exists to walk with people through life's joyful and difficult moments. Through prayer, pastoral support, encouragement, and practical assistance, this ministry helps ensure that no one in the church family has to carry burdens alone.",
    },
  ],
  sermons: [
    {
      id: "walking-in-faith",
      title: "Walking in Faith",
      speaker: "Pastor Michael Johnson",
      date: "April 6, 2026",
      series: "Living by Faith",
      summary: "Learning to trust God fully when the path ahead is not yet clear.",
      details:
        "This message explores what it means to walk by faith in daily life. Pastor Michael Johnson teaches on trusting God's promises, obeying even when outcomes are uncertain, and remaining steadfast through seasons that test conviction and character.",
      link: "",
      facebookLink: "",
      tiktokLink: "",
      instagramLink: "",
    },
    {
      id: "power-of-prayer",
      title: "The Power of Prayer",
      speaker: "Pastor Sarah Williams",
      date: "March 30, 2026",
      series: "Spiritual Disciplines",
      summary: "A call to deeper intimacy with God through consistent, expectant prayer.",
      details:
        "Pastor Sarah Williams reminds the church that prayer is more than a routine; it is a living conversation with God. This sermon emphasizes dependence on the Holy Spirit, persistence in prayer, and the transforming power of seeking God together.",
      link: "",
      facebookLink: "",
      tiktokLink: "",
      instagramLink: "",
    },
    {
      id: "love-one-another",
      title: "Love One Another",
      speaker: "Pastor Michael Johnson",
      date: "March 23, 2026",
      series: "The Heart of the Gospel",
      summary: "How Christlike love shapes the witness and unity of the church.",
      details:
        "In this sermon, the church is challenged to practice sacrificial love in tangible ways. Pastor Michael Johnson highlights forgiveness, humility, service, and unity as visible expressions of the Gospel in the life of every believer.",
      link: "",
      facebookLink: "",
      tiktokLink: "",
      instagramLink: "",
    },
  ],
  events: [
    {
      id: "easter-celebration-service",
      title: "Easter Celebration Service",
      date: "April 20, 2026",
      time: "9:00 AM & 11:00 AM",
      location: "Main Sanctuary",
      description:
        "Join us for a special Easter service celebrating the resurrection of Jesus Christ.",
      details:
        "Celebrate the risen Savior with us in a joyful service filled with worship, Scripture, prayer, and a hope-filled message. Invite your family and friends as we gather to proclaim the victory of Jesus Christ over sin and death.",
    },
    {
      id: "community-prayer-night",
      title: "Community Prayer Night",
      date: "April 15, 2026",
      time: "7:00 PM",
      location: "Prayer Room",
      description:
        "Gather together for an evening of worship, prayer, and seeking God's presence.",
      details:
        "Community Prayer Night is a focused time of intercession for families, the church, and the wider community. Expect heartfelt worship, guided prayer moments, and room to seek the Lord together with faith and unity.",
    },
    {
      id: "youth-spring-retreat",
      title: "Youth Spring Retreat",
      date: "April 25-27, 2026",
      time: "All Weekend",
      location: "Mountain View Camp",
      description:
        "Three days of fun, fellowship, and spiritual growth for middle and high school students.",
      details:
        "This retreat is designed to help students disconnect from distraction and draw closer to God. With worship sessions, Bible teaching, games, group discussions, and mentoring, the weekend creates space for real transformation and connection.",
    },
    {
      id: "womens-bible-study",
      title: "Women's Bible Study",
      date: "Every Wednesday",
      time: "10:00 AM",
      location: "Fellowship Hall",
      description: "Weekly study and fellowship for women of all ages.",
      details:
        "Women of all ages are invited to grow together through Scripture, prayer, and encouraging conversation. This weekly gathering creates space for deeper faith, mutual support, and practical application of God's Word.",
    },
  ],
  quotes: [
    {
      id: "quote-walk-by-faith",
      text:
        "Faith grows strongest when we keep obeying God even before the whole path becomes clear.",
      reference: "Recent Teaching Reflection",
      category: "Faith",
      details:
        "This reflection encourages believers to stay responsive to God's leading even when the next step requires trust. It works well as a caption, church graphic copy, or a short meditation point after a faith-centered message.",
    },
    {
      id: "quote-prayer-conversation",
      text:
        "Prayer is not a ritual to finish but a living conversation that keeps the heart close to God.",
      reference: "Prayer Emphasis",
      category: "Prayer",
      details:
        "Use this quote to invite the church into deeper personal devotion and corporate prayer. It reinforces the idea that prayer is relational, ongoing, and central to spiritual growth.",
    },
    {
      id: "quote-love-visible",
      text:
        "A healthy church is built when love is visible in service, humility, and forgiveness.",
      reference: "Church Life Reminder",
      category: "Love",
      details:
        "This line is designed for moments when the church wants to highlight unity, hospitality, and Christlike relationships. It pairs naturally with service updates, volunteer appreciation, or community-life campaigns.",
    },
    {
      id: "quote-hope-anchor",
      text:
        "Hope in Christ gives steady courage for today and bright confidence for tomorrow.",
      reference: "Sunday Encouragement",
      category: "Hope",
      details:
        "This is a warm, all-purpose encouragement quote for visitors and members alike. It is especially useful for sermon recaps, weekly social posts, and follow-up communication after worship gatherings.",
    },
  ],
  graphicMemes: [
    {
      id: "graphic-walking-in-faith",
      title: "Walking In Faith Graphic",
      summary: "A shareable design spotlighting this week's message and spiritual encouragement.",
      details:
        "Use this graphic for sermon promotion, WhatsApp sharing, and social posts that call people to trust God wholeheartedly. When uploaded, visitors can open it in a lightbox and read the supporting context directly on the site.",
      imageSrc: "",
      thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
      thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
    },
    {
      id: "graphic-power-of-prayer",
      title: "Prayer Focus Graphic",
      summary: "A visual reminder that keeps the church centered on prayer and dependence on God.",
      details:
        "This graphic works well for prayer meetings, weekly encouragement, and devotional reminders. Add a clean image and supporting note so members instantly understand the heart behind the design.",
      imageSrc: "",
      thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
      thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
    },
    {
      id: "graphic-love-one-another",
      title: "Church Love Campaign Graphic",
      summary: "A church-life visual built for sharing messages of unity, compassion, and service.",
      details:
        "This item can support ministry announcements, volunteer appreciation, and community-building moments. The popup detail area is ideal for a short explanation, campaign note, or sharing prompt.",
      imageSrc: "",
      thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
      thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
    },
  ],
  churchMoments: [],
};

export function normalizeMinistry(item: Partial<MinistryItem>, fallback?: MinistryItem): MinistryItem {
  return {
    id: item.id ?? fallback?.id ?? "ministry",
    title: item.title ?? fallback?.title ?? "New Ministry",
    description:
      item.description ?? fallback?.description ?? "Add a short ministry summary.",
    details:
      item.details ??
      fallback?.details ??
      item.description ??
      "Add full ministry details for the website.",
    icon: item.icon ?? fallback?.icon ?? "users",
  };
}

export function normalizeSermon(item: Partial<SermonItem>, fallback?: SermonItem): SermonItem {
  return {
    id: item.id ?? fallback?.id ?? "sermon",
    title: item.title ?? fallback?.title ?? "New Sermon",
    speaker: item.speaker ?? fallback?.speaker ?? "Pastor Name",
    date: item.date ?? fallback?.date ?? "Month Day, Year",
    series: item.series ?? fallback?.series ?? "Series Name",
    summary: item.summary ?? fallback?.summary ?? "Add a short sermon summary.",
    details:
      item.details ??
      fallback?.details ??
      item.summary ??
      "Add full sermon notes or details for the website.",
    link: item.link ?? fallback?.link ?? "",
    facebookLink: item.facebookLink ?? fallback?.facebookLink ?? "",
    tiktokLink: item.tiktokLink ?? fallback?.tiktokLink ?? "",
    instagramLink: item.instagramLink ?? fallback?.instagramLink ?? "",
  };
}

export function normalizeEvent(item: Partial<EventItem>, fallback?: EventItem): EventItem {
  return {
    id: item.id ?? fallback?.id ?? "event",
    title: item.title ?? fallback?.title ?? "New Event",
    date: item.date ?? fallback?.date ?? "Month Day, Year",
    time: item.time ?? fallback?.time ?? "Time",
    location: item.location ?? fallback?.location ?? "Location",
    description:
      item.description ?? fallback?.description ?? "Add a short event summary.",
    details:
      item.details ??
      fallback?.details ??
      item.description ??
      "Add full event details for the website.",
  };
}

export function normalizeQuote(item: Partial<QuoteItem>, fallback?: QuoteItem): QuoteItem {
  return {
    id: item.id ?? fallback?.id ?? "quote",
    text: item.text ?? fallback?.text ?? "Add an inspirational quote for the website.",
    reference: item.reference ?? fallback?.reference ?? "Quote Reference",
    category: item.category ?? fallback?.category ?? "Faith",
    details:
      item.details ??
      fallback?.details ??
      "Add the fuller reflection, context, or sharing note visitors should see when they open this quote.",
  };
}

export function normalizeGraphicMeme(
  item: Partial<GraphicMemeItem>,
  fallback?: GraphicMemeItem,
): GraphicMemeItem {
  return {
    id: item.id ?? fallback?.id ?? "graphic-meme",
    title: item.title ?? fallback?.title ?? "Graphic Title",
    summary:
      item.summary ??
      fallback?.summary ??
      "Add a short summary that introduces this design on the website.",
    details:
      item.details ??
      fallback?.details ??
      "Add supporting details visitors should see when they open this graphic.",
    imageSrc: item.imageSrc ?? fallback?.imageSrc ?? "",
    thumbnailPositionX: normalizeThumbnailPosition(
      item.thumbnailPositionX,
      fallback?.thumbnailPositionX ?? DEFAULT_THUMBNAIL_POSITION,
    ),
    thumbnailPositionY: normalizeThumbnailPosition(
      item.thumbnailPositionY,
      fallback?.thumbnailPositionY ?? DEFAULT_THUMBNAIL_POSITION,
    ),
  };
}

export function normalizeChurchMoment(
  item: Partial<ChurchMomentItem>,
  fallback?: ChurchMomentItem,
): ChurchMomentItem {
  return {
    id: item.id ?? fallback?.id ?? "church-moment",
    title: item.title ?? fallback?.title ?? "Church Moment",
    subtitle:
      item.subtitle ??
      fallback?.subtitle ??
      "Add a short caption describing this church moment.",
    category: item.category ?? fallback?.category ?? "Fellowship",
    capturedAt: item.capturedAt ?? fallback?.capturedAt ?? "",
    imageSrc: item.imageSrc ?? fallback?.imageSrc ?? "",
    thumbnailPositionX: normalizeThumbnailPosition(
      item.thumbnailPositionX,
      fallback?.thumbnailPositionX ?? DEFAULT_THUMBNAIL_POSITION,
    ),
    thumbnailPositionY: normalizeThumbnailPosition(
      item.thumbnailPositionY,
      fallback?.thumbnailPositionY ?? DEFAULT_THUMBNAIL_POSITION,
    ),
  };
}

export const MINISTRY_ICON_OPTIONS: Array<{
  label: string;
  value: MinistryIconName;
}> = [
  { label: "Users", value: "users" },
  { label: "Baby", value: "baby" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Music", value: "music" },
  { label: "Globe", value: "globe" },
  { label: "Book Heart", value: "book-heart" },
];

export const QUOTE_CATEGORY_OPTIONS: QuoteCategory[] = [
  "Faith",
  "Prayer",
  "Love",
  "Hope",
  "Teaching",
];
