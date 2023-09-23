import { TelegramExport } from "../types/telegramExport.type.ts";

export default function getParticipantsNames(data: TelegramExport): string[] {
  const participantsNames = new Set<string>();
  for (const message of data.messages) if ("from" in message) participantsNames.add(message.from);

  return [...participantsNames.values()];
}
