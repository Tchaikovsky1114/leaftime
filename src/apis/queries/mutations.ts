import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, AddStopwordRequest } from '../reports/api';
import { studyLogApi, SendStudyLogRequest } from '../study-log/api';
import { readingApi } from '../reading/api';
import { QUERY_KEYS } from './queryKeys';

export const useAddStopwordMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddStopwordRequest) => reportsApi.addStopword(data),
    onSuccess: () => {
      console.log('Stopword added successfully');
      // 관련 쿼리 무효화 (예: dailyReport)
      queryClient.invalidateQueries({ queryKey: ['dailyReport'] });
    },
    onError: (error) => {
      console.error('Error adding stopword:', error);
    },
  });
};

export const useSendStudyLogMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SendStudyLogRequest) => studyLogApi.sendStudyLog(data),
    onSuccess: () => {
      console.log('Study log sent successfully');
      // 학습 요약 정보 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studySummary });
    },
    onError: (error) => {
      console.error('Error sending study log:', error);
    },
  });
};

export const useRepeatRoundMutation = () => {
  return useMutation({
    mutationFn: ({ bookId, chunkIndex }: { bookId: number; chunkIndex: number }) =>
      readingApi.repeatRound(bookId, chunkIndex),
    onSuccess: (data) => {
      console.log('Round repeated successfully, new round:', data.newRound);
    },
    onError: (error) => {
      console.error('Error repeating round:', error);
    },
  });
};
