"use client";

import { useMemo, useState } from "react";
import { GenreTabs } from "@/components/GenreTabs";
import { NewsCard } from "@/components/NewsCard";
import { RefreshButton } from "@/components/RefreshButton";
import type { Genre, NewsItem } from "@/lib/types";

interface HomeClientProps {
  genres: Genre[];
  items: NewsItem[];
}

function getDateKey(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function formatShortDateLabel(dateKey: string): string {
  const today = getDateKey(new Date().toISOString());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateKey === today) {
    return "今日";
  }

  if (dateKey === getDateKey(yesterday.toISOString())) {
    return "昨日";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${dateKey}T00:00:00`));
}

export function HomeClient({ genres, items }: HomeClientProps) {
  const [selectedDate, setSelectedDate] = useState(() =>
    items[0] ? getDateKey(items[0].postedAt) : getDateKey(new Date().toISOString()),
  );
  const [activeGenre, setActiveGenre] = useState("all");

  const availableDates = useMemo(() => {
    return [...new Set(items.map((item) => getDateKey(item.postedAt)))];
  }, [items]);

  const selectedDateItems = useMemo(() => {
    return items.filter((item) => getDateKey(item.postedAt) === selectedDate);
  }, [items, selectedDate]);

  const counts = useMemo(() => {
    return selectedDateItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.genreId] = (acc[item.genreId] ?? 0) + 1;
      return acc;
    }, {});
  }, [selectedDateItems]);

  const filteredItems = useMemo(() => {
    if (activeGenre === "all") {
      return selectedDateItems;
    }

    return selectedDateItems.filter((item) => item.genreId === activeGenre);
  }, [activeGenre, selectedDateItems]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              My News
            </p>
            <h1 className="text-2xl font-bold text-zinc-900">今日のマイニュース</h1>
            <p className="text-sm text-zinc-500">{formatDateLabel(selectedDate)}</p>
          </div>
          <RefreshButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {availableDates.length > 0 ? (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {availableDates.map((dateKey) => {
              const isActive = selectedDate === dateKey;
              const count = items.filter(
                (item) => getDateKey(item.postedAt) === dateKey,
              ).length;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setActiveGenre("all");
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {formatShortDateLabel(dateKey)}
                  <span className="ml-2 text-xs opacity-80">{count}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mb-6">
          <GenreTabs
            genres={genres}
            activeGenre={activeGenre}
            counts={counts}
            onChange={setActiveGenre}
          />
        </div>

        {filteredItems.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              この日のニュースはまだありません
            </h2>
            <p className="mb-4 text-sm leading-6 text-zinc-600">
              右上の「今すぐ更新」を押すと、登録したアカウントの新着を取得して
              小学生向けの解説付きで表示します。
            </p>
            <p className="text-xs text-zinc-500">
              アカウントの追加・変更は <code>src/lib/sources.ts</code> を編集してください。
            </p>
          </section>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
