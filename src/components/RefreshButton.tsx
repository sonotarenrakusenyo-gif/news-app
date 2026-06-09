"use client";

import { useState } from "react";

export function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRefresh() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/fetch", { method: "POST" });
      const data = (await response.json()) as {
        totalNew?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "更新に失敗しました");
      }

      setMessage(`新しいニュースを ${data.totalNew ?? 0} 件追加しました`);
      window.setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "更新に失敗しました",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleRefresh}
        disabled={loading}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "取得中..." : "今すぐ更新"}
      </button>
      {message ? <p className="text-xs text-zinc-500">{message}</p> : null}
    </div>
  );
}
