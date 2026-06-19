"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/relativeTime";

interface LastUpdatedLabelProps {
  lastUpdatedAt: string | null;
}

export function LastUpdatedLabel({ lastUpdatedAt }: LastUpdatedLabelProps) {
  const [label, setLabel] = useState(() =>
    lastUpdatedAt ? formatRelativeTime(lastUpdatedAt) : null,
  );

  useEffect(() => {
    if (!lastUpdatedAt) {
      setLabel(null);
      return;
    }

    const updatedAt = lastUpdatedAt;

    function updateLabel() {
      setLabel(formatRelativeTime(updatedAt));
    }

    updateLabel();
    const intervalId = window.setInterval(updateLabel, 30_000);

    return () => window.clearInterval(intervalId);
  }, [lastUpdatedAt]);

  if (!lastUpdatedAt || !label) {
    return (
      <p className="text-xs text-zinc-400">まだ更新されていません</p>
    );
  }

  return (
    <p className="text-xs text-zinc-500">
      最終更新: <span className="font-medium text-zinc-600">{label}</span>
    </p>
  );
}
