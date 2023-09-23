/** Gets the words without punctuation from a string. */
export default function getWords(text: string): string[] {
  const words = text.match(/\p{L}+/gu);
  if (!words) return [];
  return words;
}
