# Axios + React Query 마이그레이션 체크리스트

## ✅ 완료된 작업

### 1. 인프라 구축
- [x] Axios 클라이언트 설정 (`src/apis/client/axiosClient.ts`)
  - Request interceptor: 자동 토큰 추가
  - Response interceptor: 401 에러 자동 처리
  - 타입 안전한 API 클라이언트 헬퍼 함수

### 2. API 모듈 분리
- [x] `src/apis/auth/` - 인증 관련
  - fetcher.ts: axios로 마이그레이션
  - hooks.ts: React Query hooks 추가
- [x] `src/apis/reading/` - 독서 관련
  - api.ts: 새로운 API 함수들
  - fetcher.ts: 레거시 호환 유지
- [x] `src/apis/study-log/` - 학습 로그
  - api.ts: 새로운 API 함수들
  - fetcher.ts: 레거시 호환 래퍼
- [x] `src/apis/reports/` - 리포트
  - api.ts: 새로운 API 함수들
  - fetcher.ts: 레거시 호환 래퍼

### 3. React Query Hooks
- [x] Queries (데이터 조회)
  - `useCurrentReading()`
  - `useStudySummary()`
  - `useDailyReport(date)`
- [x] Mutations (데이터 변경)
  - `useAddStopwordMutation()`
  - `useSendStudyLogMutation()`
  - `useRepeatRoundMutation()`
  - `useRequestVerificationMutation()`
  - `useVerifyCodeMutation()`

### 4. 문서화
- [x] API 레이어 구조 문서 (`src/apis/README.md`)
- [x] 마이그레이션 가이드
- [x] 사용 예시 및 Best Practices

## 🔄 진행해야 할 작업

### Phase 1: 기존 컴포넌트 마이그레이션 (우선순위 높음)
- [ ] 인증 관련 화면들을 새로운 hooks로 전환
  - [ ] VerifyCodeScreen
  - [ ] LoginScreen (있다면)
- [ ] 독서 관련 화면
  - [ ] ReadingScreen에서 `useCurrentReading()` 사용
  - [ ] 직접 API 호출 제거
- [ ] 학습 로그/리포트 화면
  - [ ] `useStudySummary()` 적용
  - [ ] `useDailyReport()` 적용

### Phase 2: 레거시 코드 제거
- [ ] `api()` fetch 함수 완전히 제거
- [ ] 직접 API 호출하는 코드 모두 hooks로 전환
- [ ] fetcher.ts의 레거시 래퍼 함수들 제거

### Phase 3: 최적화
- [ ] React Query DevTools 추가 (개발 환경)
- [ ] Error Boundary 추가
- [ ] Loading/Error UI 컴포넌트 표준화
- [ ] Optimistic updates 적용 (필요한 곳)
- [ ] Query prefetching 전략 수립

### Phase 4: 테스트
- [ ] API 모듈 단위 테스트
- [ ] React Query hooks 테스트
- [ ] 통합 테스트

## 🎯 다음 단계별 가이드

### Step 1: 컴포넌트에서 hooks 사용하기

**Before:**
```typescript
// 기존 방식
const [currentBook, setCurrentBook] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCurrentReadingBook();
      setCurrentBook(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**After:**
```typescript
// 새로운 방식
import { useCurrentReading } from '@/apis';

const { data: currentBook, isLoading, error } = useCurrentReading();

// 자동으로 캐싱, 재시도, 백그라운드 업데이트
```

### Step 2: Mutation 사용하기

**Before:**
```typescript
const handleSubmit = async () => {
  try {
    await addStopword({ word, date });
    alert('성공!');
  } catch (error) {
    alert('실패!');
  }
};
```

**After:**
```typescript
import { useAddStopwordMutation } from '@/apis';

const mutation = useAddStopwordMutation();

const handleSubmit = () => {
  mutation.mutate({ word, date }, {
    onSuccess: () => alert('성공!'),
    onError: () => alert('실패!'),
  });
};

// mutation.isPending로 로딩 상태 확인 가능
```

## 📝 주의사항

1. **하위 호환성**: 기존 fetcher 함수들은 당분간 유지됩니다. 점진적으로 마이그레이션하세요.

2. **타입 안전성**: 모든 API 함수는 TypeScript 타입이 정의되어 있습니다. IDE의 자동완성을 활용하세요.

3. **에러 처리**: React Query는 자동으로 재시도하므로, 네트워크 오류에 더 강건합니다.

4. **캐싱**: 같은 데이터를 여러 컴포넌트에서 사용해도 한 번만 요청됩니다.

5. **Query Keys**: `QUERY_KEYS`를 사용하여 캐시 무효화 및 관리가 쉽습니다.

## 🐛 문제 발생 시

### TypeScript 에러
```bash
npx tsc --noEmit
```

### React Query 상태 확인
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// App에 추가
<ReactQueryDevtools initialIsOpen={false} />
```

### API 호출 디버깅
- 네트워크 탭에서 요청 확인
- axios interceptor에 console.log 추가
- React Query DevTools로 캐시 상태 확인

## 📞 도움이 필요하면

- `src/apis/README.md` 참조
- React Query 공식 문서: https://tanstack.com/query/latest
- Axios 공식 문서: https://axios-http.com/
