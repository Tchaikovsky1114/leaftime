import { apiClient } from '../client/axiosClient';

export interface StartReadingResponse {
  title: string;
  text_url: string;
  current_chunk_index: number;
}

export interface CurrentReadingResponse {
  bookId: number;
  title: string;
  currentChunkIndex: number;
  coverImage: string;
}

export interface RepeatRoundResponse {
  success: boolean;
  newRound: number;
}

// API 함수들 (React Query와 분리)
export const readingApi = {
  startReading: async (bookId: number): Promise<StartReadingResponse> => {
    const response = await apiClient.post<StartReadingResponse>('/start-reading', { bookId });
    return response.data;
  },

  getCurrentReading: async (): Promise<CurrentReadingResponse | null> => {
    try {
      const response = await apiClient.get<CurrentReadingResponse>('/get-current-reading');
      return response.data;
    } catch (error) {
      console.error('getCurrentReadingBook 오류:', error);
      return null;
    }
  },

  repeatRound: async (bookId: number, chunkIndex: number): Promise<RepeatRoundResponse> => {
    const response = await apiClient.post<RepeatRoundResponse>('/repeat-round', {
      bookId,
      chunkIndex,
    });
    return response.data;
  },

  fetchTextContent: async (textUrl: string): Promise<string> => {
    const response = await fetch(textUrl);
    if (!response.ok) {
      throw new Error('텍스트 파일 fetch 실패');
    }
    return response.text();
  },
};
