import nameOfMonth from "./nameOfMonth.ts";
import getMessageText from "./getMessageText.ts";
import { TelegramExport } from "../types/telegramExport.type.ts";

export default function getDailyTotalMessagesPerMonth(data: TelegramExport) {
  const dailyTotalMessagesPerMonth: { title: string; count: number; perUser: Record<string, number> }[] = [];
  for (const message of data.messages) {
    if (message.type !== "message" || !getMessageText(message)) continue;

    const date = new Date(+message.date_unixtime * 1000);
    const title = `${nameOfMonth(date)} ${date.getFullYear()}`;

    const index = dailyTotalMessagesPerMonth.findIndex((item) => item.title === title);
    if (index === -1) dailyTotalMessagesPerMonth.push({ title, count: 1, perUser: { [message.from]: 1 } });
    else {
      dailyTotalMessagesPerMonth[index].count++;
      if (message.from in dailyTotalMessagesPerMonth[index].perUser)
        dailyTotalMessagesPerMonth[index].perUser[message.from]++;
      else dailyTotalMessagesPerMonth[index].perUser[message.from] = 1;
    }
  }

  return dailyTotalMessagesPerMonth;
}
