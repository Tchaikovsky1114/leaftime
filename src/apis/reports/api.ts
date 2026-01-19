import { apiClient } from '../client/axiosClient';

export interface LearningReport {
  id: string;
  report_type: 'daily' | 'weekly' | 'monthly';
  report_date: string; // YYYY-MM-DD
  generated_at: string;
  user_id: string;
  summary: {
    top_words: { word: string; count: number }[];
    top_sentences: { sentence: string; count: number }[];
    total_saved_sentences: number;
    saved_sentences: { sentence: string; id: string }[];
    savedCount: number;
    usedInteractions: {
      analysis: number;
      conversations: number;
      wordsAndPhrase: number;
      examples: number;
      followUp: number;
    } | null;
  };
  feedbacks: {
    sentence_id: string;
    feedback_type: string;
    response_data: Record<string, any> | null;
  }[] | null;
}

export interface AddStopwordRequest {
  word: string;
  date: string;
}

// API 함수들
export const reportsApi = {
  getDailyReport: async (date: string): Promise<LearningReport> => {
    const response = await apiClient.get<LearningReport>(
      `/reports/get-daily-report?date=${date}`
    );
    return response.data;
  },

  addStopword: async ({ word, date }: AddStopwordRequest): Promise<void> => {
    await apiClient.post('/user-stopwords', { word, date });
  },
};
