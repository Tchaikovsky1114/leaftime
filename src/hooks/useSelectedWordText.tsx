import { useReadingSelectionStore } from '../store/readingSelectionStore';
import { useReadingStore } from '../store/readingStore';

export const useSelectedWordText = () => {
  const { currentSelection } = useReadingSelectionStore();
  const { currentChunkIndex, currentPageIndex, pages } = useReadingStore();

  return () => {
    const page = pages.find(
      (p) =>
        p.chunkIndex === currentChunkIndex &&
        p.pageIndex === currentPageIndex
    );
    if (!page) {return '';}

    return currentSelection
      .map((i) => page.words[i]?.text)
      .filter(Boolean)
      .join(' ')
      .trim();
  };
};
