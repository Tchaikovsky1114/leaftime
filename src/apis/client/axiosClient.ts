import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {useAuthStore} from '../../store/authStore';

export const BASE_URL = 'http://192.168.219.116:3000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: 토큰 자동 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor: 에러 핸들링
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 401 에러 처리 등
    if (error.response?.status === 401) {
      useAuthStore.getState().setLogout();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

// 타입 안전성을 위한 헬퍼 함수들
export const apiClient = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.get<T>(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data, config),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data, config),

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axiosInstance.patch<T>(url, data, config),
};
