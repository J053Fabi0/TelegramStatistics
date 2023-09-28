import Statistics from "../islands/Statistics.tsx";
import Typography from "../components/Typography.tsx";

export default function Home() {
  return (
    <div>
      <Typography variant="h1">Telegram chat statistics</Typography>
      <Typography variant="lead">All data is processed locally, not sent to any server.</Typography>
      <Typography variant="lead">
        Load the <code>result.json</code> file you get when exporting your chat as JSON with Telegram Desktop.
      </Typography>

      <Statistics />
    </div>
  );
}
