import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChurchMomentItem,
  ChurchContent,
  DEFAULT_CHURCH_CONTENT,
  EventItem,
  GraphicMemeItem,
  MinistryItem,
  normalizeChurchMoment,
  normalizeEvent,
  normalizeGraphicMeme,
  normalizeMinistry,
  normalizeQuote,
  normalizeSermon,
  QuoteItem,
  SermonItem,
} from "./churchContent";

const STORAGE_KEY = "ihnbc-admin-content";
const DATABASE_NAME = "ihnbc-church-content";
const DATABASE_VERSION = 1;
const STORE_NAME = "content";
const CONTENT_RECORD_KEY = "current";

type ChurchContentContextValue = {
  content: ChurchContent;
  setMinistries: (ministries: MinistryItem[]) => void;
  setSermons: (sermons: SermonItem[]) => void;
  setEvents: (events: EventItem[]) => void;
  setQuotes: (quotes: QuoteItem[]) => void;
  setGraphicMemes: (graphicMemes: GraphicMemeItem[]) => void;
  setChurchMoments: (churchMoments: ChurchMomentItem[]) => void;
  resetContent: () => void;
};

const ChurchContentContext = createContext<
  ChurchContentContextValue | undefined
>(undefined);

function normalizeStoredContent(parsed: Partial<ChurchContent>): ChurchContent {
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
    quotes:
      parsed.quotes?.map((item, index) =>
        normalizeQuote(item, DEFAULT_CHURCH_CONTENT.quotes[index]),
      ) ?? DEFAULT_CHURCH_CONTENT.quotes,
    graphicMemes:
      parsed.graphicMemes?.map((item, index) =>
        normalizeGraphicMeme(item, DEFAULT_CHURCH_CONTENT.graphicMemes[index]),
      ) ?? DEFAULT_CHURCH_CONTENT.graphicMemes,
    churchMoments:
      parsed.churchMoments?.map((item, index) =>
        normalizeChurchMoment(item, DEFAULT_CHURCH_CONTENT.churchMoments[index]),
      ) ?? DEFAULT_CHURCH_CONTENT.churchMoments,
  };
}

function createLocalStorageSnapshot(content: ChurchContent): ChurchContent {
  return {
    ...content,
    // Keep heavy image payloads in IndexedDB to avoid localStorage quota failures.
    graphicMemes: content.graphicMemes.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      details: item.details,
      imageSrc: "",
      thumbnailPositionX: item.thumbnailPositionX,
      thumbnailPositionY: item.thumbnailPositionY,
    })),
    churchMoments: content.churchMoments.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      capturedAt: item.capturedAt,
      imageSrc: "",
      thumbnailPositionX: item.thumbnailPositionX,
      thumbnailPositionY: item.thumbnailPositionY,
    })),
  };
}

function openChurchContentDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Unable to open content database."));
  });
}

async function loadIndexedDbContent() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return null;
  }

  const database = await openChurchContentDatabase();

  return new Promise<ChurchContent | null>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(CONTENT_RECORD_KEY);

    request.onsuccess = () => {
      const result = request.result;

      if (!result || typeof result !== "object") {
        resolve(null);
        return;
      }

      resolve(normalizeStoredContent(result as Partial<ChurchContent>));
    };

    request.onerror = () =>
      reject(request.error ?? new Error("Unable to load saved content."));

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
    transaction.onabort = () => database.close();
  });
}

async function saveIndexedDbContent(content: ChurchContent) {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return;
  }

  const database = await openChurchContentDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(content, CONTENT_RECORD_KEY);

    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(request.error ?? new Error("Unable to save content."));

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
    transaction.onabort = () => database.close();
  });
}

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

    return normalizeStoredContent(parsed);
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
  const [hasHydratedStorage, setHasHydratedStorage] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    void loadIndexedDbContent()
      .then((storedContent) => {
        if (isCancelled) {
          return;
        }

        if (storedContent) {
          setContent(storedContent);
        }

        setHasHydratedStorage(true);
      })
      .catch((error) => {
        console.warn("Unable to load church content from IndexedDB.", error);

        if (!isCancelled) {
          setHasHydratedStorage(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(createLocalStorageSnapshot(content)),
      );
    } catch (error) {
      console.warn("Unable to save church content to local storage.", error);
    }

    void saveIndexedDbContent(content).catch((error) => {
      console.warn("Unable to save church content to IndexedDB.", error);
    });
  }, [content, hasHydratedStorage]);

  const value = useMemo(
    () => ({
      content,
      setMinistries: (ministries: MinistryItem[]) =>
        setContent((current) => ({ ...current, ministries })),
      setSermons: (sermons: SermonItem[]) =>
        setContent((current) => ({ ...current, sermons })),
      setEvents: (events: EventItem[]) =>
        setContent((current) => ({ ...current, events })),
      setQuotes: (quotes: QuoteItem[]) =>
        setContent((current) => ({ ...current, quotes })),
      setGraphicMemes: (graphicMemes: GraphicMemeItem[]) =>
        setContent((current) => ({ ...current, graphicMemes })),
      setChurchMoments: (churchMoments: ChurchMomentItem[]) =>
        setContent((current) => ({ ...current, churchMoments })),
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
