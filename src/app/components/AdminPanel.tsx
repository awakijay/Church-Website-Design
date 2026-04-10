import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import {
  CalendarDays,
  LayoutTemplate,
  Plus,
  RotateCcw,
  Settings2,
  Trash2,
} from "lucide-react";
import { useChurchContent } from "../content/ChurchContentContext";
import {
  EventItem,
  MINISTRY_ICON_OPTIONS,
  MinistryItem,
  SermonItem,
} from "../content/churchContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
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
    <section className="rounded-[36px] border border-[#1C2526]/8 bg-white p-6 shadow-[0_22px_60px_rgba(28,37,38,0.08)] md:p-8">
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
  "w-full rounded-2xl border border-[#1C2526]/12 bg-[#FFFDF8] px-4 py-3 text-[#1C2526] outline-none transition-colors focus:border-[#FF6B00]";

export function AdminPanel() {
  const {
    content,
    setMinistries,
    setSermons,
    setEvents,
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

  return (
    <main className="px-4 pb-16 pt-8 md:pb-24">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[36px] bg-[#1C2526] p-6 text-white shadow-[0_28px_80px_rgba(28,37,38,0.28)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                  Ministries
                </p>
                <p className="mt-2 text-3xl">{content.ministries.length}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                  Sermons
                </p>
                <p className="mt-2 text-3xl">{content.sermons.length}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                  Events
                </p>
                <p className="mt-2 text-3xl">{content.events.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={resetContent}
              className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#FF6B00] hover:bg-[#FF6B00]"
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
          <TabsList className="h-auto w-full flex-wrap justify-start gap-3 rounded-[30px] border border-[#1C2526]/8 bg-white p-3 shadow-[0_18px_50px_rgba(28,37,38,0.08)]">
            <TabsTrigger
              value="ministries"
              className="h-auto min-w-[170px] flex-none rounded-[20px] px-5 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-[#FFF4E8] data-[state=active]:text-[#1C2526]"
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
                className="gap-6"
              >
                <TabsList className="h-auto w-full justify-start gap-3 overflow-x-auto rounded-[28px] border border-[#1C2526]/8 bg-[#FFF8E8] p-3">
                  {content.ministries.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="h-auto min-w-[180px] flex-none rounded-[20px] px-4 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-white data-[state=active]:text-[#1C2526]"
                    >
                      {item.title || `Ministry ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.ministries.map((item) => (
                  <TabsContent key={item.id} value={item.id}>
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
              description="Use the summary for the public card and the full details field for sermon context, notes, or deeper overview."
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
                className="gap-6"
              >
                <TabsList className="h-auto w-full justify-start gap-3 overflow-x-auto rounded-[28px] border border-[#1C2526]/8 bg-[#FFF8E8] p-3">
                  {content.sermons.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="h-auto min-w-[180px] flex-none rounded-[20px] px-4 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-white data-[state=active]:text-[#1C2526]"
                    >
                      {item.title || `Sermon ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.sermons.map((item) => (
                  <TabsContent key={item.id} value={item.id}>
                    <article className="rounded-[30px] border border-[#1C2526]/8 bg-[#FFF8E8] p-6">
                      <div className="mb-5 flex flex-col gap-4 border-b border-[#1C2526]/8 pb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-2xl text-[#1C2526]">{item.title}</h3>
                          <p className="mt-2 text-sm text-[#1C2526]/60">
                            Visitors can click this sermon on the website to open the
                            full summary and supporting details.
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
                className="gap-6"
              >
                <TabsList className="h-auto w-full justify-start gap-3 overflow-x-auto rounded-[28px] border border-[#1C2526]/8 bg-[#FFF8E8] p-3">
                  {content.events.map((item, index) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="h-auto min-w-[180px] flex-none rounded-[20px] px-4 py-3 data-[state=active]:border-[#FF6B00]/15 data-[state=active]:bg-white data-[state=active]:text-[#1C2526]"
                    >
                      {item.title || `Event ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {content.events.map((item) => (
                  <TabsContent key={item.id} value={item.id}>
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
        </Tabs>
      </div>
    </main>
  );
}
