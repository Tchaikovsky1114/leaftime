import { useMutation } from '@tanstack/react-query';
import { addStopword, AddStopwordBody } from '../reports/fetcher';
// import { usePromptStore } from '../../store/promptStore';

export const useAddStopwordMutation = () => {
  // const {show} = usePromptStore()
  return useMutation({
    mutationFn: ({ word, date }: AddStopwordBody) => addStopword({ word, date }),
    onSuccess: () => {
      // 성공 시 추가 작업
      console.log('Stopword added successfully');
    },
    onError: (error) => {
      // 오류 처리
      console.error('Error adding stopword:', error);
    },
  });
};
