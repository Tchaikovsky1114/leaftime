import { api } from '../auth/fetcher';


export const sendStudyLog = async (date: string, studySeconds: number): Promise<void> => {
  if (studySeconds <= 0) {
    console.log('⏱ 0초 학습은 전송 생략');
    return;
  }

  try {
    const res = await api('/study-log', {
      method: 'POST',
      body: JSON.stringify({
        date, // 'YYYY-MM-DD'
        studySeconds,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn('📡 study-log 전송 실패:', text);
    } else {
      console.log('✅ study-log 전송 성공');
    }
  } catch (e) {
    console.error('📡 study-log 네트워크 오류:', e);
  }
};

interface StudySummaryResponse {
  totalDays: number;
  totalMinutes: number;
}

export async function getStudySummary(): Promise<StudySummaryResponse> {
  try {
    const res = await api('/study-log/get-study-summary');

    if (!res.ok) { throw new Error('학습 요약 정보 요청 실패'); }
    return res.json(); // { totalDays, totalMinutes }
  } catch (error) {

    console.error('📡 학습 요약 정보 네트워크 오류:', error);
    throw error;
  }

}
