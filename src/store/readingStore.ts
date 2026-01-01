import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Word {
  text: string;
  isItalic: boolean;
  isBracketed?: boolean;
  isLineBreak?: boolean;
  isEmphasized?: boolean;
}

export interface Page {
  chunkIndex: number;
  pageIndex: number;
  words: Word[];
}

interface ReadingState {
  currentBookId: number | null;
  currentBookTitle: string;
  currentChunkIndex: number;
  currentPageIndex: number;
  chunks: string[];
  pages: Page[];
  setReadingBook: (
    id: number,
    title: string,
    chunks: string[],
    pages: Page[]
  ) => void;
  updatePage: (chunkIndex: number, pageIndex: number) => void;
  clearReading: () => void;
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      currentBookId: null,
      currentBookTitle: '',
      currentChunkIndex: 0,
      currentPageIndex: 0,
      chunks: [],
      pages: [],

      setReadingBook: (id, title, chunks, pages) =>
        set({
          currentBookId: id,
          currentBookTitle: title,
          currentChunkIndex: 0,
          currentPageIndex: 0,
          chunks,
          pages,
        }),

      updatePage: (chunkIndex, pageIndex) =>
        set({
          currentChunkIndex: chunkIndex,
          currentPageIndex: pageIndex,
        }),

      clearReading: () =>
        set({
          currentBookId: null,
          currentBookTitle: '',
          currentChunkIndex: 0,
          currentPageIndex: 0,
          chunks: [],
          pages: [],
        }),
    }),
    {
      name: 'reading-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);
