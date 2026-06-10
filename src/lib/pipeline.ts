import { fetchUserStatuses } from "./fetcher";
import { summarizeForKids } from "./gemini";
import { getAllAccounts } from "./sources";
import { loadStore, saveStore } from "./storage";
import type { FetchResult, FxTweet, NewsItem } from "./types";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildFallbackSummary(tweet: FxTweet): string {
  const authorName =
    tweet.author?.name ?? tweet.author?.screen_name ?? "このアカウント";

  return `${authorName}さんの投稿は取得できましたが、AI要約は一時的に作れませんでした。少し時間を置いて更新すると、やさしい要点に置き換わります。`;
}

function toNewsItem(
  tweet: FxTweet,
  genreId: string,
  genreName: string,
  handle: string,
  summary: string,
): NewsItem {
  const postedAt = tweet.created_timestamp
    ? new Date(tweet.created_timestamp * 1000).toISOString()
    : new Date(tweet.created_at).toISOString();

  return {
    id: tweet.id,
    genreId,
    genreName,
    handle,
    authorName: tweet.author?.name ?? handle,
    text: tweet.text,
    summary,
    url: tweet.url ?? `https://x.com/${handle}/status/${tweet.id}`,
    postedAt,
    fetchedAt: new Date().toISOString(),
  };
}

export async function runFetchPipeline(): Promise<{
  results: FetchResult[];
  totalNew: number;
}> {
  const store = await loadStore();
  const existingIds = new Set(store.items.map((item) => item.id));
  const accounts = getAllAccounts();
  const results: FetchResult[] = [];
  let totalNew = 0;

  for (const account of accounts) {
    const { handle, genreId, genreName } = account;

    try {
      const since = store.lastFetchedAt[handle];
      const tweets = await fetchUserStatuses(handle, since);
      let newCount = 0;
      let latestTimestamp = since ?? 0;

      for (const tweet of tweets) {
        if (existingIds.has(tweet.id)) {
          continue;
        }

        let summary: string;
        try {
          summary = await summarizeForKids(
            handle,
            tweet.author?.name ?? handle,
            tweet.text,
          );
          await sleep(2500);
        } catch (error) {
          console.error(`Gemini summary failed for ${tweet.id}:`, error);
          summary = buildFallbackSummary(tweet);
        }
        const item = toNewsItem(tweet, genreId, genreName, handle, summary);

        store.items.unshift(item);
        existingIds.add(tweet.id);
        newCount += 1;

        const timestamp =
          tweet.created_timestamp ??
          Math.floor(new Date(tweet.created_at).getTime() / 1000);

        if (timestamp > latestTimestamp) {
          latestTimestamp = timestamp;
        }
      }

      if (latestTimestamp > (store.lastFetchedAt[handle] ?? 0)) {
        store.lastFetchedAt[handle] = latestTimestamp;
      }

      results.push({ handle, genreId, genreName, newItems: newCount });
      totalNew += newCount;
    } catch (error) {
      results.push({
        handle,
        genreId,
        genreName,
        newItems: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  store.items = store.items.slice(0, 500);
  await saveStore(store);

  return { results, totalNew };
}
