"use client";

import type { Genre } from "@/lib/types";

interface GenreTabsProps {
  genres: Genre[];
  activeGenre: string;
  counts: Record<string, number>;
  onChange: (genreId: string) => void;
}

export function GenreTabs({
  genres,
  activeGenre,
  counts,
  onChange,
}: GenreTabsProps) {
  const tabs = [{ id: "all", name: "すべて" }, ...genres];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((genre) => {
        const count =
          genre.id === "all"
            ? Object.values(counts).reduce((sum, value) => sum + value, 0)
            : (counts[genre.id] ?? 0);
        const isActive = activeGenre === genre.id;

        return (
          <button
            key={genre.id}
            type="button"
            onClick={() => onChange(genre.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {genre.name}
            <span className="ml-2 text-xs opacity-80">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
