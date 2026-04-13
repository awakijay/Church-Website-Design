import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import {
  Camera,
  CalendarDays,
  ImageIcon,
  LayoutTemplate,
  Plus,
  Quote,
  RotateCcw,
  Settings2,
  Trash2,
} from "lucide-react";
import { useChurchContent } from "../content/ChurchContentContext";
import {
  ChurchMomentItem,
  EventItem,
  GraphicMemeItem,
  MINISTRY_ICON_OPTIONS,
  MinistryItem,
  QUOTE_CATEGORY_OPTIONS,
  QuoteItem,
  SermonItem,
} from "../content/churchContent";
import { activityCategories } from "../content/activityGallery";
import { ImageThumbnailPositionControl } from "./ImageThumbnailPositionControl";
import { DEFAULT_THUMBNAIL_POSITION } from "../lib/thumbnailPosition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getCurrentDateTimeLocalValue() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 16);
}

function SectionShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Settings2;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#1C2526]/8 bg-white p-4 shadow-[0_22px_60px_rgba(28,37,38,0.08)] sm:p-5 md:rounded-[36px] md:p-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF4E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#FF6B00]">
            <Icon className="h-4 w-4" />
            {eyebrow}
          </div>
          <h2 className="text-3xl text-[#1C2526]">{title}</h2>
          <p className="mt-3 max-w-2xl text-[#1C2526]/65">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#1C2526]/75">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[#1C2526]/50">{hint}</span> : null}
    </label>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-[#1C2526]/12 bg-[#FFFDF8] px-3 py-3 text-sm text-[#1C2526] outline-none transition-colors focus:border-[#FF6B00] sm:px-4 sm:text-base";

const itemTabsClassName = "gap-6 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start";
const itemTabsListClassName =
  "hide-scrollbar h-auto w-full flex-col items-stretch justify-start gap-3 overflow-y-auto rounded-[28px] border border-[#1C2526]/8 bg-[#FFF8E8] p-3 lg:sticky lg:top-4 lg:max-h-[72vh]";
const itemTabsTriggerClassName =
  "h-auto w-full flex-none justify-start rounded-[20px] px-4 py-3 text-left whitespace-normal data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-white data-[state=active]:text-[#1C2526]";
const itemTabsContentClassName = "mt-0 lg:col-start-2 lg:row-start-1";

const churchMomentCategoryOptions = activityCategories.filter(
  (category): category is ChurchMomentItem["category"] => category !== "All",
);

function DashboardStatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-1.5 rounded-[22px] border border-white/10 bg-white/6 px-3 py-3 sm:min-h-[100px] sm:px-4 sm:py-4 xl:px-5">
      <p className="text-[0.45rem] font-medium uppercase leading-[1.2] tracking-[0.06em] text-white/55 sm:text-[0.5rem] sm:tracking-[0.08em] lg:text-[0.56rem] xl:text-[0.62rem]">
        {label}
      </p>
      <p className="break-words text-[1.15rem] leading-none sm:text-[1.35rem] lg:text-[1.55rem] xl:text-[1.8rem]">
        {value}
      </p>
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(imageUrl);
        reject(new Error("Unable to prepare image."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL("image/jpeg", 0.82);
      URL.revokeObjectURL(imageUrl);
      resolve(compressed);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Unable to read image."));
    };

    image.src = imageUrl;
  });
}

export function AdminPanel() {
  const {
    content,
    setMinistries,
    setSermons,
    setEvents,
    setQuotes,
    setGraphicMemes,
    setChurchMoments,
    resetContent,
  } = useChurchContent();
  const [activeMinistryId, setActiveMinistryId] = useState(
    () => content.ministries[0]?.id ?? "",
  );
  const [activeSermonId, setActiveSermonId] = useState(
    () => content.sermons[0]?.id ?? "",
  );
  const [activeEventId, setActiveEventId] = useState(
    () => content.events[0]?.id ?? "",
  );
  const [activeQuoteId, setActiveQuoteId] = useState(
    () => content.quotes[0]?.id ?? "",
  );
  const [activeGraphicMemeId, setActiveGraphicMemeId] = useState(
    () => content.graphicMemes[0]?.id ?? "",
  );
  const [activeChurchMomentId, setActiveChurchMomentId] = useState(
    () => content.churchMoments[0]?.id ?? "",
  );
  const dashboardStats = [
    { label: "Ministries", value: content.ministries.length },
    { label: "Sermons", value: content.sermons.length },
    { label: "Events", value: content.events.length },
    { label: "Quotes", value: content.quotes.length },
    { label: "Graphics", value: content.graphicMemes.length },
    { label: "Moments", value: content.churchMoments.length },
  ];

  useEffect(() => {
    if (!content.ministries.some((item) => item.id === activeMinistryId)) {
      setActiveMinistryId(content.ministries[0]?.id ?? "");
    }
  }, [activeMinistryId, content.ministries]);

  useEffect(() => {
    if (!content.sermons.some((item) => item.id === activeSermonId)) {
      setActiveSermonId(content.sermons[0]?.id ?? "");
    }
  }, [activeSermonId, content.sermons]);

  useEffect(() => {
    if (!content.events.some((item) => item.id === activeEventId)) {
      setActiveEventId(content.events[0]?.id ?? "");
    }
  }, [activeEventId, content.events]);

  useEffect(() => {
    if (!content.quotes.some((item) => item.id === activeQuoteId)) {
      setActiveQuoteId(content.quotes[0]?.id ?? "");
    }
  }, [activeQuoteId, content.quotes]);

  useEffect(() => {
    if (!content.graphicMemes.some((item) => item.id === activeGraphicMemeId)) {
      setActiveGraphicMemeId(content.graphicMemes[0]?.id ?? "");
    }
  }, [activeGraphicMemeId, content.graphicMemes]);

  useEffect(() => {
    if (!content.churchMoments.some((item) => item.id === activeChurchMomentId)) {
      setActiveChurchMomentId(content.churchMoments[0]?.id ?? "");
    }
  }, [activeChurchMomentId, content.churchMoments]);

  const updateMinistry =
    (id: string, field: keyof MinistryItem) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setMinistries(
        content.ministries.map((item) =>
          item.id === id ? { ...item, [field]: event.target.value } : item,
        ),
      );
    };

  const updateSermon =
    (id: string, field: keyof SermonItem) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSermons(
        content.sermons.map((item) =>
          item.id === id ? { ...item, [field]: event.target.value } : item,
        ),
      );
    };

  const updateEvent =
    (id: string, field: keyof EventItem) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEvents(
        content.events.map((item) =>
          item.id === id ? { ...item, [field]: event.target.value } : item,
        ),
      );
    };

  const updateQuote =
    (id: string, field: keyof QuoteItem) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setQuotes(
        content.quotes.map((item) =>
          item.id === id ? { ...item, [field]: event.target.value } : item,
        ),
      );
    };

  const updateGraphicMeme =
    (id: string, field: keyof GraphicMemeItem) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setGraphicMemes(
        content.graphicMemes.map((item) =>
          item.id === id ? { ...item, [field]: event.target.value } : item,
        ),
      );
    };

  const updateChurchMoment =
    (id: string, field: keyof ChurchMomentItem) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setChurchMoments(
        content.churchMoments.map((item) =>
          item.id === id ? { ...item, [field]: event.target.value } : item,
        ),
      );
    };

  const updateGraphicMemeImage =
    (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const imageSrc = await readFileAsDataUrl(file);

        setGraphicMemes(
          content.graphicMemes.map((item) =>
            item.id === id
              ? {
                  ...item,
                  imageSrc,
                  thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
                  thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
                }
              : item,
          ),
        );
      } finally {
        event.target.value = "";
      }
    };

  const updateChurchMomentImage =
    (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const imageSrc = await readFileAsDataUrl(file);

        setChurchMoments(
          content.churchMoments.map((item) =>
            item.id === id
              ? {
                  ...item,
                  imageSrc,
                  thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
                  thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
                }
              : item,
          ),
        );
      } finally {
        event.target.value = "";
      }
    };

  const updateGraphicMemeThumbnailPosition =
    (id: string) =>
    ({
      thumbnailPositionX,
      thumbnailPositionY,
    }: {
      thumbnailPositionX: number;
      thumbnailPositionY: number;
    }) => {
      setGraphicMemes(
        content.graphicMemes.map((item) =>
          item.id === id
            ? {
                ...item,
                thumbnailPositionX,
                thumbnailPositionY,
              }
            : item,
        ),
      );
    };

  const updateChurchMomentThumbnailPosition =
    (id: string) =>
    ({
      thumbnailPositionX,
      thumbnailPositionY,
    }: {
      thumbnailPositionX: number;
      thumbnailPositionY: number;
    }) => {
      setChurchMoments(
        content.churchMoments.map((item) =>
          item.id === id
            ? {
                ...item,
                thumbnailPositionX,
                thumbnailPositionY,
              }
            : item,
        ),
      );
    };

  return (
    <main className="px-3 pb-12 pt-6 sm:px-4 md:pb-20 md:pt-8 lg:px-5">
      <div className="mx-auto max-w-7xl space-y-8 md:space-y-10">
        <section className="rounded-[28px] bg-[#1C2526] p-4 text-white shadow-[0_28px_80px_rgba(28,37,38,0.28)] sm:p-5 md:rounded-[36px] md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD7BA]">
                <Settings2 className="h-4 w-4" />
                Content Control Center
              </div>
              <h2 className="text-3xl md:text-4xl">
                Manage short previews and full website details from one place.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/72">
                Each item now supports a shorter website preview and a longer
                detail section that visitors can open from the public site.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:w-auto xl:grid-cols-3 2xl:grid-cols-6">
              {dashboardStats.map((stat) => (
                <DashboardStatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetContent}
              className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/8 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00] sm:px-6 sm:py-3"
            >
              <RotateCcw className="h-4 w-4" />
              Reset To Defaults
            </button>
            <p className="text-sm text-white/60">
              Changes save automatically in this browser.
            </p>
          </div>
        </section>

        <Tabs defaultValue="ministries" className="gap-6">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-[24px] border border-[#1C2526]/8 bg-white p-2.5 shadow-[0_18px_50px_rgba(28,37,38,0.08)] sm:gap-3 sm:rounded-[30px] sm:p-3">
            <TabsTrigger
              value="ministries"
              className="h-auto min-w-[140px] flex-none rounded-[18px] px-4 py-2.5 text-sm data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526] sm:min-w-[170px] sm:rounded-[20px] sm:px-5 sm:py-3"
            >
              <LayoutTemplate className="h-4 w-4" />
              Ministries
            </TabsTrigger>
            <TabsTrigger
              value="sermons"
              className="h-auto min-w-[170px] flex-none rounded-[20px] px-5 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526]"
            >
              <Settings2 className="h-4 w-4" />
              Sermons
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="h-auto min-w-[170px] flex-none rounded-[20px] px-5 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526]"
            >
              <CalendarDays className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="quotes"
              className="h-auto min-w-[170px] flex-none rounded-[20px] px-5 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526]"
            >
              <Quote className="h-4 w-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger
              value="graphics"
              className="h-auto min-w-[170px] flex-none rounded-[20px] px-5 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526]"
            >
              <ImageIcon className="h-4 w-4" />
              Graphics
            </TabsTrigger>
            <TabsTrigger
              value="moments"
              className="h-auto min-w-[170px] flex-none rounded-[20px] px-5 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526]"
            >
              <Camera className="h-4 w-4" />
              Church Moments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ministries">
            <SectionShell
              eyebrow="Ministry Editor"
              title="Ministries"
              description="Edit the short card content visitors see first, then use the full details field for the longer story they can open on the website."
              icon={LayoutTemplate}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    {
                      const newMinistry = {
                        id: createId("ministry"),
                        title: "New Ministry",
                        description: "Add a short ministry summary.",
                        details: "Add full ministry details for the website.",
                        icon: "users",
                      } satisfies MinistryItem;

                      setMinistries([...content.ministries, newMinistry]);
                      setActiveMinistryId(newMinistry.id);
                    }
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Ministry
                </button>
              </div>

              <Tabs
                value={activeMinistryId}
                onValueChange={setActiveMinistryId}
                className={itemTabsClassName}
              >
                <TabsList className={itemTabsListClassName}>
                  {content.ministries.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={itemTabsTriggerClassName}
                    >
                      {item.title || `Ministry ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.ministries.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className={itemTabsContentClassName}
                  >
                    <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                      <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl text-[#1C2526]">{item.title}</h3>
                          <p className="mt-2 text-sm text-[#1C2526]/60">
                            This content powers both the ministry preview card and the
                            full detail view on the website.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setMinistries(
                              content.ministries.filter((ministry) => ministry.id !== item.id),
                            )
                          }
                          className="inline-flex items-center gap-2 self-start rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Title">
                          <input
                            value={item.title}
                            onChange={updateMinistry(item.id, "title")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Icon">
                          <select
                            value={item.icon}
                            onChange={updateMinistry(item.id, "icon")}
                            className={inputClassName}
                          >
                            {MINISTRY_ICON_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field
                          label="Card Summary"
                          hint="Shown directly on the ministry card."
                        >
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={updateMinistry(item.id, "description")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Full Ministry Details"
                          hint="Shown when a visitor opens this ministry for more information."
                        >
                          <textarea
                            rows={7}
                            value={item.details}
                            onChange={updateMinistry(item.id, "details")}
                            className={inputClassName}
                          />
                        </Field>
                      </div>
                    </article>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionShell>
          </TabsContent>

          <TabsContent value="sermons">
            <SectionShell
              eyebrow="Sermon Editor"
              title="Sermons"
              description="Manage the in-site sermon player, public card summary, full sermon details, and optional Facebook, TikTok, or Instagram watch links."
              icon={Settings2}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    {
                      const newSermon = {
                        id: createId("sermon"),
                        title: "New Sermon",
                        speaker: "Pastor Name",
                        date: "Month Day, Year",
                        series: "Series Name",
                        summary: "Add a short sermon summary.",
                        details: "Add full sermon notes or details for the website.",
                        link: "",
                        facebookLink: "",
                        tiktokLink: "",
                        instagramLink: "",
                      } satisfies SermonItem;

                      setSermons([...content.sermons, newSermon]);
                      setActiveSermonId(newSermon.id);
                    }
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Sermon
                </button>
              </div>

              <Tabs
                value={activeSermonId}
                onValueChange={setActiveSermonId}
                className={itemTabsClassName}
              >
                <TabsList className={itemTabsListClassName}>
                  {content.sermons.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={itemTabsTriggerClassName}
                    >
                      {item.title || `Sermon ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.sermons.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className={itemTabsContentClassName}
                  >
                    <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                      <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl text-[#1C2526]">{item.title}</h3>
                          <p className="mt-2 text-sm text-[#1C2526]/60">
                            Visitors can open this sermon on the website, watch the video in-site when supported, and still use the extra platform links you add here.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSermons(content.sermons.filter((sermon) => sermon.id !== item.id))
                          }
                          className="inline-flex items-center gap-2 self-start rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Title">
                          <input
                            value={item.title}
                            onChange={updateSermon(item.id, "title")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Speaker">
                          <input
                            value={item.speaker}
                            onChange={updateSermon(item.id, "speaker")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Date">
                          <input
                            value={item.date}
                            onChange={updateSermon(item.id, "date")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Series">
                          <input
                            value={item.series}
                            onChange={updateSermon(item.id, "series")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Primary Video Link"
                          hint="Paste the main sermon video URL. This will be embedded on the website when the link is supported."
                        >
                          <input
                            value={item.link}
                            onChange={updateSermon(item.id, "link")}
                            className={inputClassName}
                            placeholder="https://youtube.com/..."
                          />
                        </Field>
                        <Field
                          label="Facebook Video Link"
                          hint="Optional. Show visitors where to watch this sermon on Facebook too."
                        >
                          <input
                            value={item.facebookLink}
                            onChange={updateSermon(item.id, "facebookLink")}
                            className={inputClassName}
                            placeholder="https://facebook.com/..."
                          />
                        </Field>
                        <Field
                          label="TikTok Video Link"
                          hint="Optional. Show visitors where to watch this sermon on TikTok too."
                        >
                          <input
                            value={item.tiktokLink}
                            onChange={updateSermon(item.id, "tiktokLink")}
                            className={inputClassName}
                            placeholder="https://www.tiktok.com/@.../video/..."
                          />
                        </Field>
                        <Field
                          label="Instagram Video Link"
                          hint="Optional. Add a Reel or Instagram video link so visitors can also watch from Instagram."
                        >
                          <input
                            value={item.instagramLink}
                            onChange={updateSermon(item.id, "instagramLink")}
                            className={inputClassName}
                            placeholder="https://www.instagram.com/reel/..."
                          />
                        </Field>
                        <Field label="Card Summary" hint="Shown on the sermon card.">
                          <textarea
                            rows={3}
                            value={item.summary}
                            onChange={updateSermon(item.id, "summary")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Full Sermon Details"
                          hint="Shown inside the website detail view when visitors open this sermon."
                        >
                          <textarea
                            rows={7}
                            value={item.details}
                            onChange={updateSermon(item.id, "details")}
                            className={inputClassName}
                          />
                        </Field>
                      </div>
                    </article>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionShell>
          </TabsContent>

          <TabsContent value="events">
            <SectionShell
              eyebrow="Event Editor"
              title="Events"
              description="Add short event teasers plus richer detail text so visitors can open each event and see the full information before they register."
              icon={CalendarDays}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    {
                      const newEvent = {
                        id: createId("event"),
                        title: "New Event",
                        date: "Month Day, Year",
                        time: "Time",
                        location: "Location",
                        description: "Add a short event summary.",
                        details: "Add full event details for the website.",
                      } satisfies EventItem;

                      setEvents([...content.events, newEvent]);
                      setActiveEventId(newEvent.id);
                    }
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </button>
              </div>

              <Tabs
                value={activeEventId}
                onValueChange={setActiveEventId}
                className={itemTabsClassName}
              >
                <TabsList className={itemTabsListClassName}>
                  {content.events.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={itemTabsTriggerClassName}
                    >
                      {item.title || `Event ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.events.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className={itemTabsContentClassName}
                  >
                    <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                      <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl text-[#1C2526]">{item.title}</h3>
                          <p className="mt-2 text-sm text-[#1C2526]/60">
                            Visitors can open this event for expanded details before
                            contacting the church to register.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setEvents(content.events.filter((event) => event.id !== item.id))
                          }
                          className="inline-flex items-center gap-2 self-start rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Title">
                          <input
                            value={item.title}
                            onChange={updateEvent(item.id, "title")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Date">
                          <input
                            value={item.date}
                            onChange={updateEvent(item.id, "date")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Time">
                          <input
                            value={item.time}
                            onChange={updateEvent(item.id, "time")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Location">
                          <input
                            value={item.location}
                            onChange={updateEvent(item.id, "location")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Card Summary"
                          hint="Shown in the event list on the website."
                        >
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={updateEvent(item.id, "description")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Full Event Details"
                          hint="Shown in the event detail view when visitors click the event."
                        >
                          <textarea
                            rows={7}
                            value={item.details}
                            onChange={updateEvent(item.id, "details")}
                            className={inputClassName}
                          />
                        </Field>
                      </div>
                    </article>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionShell>
          </TabsContent>

          <TabsContent value="quotes">
            <SectionShell
              eyebrow="Quote Editor"
              title="Quotes"
              description="Add inspirational Scripture reflections, sermon lines, and fuller quote notes so visitors can browse, open, and share them with context."
              icon={Quote}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newQuote = {
                      id: createId("quote"),
                      text: "Add an inspirational quote for the website.",
                      reference: "Quote Reference",
                      category: "Faith",
                      details:
                        "Add the fuller reflection, context, or sharing note visitors should see when they open this quote.",
                    } satisfies QuoteItem;

                    setQuotes([...content.quotes, newQuote]);
                    setActiveQuoteId(newQuote.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Quote
                </button>
              </div>

              <Tabs
                value={activeQuoteId}
                onValueChange={setActiveQuoteId}
                className={itemTabsClassName}
              >
                <TabsList className={itemTabsListClassName}>
                  {content.quotes.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={itemTabsTriggerClassName}
                    >
                      {item.reference || `Quote ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.quotes.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className={itemTabsContentClassName}
                  >
                    <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                      <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl text-[#1C2526]">{item.reference}</h3>
                          <p className="mt-2 text-sm text-[#1C2526]/60">
                            Quotes appear in the public quotes section with category filters, share actions, and a detail popup for the full reflection.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setQuotes(content.quotes.filter((quote) => quote.id !== item.id))
                          }
                          className="inline-flex items-center gap-2 self-start rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Reference">
                          <input
                            value={item.reference}
                            onChange={updateQuote(item.id, "reference")}
                            className={inputClassName}
                            placeholder="John 3:16 or Pastor's Quote"
                          />
                        </Field>
                        <Field label="Category">
                          <select
                            value={item.category}
                            onChange={updateQuote(item.id, "category")}
                            className={inputClassName}
                          >
                            {QUOTE_CATEGORY_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field
                          label="Quote Text"
                          hint="This is the main inspirational or biblical quote visitors will read and share."
                        >
                          <textarea
                            rows={6}
                            value={item.text}
                            onChange={updateQuote(item.id, "text")}
                            className={inputClassName}
                          />
                        </Field>
                        <Field
                          label="Quote Details"
                          hint="Shown when visitors click the quote card to open the full quote popup."
                        >
                          <textarea
                            rows={6}
                            value={item.details}
                            onChange={updateQuote(item.id, "details")}
                            className={inputClassName}
                          />
                        </Field>
                      </div>
                    </article>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionShell>
          </TabsContent>

          <TabsContent value="graphics">
            <SectionShell
              eyebrow="Graphic Meme Editor"
              title="Graphic Memes"
              description="Build production-ready graphic posts with a title, short summary, popup details, and the uploaded image visitors can open in a lightbox."
              icon={ImageIcon}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newGraphic = {
                      id: createId("graphic"),
                      title: "New Graphic",
                      summary: "Add a short summary for this graphic.",
                      details:
                        "Add the fuller context, caption, or sharing guidance visitors should see in the popup.",
                      imageSrc: "",
                      thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
                      thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
                    } satisfies GraphicMemeItem;

                    setGraphicMemes([...content.graphicMemes, newGraphic]);
                    setActiveGraphicMemeId(newGraphic.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Graphic
                </button>
              </div>

              <Tabs
                value={activeGraphicMemeId}
                onValueChange={setActiveGraphicMemeId}
                className={itemTabsClassName}
              >
                <TabsList className={itemTabsListClassName}>
                  {content.graphicMemes.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={itemTabsTriggerClassName}
                    >
                      {item.title || `Graphic ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.graphicMemes.map((item) => (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className={itemTabsContentClassName}
                  >
                    <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                      <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl text-[#1C2526]">
                            {item.title || "Graphic Image"}
                          </h3>
                          <p className="mt-2 text-sm text-[#1C2526]/60">
                            Visitors will see this as a polished graphic card first, then a larger popup with the image and supporting details.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setGraphicMemes(
                              content.graphicMemes.filter((graphic) => graphic.id !== item.id),
                            )
                          }
                          className="inline-flex items-center gap-2 self-start rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-5 lg:grid-cols-2">
                        <Field label="Graphic Title">
                          <input
                            value={item.title}
                            onChange={updateGraphicMeme(item.id, "title")}
                            className={inputClassName}
                            placeholder="Sunday graphic title"
                          />
                        </Field>
                        <Field
                          label="Card Summary"
                          hint="Shown under or over the image card before visitors open the popup."
                        >
                          <textarea
                            rows={3}
                            value={item.summary}
                            onChange={updateGraphicMeme(item.id, "summary")}
                            className={inputClassName}
                          />
                        </Field>
                        <div className="lg:col-span-2">
                          <Field
                            label="Popup Details"
                            hint="Shown inside the graphic lightbox to give the design context, caption, or sharing instructions."
                          >
                            <textarea
                              rows={6}
                              value={item.details}
                              onChange={updateGraphicMeme(item.id, "details")}
                              className={inputClassName}
                            />
                          </Field>
                        </div>
                        <div className="lg:col-span-2">
                          <Field
                            label="Graphic Image"
                            hint="Upload an image from this device to display directly on the website."
                          >
                            <div className="grid gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={updateGraphicMemeImage(item.id)}
                                className={`${inputClassName} file:mr-4 file:rounded-full file:border-0 file:bg-[#FF6B00] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white`}
                              />
                              {item.imageSrc ? (
                                <ImageThumbnailPositionControl
                                  src={item.imageSrc}
                                  alt={`Graphic preview ${item.id}`}
                                  thumbnailPositionX={item.thumbnailPositionX}
                                  thumbnailPositionY={item.thumbnailPositionY}
                                  onChange={updateGraphicMemeThumbnailPosition(item.id)}
                                  previewClassName="aspect-[0.95]"
                                />
                              ) : (
                                <p className="text-sm text-[#1C2526]/55">
                                  No image uploaded yet. Upload one and it will appear in the graphic memes section.
                                </p>
                              )}
                              {item.imageSrc ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setGraphicMemes(
                                      content.graphicMemes.map((graphic) =>
                                        graphic.id === item.id
                                          ? {
                                              ...graphic,
                                              imageSrc: "",
                                              thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
                                              thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
                                            }
                                          : graphic,
                                      ),
                                    )
                                  }
                                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove Uploaded Image
                                </button>
                              ) : null}
                            </div>
                          </Field>
                        </div>
                      </div>
                    </article>
                  </TabsContent>
                ))}
              </Tabs>
            </SectionShell>
          </TabsContent>

          <TabsContent value="moments">
            <SectionShell
              eyebrow="Church Moments Editor"
              title="Church Moments"
              description="Add manual church moment uploads with titles, captions, categories, and capture dates so they appear alongside the existing gallery on the public website."
              icon={Camera}
            >
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const newChurchMoment = {
                      id: createId("church-moment"),
                      title: "New Church Moment",
                      subtitle: "Add a short caption for this church moment.",
                      category: "Fellowship",
                      capturedAt: getCurrentDateTimeLocalValue(),
                      imageSrc: "",
                      thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
                      thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
                    } satisfies ChurchMomentItem;

                    setChurchMoments([...content.churchMoments, newChurchMoment]);
                    setActiveChurchMomentId(newChurchMoment.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Church Moment
                </button>
              </div>

              {content.churchMoments.length > 0 ? (
                <Tabs
                  value={activeChurchMomentId}
                  onValueChange={setActiveChurchMomentId}
                  className={itemTabsClassName}
                >
                  <TabsList className={itemTabsListClassName}>
                    {content.churchMoments.map((item, index) => (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className={itemTabsTriggerClassName}
                      >
                        {item.title || `Church Moment ${index + 1}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {content.churchMoments.map((item) => (
                    <TabsContent
                      key={item.id}
                      value={item.id}
                      className={itemTabsContentClassName}
                    >
                      <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                        <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-2xl text-[#1C2526]">
                              {item.title || "Church Moment"}
                            </h3>
                            <p className="mt-2 text-sm text-[#1C2526]/60">
                              Manual uploads here feed the public Church Moments
                              section together with the existing gallery assets.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setChurchMoments(
                                content.churchMoments.filter((moment) => moment.id !== item.id),
                              )
                            }
                            className="inline-flex items-center gap-2 self-start rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-2">
                          <Field label="Moment Title">
                            <input
                              value={item.title}
                              onChange={updateChurchMoment(item.id, "title")}
                              className={inputClassName}
                              placeholder="Sunday worship moment"
                            />
                          </Field>
                          <Field label="Category">
                            <select
                              value={item.category}
                              onChange={updateChurchMoment(item.id, "category")}
                              className={inputClassName}
                            >
                              {churchMomentCategoryOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field
                            label="Caption"
                            hint="Shown on the church moments card and in the popup."
                          >
                            <textarea
                              rows={4}
                              value={item.subtitle}
                              onChange={updateChurchMoment(item.id, "subtitle")}
                              className={inputClassName}
                            />
                          </Field>
                          <Field
                            label="Capture Date & Time"
                            hint="Used to sort this moment into the archive timeline."
                          >
                            <input
                              type="datetime-local"
                              value={item.capturedAt}
                              onChange={updateChurchMoment(item.id, "capturedAt")}
                              className={inputClassName}
                            />
                          </Field>
                          <div className="lg:col-span-2">
                            <Field
                              label="Moment Image"
                              hint="Upload a photo from this device and it will appear in the public church moments section."
                            >
                              <div className="grid gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={updateChurchMomentImage(item.id)}
                                  className={`${inputClassName} file:mr-4 file:rounded-full file:border-0 file:bg-[#FF6B00] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white`}
                                />
                                {item.imageSrc ? (
                                  <ImageThumbnailPositionControl
                                    src={item.imageSrc}
                                    alt={`Church moment preview ${item.id}`}
                                    thumbnailPositionX={item.thumbnailPositionX}
                                    thumbnailPositionY={item.thumbnailPositionY}
                                    onChange={updateChurchMomentThumbnailPosition(item.id)}
                                    previewClassName="aspect-[1.15]"
                                  />
                                ) : (
                                  <p className="text-sm text-[#1C2526]/55">
                                    No image uploaded yet. Upload one and it will appear in the church moments gallery.
                                  </p>
                                )}
                                {item.imageSrc ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setChurchMoments(
                                        content.churchMoments.map((moment) =>
                                          moment.id === item.id
                                            ? {
                                                ...moment,
                                                imageSrc: "",
                                                thumbnailPositionX: DEFAULT_THUMBNAIL_POSITION,
                                                thumbnailPositionY: DEFAULT_THUMBNAIL_POSITION,
                                              }
                                            : moment,
                                        ),
                                      )
                                    }
                                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1C2526]/10 bg-white px-4 py-2 text-sm text-[#1C2526]/75 transition-colors hover:border-[#B91C1C] hover:text-[#B91C1C]"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Remove Uploaded Image
                                  </button>
                                ) : null}
                              </div>
                            </Field>
                          </div>
                        </div>
                      </article>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="rounded-[28px] border border-dashed border-[#1C2526]/12 bg-[#FFF8E8] px-6 py-10 text-center text-[#1C2526]/62">
                  Add your first church moment to start building the public photo archive from the admin panel.
                </div>
              )}
            </SectionShell>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
