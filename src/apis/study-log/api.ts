import { apiClient } from '../client/axiosClient';

export interface StudySummaryResponse {
  totalDays: number;
  totalMinutes: number;
}

export interface SendStudyLogRequest {
  date: string; // 'YYYY-MM-DD'
  studySeconds: number;
}

// API 함수들
export const studyLogApi = {
  sendStudyLog: async ({ date, studySeconds }: SendStudyLogRequest): Promise<void> => {
    if (studySeconds <= 0) {
      console.log('⏱ 0초 학습은 전송 생략');
      return;
    }

    await apiClient.post('/study-log', { date, studySeconds });
    console.log('✅ study-log 전송 성공');
  },

  getStudySummary: async (): Promise<StudySummaryResponse> => {
    const response = await apiClient.get<StudySummaryResponse>('/study-log/get-study-summary');
    return response.data;
  },
};
