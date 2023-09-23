import loadJSON from "../utils/loadJSON.ts";
import { useSignal } from "@preact/signals";
import validateJSON from "../utils/validateJSON.ts";
import { TelegramExport } from "../types/telegramExport.type.ts";

export default function Statistics() {
  const data = useSignal<TelegramExport | null>(null);

  return (
    <>
      <div class="w-72">
        <div class="relative h-10 w-full min-w-[200px]">
          <input
            class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder="Hola"
            type="file"
            accept=".json"
            onInput={async (e) => {
              const files = e.currentTarget.files;
              if (!files) return;

              const file = files[0];
              const unknownJson = await loadJSON<TelegramExport>(file);

              const { error, value } = validateJSON(unknownJson);
              if (error) {
                console.dir(
                  unknownJson.messages[+(error.details[0].context?.key ?? 0)],
                );
                console.dir(error.details[0].context);
                console.dir(error);

                alert(
                  "The file you uploaded is not a valid Telegram export. Check the console for more information.",
                );
              } else data.value = value;
            }}
          />
        </div>
      </div>

      {data.value && (
        <p>
          {JSON.stringify(data.value, null, 2).slice(0, 10000).split("\n").map(
            (line) => {
              return (
                <span>
                  {line.replace(/ /g, "\u00a0")}
                  <br />
                </span>
              );
            },
          )}
        </p>
      )}
    </>
  );
}
