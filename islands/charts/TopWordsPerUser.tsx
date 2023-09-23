import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Button from "../../components/Button.tsx";
import Typography from "../../components/Typography.tsx";
import { TelegramExport } from "../../types/telegramExport.type.ts";
import { useSignal, useSignalEffect, useComputed } from "@preact/signals";
import getTopWordsPerUser, { TopWordsPerUser } from "../../utils/getTopWordsPerUser.tsx";

interface TopWordsPerUserProps {
  data: TelegramExport;
  participantsNames: string[];
}

export default function TopWordsPerUser({ participantsNames, data }: TopWordsPerUserProps) {
  const minLength = useSignal(1); // min word length
  const rows = useSignal<Record<string, JSX.Element[]> | null>(null);
  const topWordsPerUser = useSignal(getTopWordsPerUser(data, Infinity));
  const topWordsPerUserFiltered = useComputed<TopWordsPerUser>(() => {
    const newTopWordsPerUser: TopWordsPerUser = { topWordsPerUser: {}, wordsPerUser: {} };

    for (const name of participantsNames) {
      newTopWordsPerUser.topWordsPerUser[name] = [];
      newTopWordsPerUser.wordsPerUser[name] = {};
    }

    for (const name of participantsNames) {
      newTopWordsPerUser.topWordsPerUser[name] = topWordsPerUser.value.topWordsPerUser[name].filter(({ word }) => {
        const isGood = word.length >= minLength.value;
        if (isGood) newTopWordsPerUser.wordsPerUser[name][word] = topWordsPerUser.value.wordsPerUser[name][word];
        return isGood;
      });
    }

    console.log(newTopWordsPerUser);
    return newTopWordsPerUser;
  });

  function addRows(amount: number) {
    const newRows: Record<string, JSX.Element[]> = {};
    for (const name of participantsNames) {
      newRows[name] = rows.value ? [...rows.value[name]] : [];
      const from = newRows[name].length;
      const to = from + amount;

      for (let i = from; i < to; i++) {
        const { count, word } = topWordsPerUserFiltered.value.topWordsPerUser[name][i];
        newRows[name].push(
          <tr key={`${name}${i}`}>
            <td class="border px-4 py-2 whitespace-no-wrap">{word}</td>
            <td class="border px-4 py-2 whitespace-no-wrap">
              #{i + 1} - {count}
            </td>
            {participantsNames
              .filter((p) => p !== name)
              .map((name) => (
                <td class="border px-4 py-2 whitespace-no-wrap">
                  #
                  {topWordsPerUserFiltered.value.topWordsPerUser[name].findIndex((item) => item.word === word) + 1}{" "}
                  - {topWordsPerUserFiltered.value.wordsPerUser[name][word] ?? 0}
                </td>
              ))}
          </tr>
        );
      }
    }

    rows.value = newRows;
  }

  // add the first 10 rows on mount
  useSignalEffect(() => {
    if (rows.value === null && IS_BROWSER) addRows(10);
  });

  useSignalEffect(() => {
    minLength.value;
  });

  return (
    <div class="flex gap-4 flex-col items-center">
      <div class="flex gap-4 justify-center w-full">
        {rows.value && (
          <Button class="w-fit" onClick={() => addRows(10)} color="green">
            Cargar 10 más
          </Button>
        )}

        <div class="flex gap-2 items-center">
          <label for="validator">Min length:</label>
          <input
            required
            type="number"
            id="validator"
            name="validator"
            value={minLength.value}
            onInput={(e) => {
              const value = +e.currentTarget.value;
              if (
                value < 0 ||
                isNaN(value) ||
                value % 1 !== 0 ||
                !e.currentTarget.value ||
                /\D/g.test(e.currentTarget.value)
              )
                return;
              minLength.value = value;
              rows.value = null;
            }}
            class="p-2 border border-gray-300 rounded w-16"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="flex gap-8 justify-center">
          {participantsNames.map((name) => (
            <div>
              <Typography variant="h3">{name}</Typography>
              <table class="table-auto relative">
                <thead class="sticky top-0 left-0 right-0 bg-white">
                  <tr>
                    <th class="px-4 py-2">Word</th>
                    <th class="px-4 py-2 whitespace-no-wrap">{name}</th>
                    {participantsNames
                      .filter((p) => p !== name)
                      .map((name) => (
                        <th class="px-4 py-2 whitespace-no-wrap">{name}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>{rows.value ? rows.value[name].toReversed() : null}</tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
