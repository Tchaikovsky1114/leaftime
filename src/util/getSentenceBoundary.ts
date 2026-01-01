import { Word } from '../store/readingStore';

const sentenceEndings = ['.', '?', '!', '…'];
const softBoundaries = [',', ';', ':', '(', ')', '[', ']', '{', '}', '"', '“', '”', '‘', '’'];

export function getSentenceBoundaryIndexes(words: Word[], index: number): number[] {
  if (!words[index]) {return [];}

  const leftStopChars = [...sentenceEndings, ...softBoundaries];

  // 롱프레스한 단어가 종결 부호/쉼표로 끝나면 오른쪽 확장 금지
  const currentText = words[index].text.trim();
  const currentLastChar = currentText.slice(-1);
  const skipRightExpansion = sentenceEndings.includes(currentLastChar) || softBoundaries.includes(currentLastChar);

  // ← 왼쪽 확장
  let start = index;
  while (start > 0) {
    const prev = words[start - 1].text.trim();
    const lastChar = prev.slice(-1);
    if (leftStopChars.includes(lastChar)) {break;}
    start--;
  }

  // → 오른쪽 확장 (조건에 따라 수행)
  let end = index + 1;
  if (!skipRightExpansion) {
    while (end < words.length) {
      const current = words[end].text.trim();
      const lastChar = current.slice(-1);

      if (sentenceEndings.includes(lastChar) || softBoundaries.includes(lastChar)) {
        end++; // 포함 후 종료
        break;
      }

      end++;
    }
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
}
