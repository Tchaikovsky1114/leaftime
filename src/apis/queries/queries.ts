import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { getCurrentReadingBook } from '../reading/fetcher';
import { getStudySummary } from '../study-log/fetcher';
import { getDailyReport } from '../reports/fetcher';

export const useCurrentReading = () => {
  return useQuery({
    queryKey: QUERY_KEYS.currentReading,
    queryFn: getCurrentReadingBook,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export const useStudySummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.studySummary,
    queryFn: getStudySummary,
    staleTime: 1000 * 60 * 10, // 10분 동안 fresh
  });
};

export const useDailyReport = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.dailyReport(date),
    queryFn: () => getDailyReport(date),
    staleTime: 1000 * 60 * 10, // 10분 캐시
    enabled: !!date, // date가 있을 때만 쿼리 실행
  });
};
