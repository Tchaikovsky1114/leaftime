import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../apis/auth/fetcher';

export const useInstantTranslate = () => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const translate = async (text: string) => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/instant-translate`, { text });

      const result = res.data?.translatedText;
      if (!result || typeof result !== 'string') {
        throw new Error('서버 응답에 translatedText가 없습니다.');
      }

      setTranslatedText(result);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setTranslatedText(null);
      }, 10000);
    } catch (err: any) {
      console.error('번역 실패:', err?.response?.data || err.message);

      // 선택: 사용자에게 직접 보여줄 에러 메시지 처리도 가능
      setTranslatedText('❌ 번역에 실패했습니다.'); // 또는 null
      timeoutRef.current = setTimeout(() => {
        setTranslatedText(null);
      }, 3000);
    }
    setLoading(false);
  };

  const clearTransaltedText = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTranslatedText(null);
  },[]);

  return { translatedText, translate, clearTransaltedText,loading };
};
