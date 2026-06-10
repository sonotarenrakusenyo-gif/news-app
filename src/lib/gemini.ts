import { GoogleGenerativeAI } from "@google/generative-ai";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("429") || message.includes("Too Many Requests");
}

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

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      const summary = result.response.text().trim();

      if (!summary) {
        throw new Error("Gemini returned an empty summary");
      }

      return summary;
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error) || attempt === 2) {
        break;
      }

      await sleep(15000 * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini summary failed");
}
