import { summarizeForKids } from "./gemini";
import { loadStore, saveStore } from "./storage";

const REPAIR_PATTERNS = [
  "くわしい言葉づかいは、上の元投稿を見て確認してください",
  "この投稿では、次のような内容が伝えられています",
  "AI要約は一時的に作れませんでした",
];

function needsSummaryRepair(summary: string): boolean {
  return REPAIR_PATTERNS.some((pattern) => summary.includes(pattern));
}

export async function repairWeakSummaries(limit = 6): Promise<{
  repaired: number;
  remaining: number;
  checked: number;
}> {
  const store = await loadStore();
  const targets = store.items
    .filter((item) => needsSummaryRepair(item.summary))
    .slice(0, limit);

  let repaired = 0;

  for (const item of targets) {
    try {
      item.summary = await summarizeForKids(
        item.handle,
        item.authorName,
        item.text,
      );
      repaired += 1;
      await saveStore(store);
    } catch (error) {
      console.error(`Summary repair failed for ${item.id}:`, error);
    }
  }

  const remaining = store.items.filter((item) =>
    needsSummaryRepair(item.summary),
  ).length;

  return {
    repaired,
    remaining,
    checked: targets.length,
  };
}
