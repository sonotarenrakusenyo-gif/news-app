import type { NewsItem } from "@/lib/types";

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            @{item.handle}
          </p>
          <p className="text-xs text-zinc-500">{item.authorName}</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          {item.genreName}
        </span>
      </div>

      <div className="mb-4 rounded-xl bg-zinc-50 p-4">
        <p className="mb-2 text-xs font-semibold text-zinc-500">元の投稿</p>
        <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
          {item.text}
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="mb-2 text-xs font-semibold text-blue-700">
          小学生向けの要点
        </p>
        <p className="text-base leading-7 text-zinc-900">{item.summary}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <time dateTime={item.postedAt}>{formatTime(item.postedAt)}</time>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Xで見る →
        </a>
      </div>
    </article>
  );
}
