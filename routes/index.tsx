import Statistics from "../islands/Statistics.tsx";
import Typography from "../components/Typography.tsx";

export default function Home() {
  return (
    <div>
      <Typography variant="h1">Telegram chat statistics</Typography>

      <Statistics />
    </div>
  );
}
