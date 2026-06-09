import { GoogleGenerativeAI } from "@google/generative-ai";

export async function summarizeForKids(
  handle: string,
  authorName: string,
  text: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `以下のX（Twitter）の投稿から、重要なポイントだけを小学生でもわかるように2〜3文で説明してください。

ルール:
- 難しい言葉は使わない
- 元の投稿全文を言い換えすぎない
- 何が大事なのかだけを短く説明する
- 誰の投稿か分かるように、最初に「${authorName}さんは」と書く
- 英語の投稿でも、日本語で説明する
- 箇条書きにはしない

投稿者: ${authorName}（@${handle}）
投稿内容:
${text}`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text().trim();

  if (!summary) {
    throw new Error("Gemini returned an empty summary");
  }

  return summary;
}
