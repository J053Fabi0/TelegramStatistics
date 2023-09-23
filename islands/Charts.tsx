import { Chart } from "fresh-charts/island.tsx";
import { BAR_COLORS } from "../utils/constants.ts";
import getParticipantsNames from "../utils/getParticipantsNames.tsx";
import { TelegramExport } from "../types/telegramExport.type.ts";
import getDailyTotalMessagesPerMonth from "../utils/getDailyTotalMessagesPerMonth.tsx";

interface ChartsProps {
  data: TelegramExport | null;
}

export default function Charts({ data }: ChartsProps) {
  if (!data) return null;

  const participantsNames = getParticipantsNames(data);
  const dailyTotalMessagesPerMonth = getDailyTotalMessagesPerMonth(data);

  return (
    <div class="overflow-x-auto w-full">
      <Chart
        type="bar"
        options={{ devicePixelRatio: 2 }}
        data={{
          labels: dailyTotalMessagesPerMonth.map((item) => item.title),
          datasets: [
            {
              data: dailyTotalMessagesPerMonth.map((item) => item.count),
              backgroundColor: "#baffc9",
              label: "Combined",
            },
            ...participantsNames.map((name, i) => ({
              data: dailyTotalMessagesPerMonth.map((item) => item.perUser[name] ?? 0),
              backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
              label: name,
            })),
          ],
        }}
      />
    </div>
  );
}
