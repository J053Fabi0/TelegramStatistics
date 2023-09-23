import { TelegramExport } from "../types/telegramExport.type.ts";
import getMessageText from "./getMessageText.ts";

export default function getSongsSent(data: TelegramExport) {
  const songsSent: Record<string, number> = {};
  for (const message of data.messages) {
    if (message.type !== "message") continue;
    const text = getMessageText(message);
    if (text?.includes("music.youtube.com")) {
      if (message.from in songsSent) songsSent[message.from]++;
      else songsSent[message.from] = 1;
    }
  }
  return songsSent;
}
