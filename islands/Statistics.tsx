import Charts from "./Charts.tsx";
import loadJSON from "../utils/loadJSON.ts";
import { useSignal } from "@preact/signals";
import { TelegramExport } from "../types/telegramExport.type.ts";

export default function Statistics() {
  const data = useSignal<TelegramExport | null>(null);

  async function handleFileInput(file: File) {
    data.value = await loadJSON<TelegramExport>(file);
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
