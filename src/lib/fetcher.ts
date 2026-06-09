import type { FxTweet } from "./types";

const USER_AGENT = "MyNewsApp/1.0 (personal news aggregator)";

export async function fetchUserStatuses(
  handle: string,
  since?: number,
): Promise<FxTweet[]> {
  const url = new URL(
    `https://api.fxtwitter.com/2/profile/${handle}/statuses`,
  );
  url.searchParams.set("count", "5");
  if (since) {
    url.searchParams.set("since", String(since));
  }

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });

  if (response.status === 204) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`FxTwitter error for @${handle}: ${response.status}`);
  }

  const data = (await response.json()) as {
    results?: Array<FxTweet | { type?: string; status?: FxTweet }>;
  };

  const results = data.results ?? [];

  return results
    .map((entry) => {
      if ("text" in entry && entry.id) {
        return entry as FxTweet;
      }
      if ("status" in entry && entry.status) {
        return entry.status;
      }
      return null;
    })
    .filter((tweet): tweet is FxTweet => Boolean(tweet?.id && tweet?.text))
    .slice(0, 5);
}
