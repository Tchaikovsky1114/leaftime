import {studyLogApi} from './api';

// 하위 호환성을 위한 래퍼 함수들
export const sendStudyLog = async (
  date: string,
  studySeconds: number,
): Promise<void> => {
  return studyLogApi.sendStudyLog({date, studySeconds});
};

export async function getStudySummary() {
  return studyLogApi.getStudySummary();
}
