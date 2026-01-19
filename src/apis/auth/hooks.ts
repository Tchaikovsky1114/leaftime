import { useMutation } from '@tanstack/react-query';
import { requestVerificationCode, verifyCode } from './fetcher';
import { useAuthStore } from '../../store/authStore';

export const useRequestVerificationMutation = () => {
  return useMutation({
    mutationFn: (phone: string) => requestVerificationCode(phone),
    onSuccess: (status) => {
      console.log('인증 코드 요청 성공:', status);
    },
    onError: (error) => {
      console.error('인증 코드 요청 실패:', error);
    },
  });
};

export const useVerifyCodeMutation = () => {
  const { setLogin } = useAuthStore();

  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      verifyCode(phone, code),
    onSuccess: ({ token, user }) => {
      console.log('인증 성공');
      setLogin(user, token);
    },
    onError: (error) => {
      console.error('인증 실패:', error);
    },
  });
};
