import Charts from "./Charts.tsx";
import loadJSON from "../utils/loadJSON.ts";
import { useSignal } from "@preact/signals";
import validateJSON from "../utils/validateJSON.ts";
import { TelegramExport } from "../types/telegramExport.type.ts";

export default function Statistics() {
  const data = useSignal<TelegramExport | null>(null);

  async function handleFileInput(file: File) {
    const unknownJson = await loadJSON<TelegramExport>(file);

    const { error, value } = validateJSON(unknownJson);
    if (error) {
      console.dir(unknownJson.messages[+(error.details[0].context?.key ?? 0)]);
      console.dir(error.details[0].context);
      console.dir(error);

      alert("The file you uploaded is not a valid Telegram export. Check the console for more information.");
    } else data.value = value;
  }

  return (
    <>
      <input
        class="my-3"
        type="file"
        accept=".json"
        onInput={(e) => {
          const { files } = e.currentTarget;
          if (files) handleFileInput(files[0]);
        }}
      />

      <div class="flex flex-col gap-10 mb-10">
        <Charts data={data.value} />
      </div>
    </>
  );
}
