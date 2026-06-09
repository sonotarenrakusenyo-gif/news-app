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
    ],
  },
  {
    id: "politics",
    name: "政治",
    accounts: [
      "takaichi_sanae", // 高市早苗
    ],
  },
  {
    id: "economy",
    name: "経済",
    accounts: [
      "nikkei_bizdaily", // 日経ビジネス
      "afpbbcom", // AFPBB News
      "ReutersJapan", // ロイター日本
    ],
  },
];

export function getAllAccounts(): Array<{
  handle: string;
  genreId: string;
  genreName: string;
}> {
  return genres.flatMap((genre) =>
    genre.accounts.map((handle) => ({
      handle: handle.replace(/^@/, "").toLowerCase(),
      genreId: genre.id,
      genreName: genre.name,
    })),
  );
}
