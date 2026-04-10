import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChurchContent,
  DEFAULT_CHURCH_CONTENT,
  EventItem,
  MinistryItem,
  normalizeEvent,
  normalizeMinistry,
  normalizeSermon,
  SermonItem,
} from "./churchContent";

const STORAGE_KEY = "ihnbc-admin-content";

type ChurchContentContextValue = {
  content: ChurchContent;
  setMinistries: (ministries: MinistryItem[]) => void;
  setSermons: (sermons: SermonItem[]) => void;
  setEvents: (events: EventItem[]) => void;
  resetContent: () => void;
};

const ChurchContentContext = createContext<
  ChurchContentContextValue | undefined
>(undefined);

function loadStoredContent(): ChurchContent {
  if (typeof window === "undefined") {
    return DEFAULT_CHURCH_CONTENT;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return DEFAULT_CHURCH_CONTENT;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ChurchContent>;

    return {
      ministries:
        parsed.ministries?.map((item, index) =>
          normalizeMinistry(item, DEFAULT_CHURCH_CONTENT.ministries[index]),
        ) ?? DEFAULT_CHURCH_CONTENT.ministries,
      sermons:
        parsed.sermons?.map((item, index) =>
          normalizeSermon(item, DEFAULT_CHURCH_CONTENT.sermons[index]),
        ) ?? DEFAULT_CHURCH_CONTENT.sermons,
      events:
        parsed.events?.map((item, index) =>
          normalizeEvent(item, DEFAULT_CHURCH_CONTENT.events[index]),
        ) ?? DEFAULT_CHURCH_CONTENT.events,
    };
  } catch {
    return DEFAULT_CHURCH_CONTENT;
  }
}

export function ChurchContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [content, setContent] = useState<ChurchContent>(loadStoredContent);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setMinistries: (ministries: MinistryItem[]) =>
        setContent((current) => ({ ...current, ministries })),
      setSermons: (sermons: SermonItem[]) =>
        setContent((current) => ({ ...current, sermons })),
      setEvents: (events: EventItem[]) =>
        setContent((current) => ({ ...current, events })),
      resetContent: () => setContent(DEFAULT_CHURCH_CONTENT),
    }),
    [content],
  );

  return (
    <ChurchContentContext.Provider value={value}>
      {children}
    </ChurchContentContext.Provider>
  );
}

export function useChurchContent() {
  const context = useContext(ChurchContentContext);

  if (!context) {
    throw new Error("useChurchContent must be used within ChurchContentProvider");
  }

  return context;
}
