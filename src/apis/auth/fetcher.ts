import axios from 'axios';
import { useAuthStore, User } from '../../store/authStore';


export const BASE_URL = 'http://192.168.219.116:3000';
export async function requestVerificationCode(phone: string) {
  // const response = await axios.post(`${BASE_URL}/api/verify`, { phone });
  const response = await axios.post(`${BASE_URL}/auth/request-verification`, {
    phone,
  });
  return response.data.status; // 'pending' 또는 'sent'
}

export async function verifyCode(phone: string, code: string): Promise<{
  token: string;
  user: User,
}> {
  const response = await axios.post(`${BASE_URL}/auth/verify-code`, {
    phone,
    code,
  });
  return response.data;
}

// ___




// const BASE_URL = 'http://localhost:3000'; // 예: http://localhost:3000 or prod URL

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  const headers: HeadersInit_ = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};
