import { JSX } from "preact";
import Button from "../../components/Button.tsx";
import Typography from "../../components/Typography.tsx";
import { useSignal, useSignalEffect } from "@preact/signals";
import { TelegramExport } from "../../types/telegramExport.type.ts";
import getTopWordsPerUser from "../../utils/getTopWordsPerUser.tsx";

interface TopWordsPerUserProps {
  data: TelegramExport;
  participantsNames: string[];
}

export default function TopWordsPerUser({ participantsNames, data }: TopWordsPerUserProps) {
  const topWordsPerUser = useSignal(getTopWordsPerUser(data, Infinity));
  const rows = useSignal<Record<string, JSX.Element[]> | null>(null);

  function addRows(amount: number) {
    const newRows: Record<string, JSX.Element[]> = {};
    for (const name of participantsNames) {
      newRows[name] = rows.value ? [...rows.value[name]] : [];
      const from = newRows[name].length;
      const to = from + amount;

      for (let i = from; i < to; i++) {
        const { count, word } = topWordsPerUser.value.topWordsPerUser[name][i];
        newRows[name].push(
          <tr key={`${name}${i}`}>
            <td class="border px-4 py-2">{word}</td>
            <td class="border px-4 py-2">
              #{i + 1} - {count}
            </td>
            {participantsNames
              .filter((p) => p !== name)
              .map((name) => (
                <td class="border px-4 py-2">
                  #{topWordsPerUser.value.topWordsPerUser[name].findIndex((item) => item.word === word) + 1} -{" "}
                  {topWordsPerUser.value.wordsPerUser[name][word] ?? 0}
                </td>
              ))}
          </tr>
        );
      }
    }

    rows.value = newRows;
  }

  // add the first 10 rows
  useSignalEffect(() => {
    if (rows.value === null) addRows(10);
  });

  return (
    <div class="flex gap-4 flex-col items-center">
      {rows.value && (
        <Button class="w-fit" onClick={() => addRows(10)} color="green">
          Cargar 10 más
        </Button>
      )}

      <div class="flex flex-wrap gap-8 justify-center">
        {participantsNames.map((name) => (
          <div>
            <Typography variant="h3">{name}</Typography>
            <table class="table-auto relative">
              <thead class="sticky top-0 left-0 right-0 bg-white">
                <tr>
                  <th class="px-4 py-2">Word</th>
                  <th class="px-4 py-2">{name}</th>
                  {participantsNames
                    .filter((p) => p !== name)
                    .map((name) => (
                      <th class="px-4 py-2">{name}</th>
                    ))}
                </tr>
              </thead>
              <tbody>{rows.value ? rows.value[name].toReversed() : null}</tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
