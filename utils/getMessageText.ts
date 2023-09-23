import { TelegramMessage } from "../types/telegramExport.type.ts";

export default function getMessageText(message: TelegramMessage): string | null {
  if (message.type === "service") return null;

  if (typeof message.text === "string") return message.text;

  return message.text.reduce<string>((str, text) => str + (typeof text === "string" ? text : text.text), "");
}
