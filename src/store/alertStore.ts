import { create } from 'zustand';

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  show: (params: { title: string; message: string, onConfirm?: () => void }) => void;
  dismiss: () => void;
  onConfirm?: () => void; // ✅ 추가
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  show: ({ title, message, onConfirm }) =>
    set({ visible: true, title, message, onConfirm }),
  dismiss: () =>
    set({ visible: false, title: '', message: '', onConfirm: undefined }),
  onConfirm: undefined,
}));
