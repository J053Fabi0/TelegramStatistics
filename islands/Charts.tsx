import { Chart } from "fresh-charts/island.tsx";
import { BAR_COLORS } from "../utils/constants.ts";
import getSongsSent from "../utils/getSongsSent.tsx";
import Typography from "../components/Typography.tsx";
import TopWordsPerUser from "./charts/TopWordsPerUser.tsx";
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
      {/* Top words per user */}
      <TopWordsPerUser data={data} participantsNames={participantsNames} />

      {/* Songs sent */}
      <div class="overflow-x-auto max-w-screen-sm">
        <Typography variant="h2">Songs sent (YouTube)</Typography>
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

      {/* Messages sent per month */}
      <div class="overflow-x-auto w-full mb-10">
        <Typography variant="h2">
          Messages sent per month (total: {dailyTotalMessagesPerMonth.reduce((a, b) => a + b.count, 0)})
        </Typography>
        <Chart
          type="bar"
          options={{ devicePixelRatio: 2 }}
          data={{
            labels: dailyTotalMessagesPerMonth.map((item) => item.title),
            datasets: [
              {
                label: "Combined",
                backgroundColor: "#baffc9",
                hidden: true,
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
