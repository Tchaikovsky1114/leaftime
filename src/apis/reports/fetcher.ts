import { api } from '../auth/fetcher';

export interface LearningReport {
  id: string;
  report_type: 'daily' | 'weekly' | 'monthly';
  report_date: string; // YYYY-MM-DD
  generated_at: string;
  user_id: string;
  summary: {
    top_words: { word: string; count: number }[],
    top_sentences: { sentence: string; count: number }[],
    total_saved_sentences: number,
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

export const getDailyReport = async (date: string) => {
  try {
    // get-daily-report
    const res = await api(`/reports/get-daily-report?date=${date}`, );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return data as LearningReport;
  } catch (error) {

    console.error('===[getDailyReport]=== Failed to fetch data:', error);
    throw error;
  }

};

export interface AddStopwordBody {
  word: string;
  date: string;
}
export const addStopword = async (body: AddStopwordBody) => {
  try {
    await api('/user-stopwords', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Stopword 추가 실패:', error);
  }
};
