export const QUERY_KEYS = {
  currentReading: ['currentReadingBook'] as const,
  booksList: (page: number) => ['booksList', page] as const,
  userStudySummary: ['userStudySummary'] as const,
  feedbackRequests: (sentenceId: string) => ['feedback', sentenceId] as const,
  // 필요에 따라 계속 확장
  userProfile: ['userProfile'] as const,
  studySummary: ['studySummary'] as const,
  dailyReport: (date: string) => ['dailyReport', date] as const,
} as const;
