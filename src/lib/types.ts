export interface Genre {
  id: string;
  name: string;
  accounts: string[];
}

export interface NewsItem {
  id: string;
  genreId: string;
  genreName: string;
  handle: string;
  authorName: string;
  text: string;
  summary: string;
  url: string;
  postedAt: string;
  fetchedAt: string;
}

export interface NewsStore {
  items: NewsItem[];
  lastFetchedAt: Record<string, number>;
}

export interface FxTweet {
  id: string;
  text: string;
  created_at: string;
  created_timestamp?: number;
  url?: string;
  author?: {
    name?: string;
    screen_name?: string;
  };
}

export interface FetchResult {
  handle: string;
  genreId: string;
  genreName: string;
  newItems: number;
  error?: string;
}
