import { useReadingStore, Word } from '../../store/readingStore';
import { apiClient } from '../client/axiosClient';
import { readingApi } from './api';

export function chunkText(text: string, maxLen = 2000): string[] {
  console.log('===[chunkText] text===', text);
  const paras = text.split('\n\n');
  const chunks: string[] = [];
  let buffer = '';

  for (const para of paras) {
    if ((buffer + '\n\n' + para).length < maxLen) {
      buffer += (buffer ? '\n' : '') + para;
    } else {
      if (buffer) {chunks.push(buffer);}
      buffer = para;
    }
  }

  if (buffer) {chunks.push(buffer);}
  return chunks;
}


export function splitChunkToPagesByLine(chunk: string, maxLength = 500): Word[][] {
  const pages: Word[][] = [];
  let buffer: Word[] = [];
  let charCount = 0;

  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.trim() === '') {
      // 빈 줄이면 문단 구분용
      buffer.push({ text: '', isItalic: false, isLineBreak: true });
      charCount += 2; // 문단 공백 처리
      continue;
    }

    const wordsInLine = parseStyledLineWords(line);

    const lineLength = line.length;

    if (charCount + lineLength <= maxLength) {
      buffer.push(...wordsInLine, { text: '', isItalic: false, isLineBreak: true }); // 줄 끝에는 LineBreak
      charCount += lineLength;
    } else {
      if (buffer.length > 0) {
        pages.push(buffer);
      }
      buffer = [...wordsInLine, { text: '', isItalic: false, isLineBreak: true }];
      charCount = lineLength;
    }
  }

  if (buffer.length > 0) {
    pages.push(buffer);
  }

  return pages;
}

function normalizeDashes(text: string): string {
  return text
    .replace(/\u2014/g, 'ㅡ') // em dash(U+2014)를 우리 논리용 ㅡ로 치환
    .replace(/\u2013/g, '-') // en dash(U+2013)는 일반 하이픈으로
    .replace(/\u2015/g, 'ㅡ'); // horizontal bar(U+2015)도 치환
}

function parseStyledLineWords(line: string): Word[] {
  const cleanedLine = normalizeDashes(line).replace(/([^ ])ㅡ([^ ])/g, '$1 ㅡ $2');
  const tokens = cleanedLine.split(/\s+/);

  const result: Word[] = [];
  let emphasisMode = false;

  for (let word of tokens) {
    if (word === 'ㅡ') {
      emphasisMode = !emphasisMode;
      continue;
    }

    let isItalic = false;
    let isBracketed = false;

    // [bracket] 처리
    if (/^\[.*\]$/.test(word)) {
      word = word.slice(1, -1);
      isBracketed = true;
    }

    // _italic_ 처리
    if (/^_.*_$/.test(word)) {
      word = word.slice(1, -1);
      isItalic = true;
    }

    // *italic* 처리
    if (/^\*.*\*$/.test(word)) {
      word = word.slice(1, -1);
      isItalic = true;
    }

    result.push({
      text: word,
      isItalic,
      isBracketed,
      isEmphasized: emphasisMode,
    });
  }

  return result;
}

export function cleanText(text: string): string {
  const marker = 'You can download this and other ebooks carefully produced for true book lovers at standardebooks.org.';
  const index = text.indexOf(marker);

  if (index !== -1) {
    return text.slice(index + marker.length).trim(); // ✅ 해당 문구 이후부터 반환
  }

  // ✅ 만약 해당 문구가 없다면 원본 그대로 반환
  return text.trim();
}

export async function startReading(bookId: number): Promise<boolean> {
  try {
    const { currentBookId } = useReadingStore.getState();

    // ✅ 현재 책과 같으면 상태 유지 + 리렌더만 유도
    if (currentBookId === bookId) {
      console.log('🟢 같은 책이므로 상태 유지, 초기화하지 않음');
      return true; // 상태 변경 없이 리더 화면으로만 이동
    }

    // ✅ 다른 책이면 서버에서 새로 받아오기
    const { title, text_url, current_chunk_index } = await readingApi.startReading(bookId);

    if (!text_url) {
      console.error('❌ 서버 응답에 text_url 없음');
      return false;
    }

    const rawText = await readingApi.fetchTextContent(text_url);
    if (!rawText || rawText.length < 100) {
      console.error('❌ 텍스트가 비어있거나 너무 짧습니다');
      return false;
    }
    // ✅ 텍스트 정리
    const removePrologue = cleanText(rawText);

    const chunks = chunkText(removePrologue);
    const allPages = chunks.flatMap((chunk, chunkIndex) =>
      splitChunkToPagesByLine(chunk).map((words, pageIndex) => ({
        chunkIndex,
        pageIndex,
        words,
      }))
    );

    if (chunks.length === 0 || allPages.length === 0) {
      console.error('❌ chunk 또는 page 생성 실패');
      return false;
    }

    // ✅ 다른 책이므로 상태 초기화 후 저장
    const readingStore = useReadingStore.getState();
    readingStore.clearReading();
    readingStore.setReadingBook(bookId, title, chunks, allPages);
    readingStore.updatePage(current_chunk_index, 0);

    console.log('✅ startReading 완료:', {
      bookId,
      title,
      chunkCount: chunks.length,
      pageCount: allPages.length,
      currentIndex: current_chunk_index,
    });

    return true;
  } catch (err) {
    console.error('🔥 startReading 실행 중 오류:', err);
    return false;
  }
}

// 하위 호환성을 위한 래퍼 함수들 (점진적 마이그레이션용)
export async function getCurrentReadingBook() {
  return readingApi.getCurrentReading();
}

export async function repeatReadingRound(bookId: number, chunkIndex: number) {
  return readingApi.repeatRound(bookId, chunkIndex);
}
