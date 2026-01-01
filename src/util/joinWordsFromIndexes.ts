import { Word } from '../store/readingStore';

export function joinWordsFromIndexes(words: Word[], indexes: number[]): string {
  if (!indexes.length) {return '';}

  const text = indexes
    .sort((a, b) => a - b)
    .map((i) => words[i]?.text ?? '')
    .join(' ')
    .trim();

  // 문장 끝에 붙은 불필요한 따옴표나 괄호 제거 (예: "Over!\"", "done.') 등)
  const cleaned = text.replace(/([.?!])?["')\]]+$/, '$1'); // 기호 뒤의 punctuation은 남김

  return cleaned;
}
