# API Layer Refactoring - Axios + React Query

## 📁 구조

```
src/apis/
├── client/
│   └── axiosClient.ts          # Axios 인스턴스 및 인터셉터 설정
├── auth/
│   ├── fetcher.ts              # 인증 관련 API 함수
│   └── hooks.ts                # 인증 관련 React Query hooks
├── reading/
│   ├── api.ts                  # Reading API 함수들
│   └── fetcher.ts              # 레거시 호환 + 유틸리티 함수들
├── study-log/
│   ├── api.ts                  # Study Log API 함수들
│   └── fetcher.ts              # 레거시 호환 래퍼
├── reports/
│   ├── api.ts                  # Reports API 함수들
│   └── fetcher.ts              # 레거시 호환 래퍼
├── queries/
│   ├── queryKeys.ts            # React Query 키 관리
│   ├── queries.ts              # Query hooks (GET 요청)
│   └── mutations.ts            # Mutation hooks (POST/PUT/DELETE 요청)
└── index.ts                    # 중앙 집중식 export
```

## 🎯 주요 변경사항

### 1. **Axios Client 통합**
- 모든 API 호출을 axios로 통합
- 자동 토큰 추가 (request interceptor)
- 401 에러 자동 처리 (response interceptor)

```typescript
import { apiClient } from '@/apis/client/axiosClient';

// 사용 예시
const response = await apiClient.get<UserData>('/user/profile');
const data = await apiClient.post<CreateResponse>('/books', { title: 'New Book' });
```

### 2. **React Query Hooks**
모든 API 호출을 React Query hooks로 래핑하여 캐싱, 자동 재시도, 상태 관리 제공

#### Queries (데이터 조회)
```typescript
import { useCurrentReading, useStudySummary, useDailyReport } from '@/apis';

// 컴포넌트에서 사용
function MyComponent() {
  const { data, isLoading, error } = useCurrentReading();
  const { data: summary } = useStudySummary();
  const { data: report } = useDailyReport('2025-01-19');
}
```

#### Mutations (데이터 변경)
```typescript
import { 
  useAddStopwordMutation, 
  useSendStudyLogMutation,
  useRequestVerificationMutation 
} from '@/apis';

function MyComponent() {
  const addStopword = useAddStopwordMutation();
  const sendLog = useSendStudyLogMutation();

  const handleAddStopword = () => {
    addStopword.mutate({ word: 'example', date: '2025-01-19' });
  };

  const handleSendLog = () => {
    sendLog.mutate({ date: '2025-01-19', studySeconds: 300 });
  };
}
```

### 3. **타입 안전성**
모든 API 응답과 요청에 TypeScript 타입 정의 추가

```typescript
// API 함수에서 타입 명시
export const readingApi = {
  getCurrentReading: async (): Promise<CurrentReadingResponse | null> => {
    const response = await apiClient.get<CurrentReadingResponse>('/get-current-reading');
    return response.data;
  },
};
```

## 🔄 마이그레이션 가이드

### Before (기존 방식)
```typescript
// 컴포넌트에서 직접 API 호출
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getCurrentReadingBook();
      setCurrentBook(data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, []);
```

### After (새로운 방식)
```typescript
// React Query hook 사용
const { data: currentBook, isLoading, error } = useCurrentReading();

// 자동으로 로딩/에러 상태 관리
// 캐싱, 자동 재시도, 백그라운드 업데이트 지원
```

## 📦 사용 가능한 Hooks

### Queries
- `useCurrentReading()` - 현재 읽고 있는 책 정보
- `useStudySummary()` - 학습 요약 정보
- `useDailyReport(date)` - 일일 학습 리포트

### Mutations
- `useAddStopwordMutation()` - 불용어 추가
- `useSendStudyLogMutation()` - 학습 로그 전송
- `useRepeatRoundMutation()` - 라운드 반복
- `useRequestVerificationMutation()` - 인증 코드 요청
- `useVerifyCodeMutation()` - 인증 코드 확인

## 🔧 설정

### React Query Client 설정
```typescript
// App.tsx 또는 최상위 컴포넌트
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

## ⚙️ 고급 사용법

### Query Invalidation (캐시 무효화)
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/apis';

function MyComponent() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // 특정 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentReading });
  };
}
```

### Optimistic Updates
```typescript
const mutation = useAddStopwordMutation();

mutation.mutate(
  { word: 'test', date: '2025-01-19' },
  {
    onMutate: async (newData) => {
      // 낙관적 업데이트: UI를 먼저 업데이트
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.dailyReport('2025-01-19') });
      const previousData = queryClient.getQueryData(QUERY_KEYS.dailyReport('2025-01-19'));
      
      // 새로운 데이터로 UI 업데이트
      queryClient.setQueryData(QUERY_KEYS.dailyReport('2025-01-19'), (old) => ({
        ...old,
        // 업데이트된 데이터
      }));
      
      return { previousData };
    },
    onError: (err, newData, context) => {
      // 에러 발생시 이전 데이터로 롤백
      queryClient.setQueryData(
        QUERY_KEYS.dailyReport('2025-01-19'),
        context.previousData
      );
    },
  }
);
```

## 🚀 향후 개선사항

1. [ ] 모든 fetch API 호출을 axios로 완전히 마이그레이션
2. [ ] Error boundaries 추가
3. [ ] React Query DevTools 통합
4. [ ] API 응답 스키마 검증 (Zod 등)
5. [ ] 오프라인 지원 (persistQueryClient)

## 📚 참고 자료

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
