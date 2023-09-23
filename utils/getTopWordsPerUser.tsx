import { TelegramExport } from "../types/telegramExport.type.ts";
import getMessageText from "./getMessageText.ts";
import getWords from "./getWords.tsx";

export default function getTopWordsPerUser(
  data: TelegramExport,
  samples = 10
): {
  topWordsPerUser: Record<string, { word: string; count: number }[]>;
  /** first key is user, second key is word, value is count */
  wordsPerUser: Record<string, Record<string, number>>;
} {
  const wordsPerUser: Record<string, Record<string, number>> = {};
  for (const message of data.messages) {
    if (message.type !== "message") continue;

    const text = getMessageText(message);
    if (!text) continue;

    const from = message.from;
    if (!(from in wordsPerUser)) wordsPerUser[from] = {};

    const words = getWords(text);
    if (!words) continue;
    for (const word of words.map((w) => w.toLowerCase()))
      wordsPerUser[from][word] = (wordsPerUser[from][word] ?? 0) + 1;
  }
  const topWordsPerUser: Record<string, { word: string; count: number }[]> = {};
  for (const user in wordsPerUser) {
    const words = wordsPerUser[user];
    topWordsPerUser[user] = Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, samples)
      .map(([word, count]) => ({ word, count }));
  }

  return { topWordsPerUser, wordsPerUser };
}
