import { useReadingSelectionStore } from '../store/readingSelectionStore';
import { useReadingStore } from '../store/readingStore';

const useSaveSentencePage = () => {
  const { currentChunkIndex, currentPageIndex, pages } = useReadingStore();
  const { addSelectedSentence } = useReadingSelectionStore();

  const saveCurrentPageSentence = () => {
    const page = pages.find(
      (p) =>
        p.chunkIndex === currentChunkIndex &&
        p.pageIndex === currentPageIndex
    );
    if (!page) {return;}

    const sentence = page.words.map((w) => w.text).join(' ').trim();
    if (sentence.length > 0) {
      addSelectedSentence(sentence);
    }
  };

  return saveCurrentPageSentence;
};

export default useSaveSentencePage;
