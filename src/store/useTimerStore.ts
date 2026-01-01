import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

interface TimerState {
  seconds: number;
  running: boolean;
  startTimestamp: number;
  date: string;
  setStartTimestamp: (ts: number) => void;
  setSeconds: (s: number) => void;
  setRunning: (r: boolean) => void;
  setDate: (d: string) => void
  reset: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      seconds: 0,
      running: false,
      date: dayjs().format('YYYY-MM-DD'),
      setSeconds: (s) => set({ seconds: s }),
      setRunning: (r) => set({ running: r }),
      startTimestamp: 0,
      setStartTimestamp: (ts) => set({ startTimestamp: ts }),
      reset: () => set({ seconds: 0, running: false }),
      setDate: (d) => set({ date: d }),
    }),
    {
      name: 'leaftime-timer',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
