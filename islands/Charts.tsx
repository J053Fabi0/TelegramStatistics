import { Chart } from "fresh-charts/island.tsx";
import { BAR_COLORS } from "../utils/constants.ts";
import getSongsSent from "../utils/getSongsSent.tsx";
import { TelegramExport } from "../types/telegramExport.type.ts";
import getParticipantsNames from "../utils/getParticipantsNames.tsx";
import getDailyTotalMessagesPerMonth from "../utils/getDailyTotalMessagesPerMonth.tsx";

interface ChartsProps {
  data: TelegramExport | null;
}

export default function Charts({ data }: ChartsProps) {
  if (!data) return null;

  const participantsNames = getParticipantsNames(data);
  const dailyTotalMessagesPerMonth = getDailyTotalMessagesPerMonth(data);
  const songsSent = getSongsSent(data);

  return (
    <>
      <div class="overflow-x-auto max-w-screen-sm">
        <Chart
          type="bar"
          options={{ devicePixelRatio: 2 }}
          data={{
            labels: participantsNames,
            datasets: [
              {
                label: "Songs sent",
                backgroundColor: BAR_COLORS,
                data: participantsNames.map((name) => songsSent[name] ?? 0),
              },
            ],
          }}
        />
      </div>

      <div class="overflow-x-auto w-full">
        <Chart
          type="bar"
          options={{ devicePixelRatio: 2 }}
          data={{
            labels: dailyTotalMessagesPerMonth.map((item) => item.title),
            datasets: [
              {
                label: "Combined",
                backgroundColor: "#baffc9",
                data: dailyTotalMessagesPerMonth.map((item) => item.count),
              },
              ...participantsNames.map((name, i) => ({
                label: name,
                backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                data: dailyTotalMessagesPerMonth.map((item) => item.perUser[name] ?? 0),
              })),
            ],
          }}
        />
      </div>
    </>
  );
}
