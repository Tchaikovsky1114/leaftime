import {apiClient} from '../client/axiosClient';
import {User} from '../../store/authStore';

export async function requestVerificationCode(phone: string) {
  const response = await apiClient.post<{status: string}>(
    '/auth/request-verification',
    {
      phone,
    },
  );
  return response.data.status;
}

export async function verifyCode(
  phone: string,
  code: string,
): Promise<{
  token: string;
  user: User;
}> {
  const response = await apiClient.post<{token: string; user: User}>(
    '/auth/verify-code',
    {
      phone,
      code,
    },
  );
  return response.data;
}
