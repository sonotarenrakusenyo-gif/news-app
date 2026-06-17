import type { Genre } from "./types";

/**
 * ジャンルとフォローするXアカウントをここで設定します。
 * accounts には @ なしのユーザー名を入れてください。
 */
export const genres: Genre[] = [
  {
    id: "ai",
    name: "AI",
    accounts: [
      "ymatsuo", // 松尾豊（東京大学・AI研究者）
      "masahirochaen", // チャエン（デジライズ CEO）
      "shota7180", // 木内翔大（SHIFT AI 代表）
      "ImAI_Eruel", // 今井翔太（AI研究者・GenesisAI）
      "Shiba_program", // くるしば（Udemyプログラミング講師）
    ],
  },
  {
    id: "politics",
    name: "政治",
    accounts: [
      "takaichi_sanae", // 高市早苗
      "nikkeiseijibu", // 日本経済新聞 政治・外交
    ],
  },
  {
    id: "economy",
    name: "経済",
    accounts: [
      "nikkei_keizai", // 日経 経済
      "goto_finance", // 後藤達也
      "nikkei_bizdaily", // 日経ビジネス
      "BreakingNews", // Breaking News
    ],
  },
];

export function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, "").toLowerCase();
}

export function getAllAccounts(): Array<{
  handle: string;
  genreId: string;
  genreName: string;
}> {
  return genres.flatMap((genre) =>
    genre.accounts.map((handle) => ({
      handle: normalizeHandle(handle),
      genreId: genre.id,
      genreName: genre.name,
    })),
  );
}

export function getRegisteredAccountHandles(): Set<string> {
  return new Set(getAllAccounts().map((account) => account.handle));
}
