import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../apis/client/axiosClient';
import { useAuthStore } from '../store/authStore';
import { FeedbackType } from '../screens/LearningReportScreen';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../apis/queries/queryKeys';

const socket = io(BASE_URL, {
  transports: ['websocket'],
  auth: {
    token: useAuthStore.getState().token,
  },
});

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

export function useFeedbackSocket(
  sentence: string,
  sentenceId: string | null,
  type: FeedbackType,
  reportDate: string,
) {
  const [result, setResult] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sentence || !type || !reportDate) {return;}

    setResult('');
    console.log('📤 Emitting startFeedback:', {
      sentence,
      sentence_id: sentenceId,
      type,
      report_date: reportDate,
    });

    socket.emit('startFeedback', {
      sentence,
      sentence_id: sentenceId,
      type,
      report_date: reportDate,
    });

    const handleChunk = (text: string) => {
      console.log('📩 Received chunk:', text);
      setResult((prev) => prev + text);
    };

    const handleDone = () => {
      console.log('✅ Feedback stream done.');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dailyReport(reportDate),
      });
    };

    socket.on('feedbackChunk', handleChunk);
    socket.on('feedbackDone', handleDone);

    return () => {
      socket.off('feedbackChunk', handleChunk);
      socket.off('feedbackDone', handleDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence, sentenceId, type, reportDate]);

  return { result };
}
