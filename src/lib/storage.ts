import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { head, put } from "@vercel/blob";
import type { NewsItem, NewsStore } from "./types";

const BLOB_PATH = "news-store.json";
const LOCAL_STORE_PATH = path.join(process.cwd(), ".data", "news-store.json");

const emptyStore = (): NewsStore => ({
  items: [],
  lastFetchedAt: {},
});

export async function loadStore(): Promise<NewsStore> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return loadFromBlob();
  }

  return loadFromLocal();
}

export async function saveStore(store: NewsStore): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await saveToBlob(store);
    return;
  }

  await saveToLocal(store);
}

async function loadFromBlob(): Promise<NewsStore> {
  try {
    const blob = await head(BLOB_PATH);
    const response = await fetch(blob.url, { cache: "no-store" });

    if (!response.ok) {
      return emptyStore();
    }

    return (await response.json()) as NewsStore;
  } catch {
    return emptyStore();
  }
}

async function saveToBlob(store: NewsStore): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(store), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function loadFromLocal(): Promise<NewsStore> {
  if (!existsSync(LOCAL_STORE_PATH)) {
    return emptyStore();
  }

  const raw = await readFile(LOCAL_STORE_PATH, "utf8");
  return JSON.parse(raw) as NewsStore;
}

async function saveToLocal(store: NewsStore): Promise<void> {
  const dir = path.dirname(LOCAL_STORE_PATH);
  await mkdir(dir, { recursive: true });
  await writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function sortNewsItems(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
}

export function getLastUpdatedAt(store: NewsStore): string | null {
  if (store.lastUpdatedAt) {
    return store.lastUpdatedAt;
  }

  if (store.items.length === 0) {
    return null;
  }

  return store.items.reduce((latest, item) => {
    return new Date(item.fetchedAt).getTime() > new Date(latest).getTime()
      ? item.fetchedAt
      : latest;
  }, store.items[0].fetchedAt);
}

export function getTodaysItems(items: NewsItem[]): NewsItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items.filter((item) => new Date(item.postedAt) >= today);
}
