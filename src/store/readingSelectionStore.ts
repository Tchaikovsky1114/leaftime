// src/store/readingSelectionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadingSelectionState {
  currentSelection: number[];
  selectedSentences: string[]
  setCurrentSelection: (indexes: number[]) => void;
  toggleWord: (index: number) => void;
  addSelectedSentence: (sentence: string) => void;
  clearSelections: () => void;
  clearCurrentSelection: () => void;
}

export const useReadingSelectionStore = create<ReadingSelectionState>()(
  persist(
    (set, get) => ({
      currentSelection: [],
      selectedSentences: [],
      setCurrentSelection: (indexes) => set({ currentSelection: indexes }),
      toggleWord: (index) => {
        const prev = get().currentSelection;
        const next = prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index];
        set({ currentSelection: next });
      },
      addSelectedSentence: (sentence) => {
        const { selectedSentences } = get();
          set({
            selectedSentences: [...selectedSentences, sentence],
            currentSelection: [],
          });
      },
      clearCurrentSelection: () => set({ currentSelection: [] }),
      clearSelections: () => set({ currentSelection: [], selectedSentences: [] }),
    }),
    { name: 'leaftime-reading-selection' }
  )
);
