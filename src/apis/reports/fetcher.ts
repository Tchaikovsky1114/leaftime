import {reportsApi, LearningReport, AddStopwordRequest} from './api';

// 하위 호환성을 위한 export
export type {LearningReport};
export type AddStopwordBody = AddStopwordRequest;

// 하위 호환성을 위한 래퍼 함수들
export const getDailyReport = async (date: string) => {
  return reportsApi.getDailyReport(date);
};

export const addStopword = async (body: AddStopwordRequest) => {
  return reportsApi.addStopword(body);
};
