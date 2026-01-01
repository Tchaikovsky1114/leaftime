export type LeafTimePromptOption = {
  label: string;
  onPress: () => void;
};

export type LeafTimePromptState = {
  visible: boolean;
  title: string;
  message: string;
  options: LeafTimePromptOption[];
};

import { create } from 'zustand';

interface PromptState {
  visible: boolean;
  title: string;
  subTitle?: string;
  message: string;
  options: { label: string; onPress: () => void }[];
  show: (title: string, subTitle: string, message: string, options: PromptState['options']) => void;
  dismiss: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  visible: false,
  title: '',
  message: '',
  subTitle: '',
  options: [],
  show: (title, subTitle, message, options) =>
    set({ visible: true, title, subTitle, message, options }),
  dismiss: () => set({ visible: false }),
}));
