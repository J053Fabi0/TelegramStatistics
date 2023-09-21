import { AppProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { Links } from "../components/Links.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Telegram statistics</title>
        <link href={asset("/styles.css")} rel="stylesheet" />
        <Links />
      </Head>
      <body class="min-h-screen flex flex-col bg-[#F0F0EF]">
        <div class="px-4 pt-4 mx-auto w-full max-w-screen-lg flex-1">
          <Component />
        </div>
      </body>
    </html>
  );
}
