import React, { useEffect, forwardRef, memo } from 'react';
import { Dimensions, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import { Page, useReadingStore } from '../../../store/readingStore';
import { RenderItemMemo } from './RenderItem';
import { useReadingSelectionStore } from '../../../store/readingSelectionStore';

interface Props {
  onInstantInteraction: () => Promise<void>;
  translateLoading: boolean;
  pages: Page[];
}

const { width } = Dimensions.get('window');
const PAGE_WIDTH = width;
const PAGE_GAP = 0;


const ReaderScreenAnimated = forwardRef<FlatList<any | undefined>, Props>(
(({ onInstantInteraction, translateLoading, pages }, ref) => {
  const {
    currentChunkIndex,
    currentPageIndex,
    updatePage,
  } = useReadingStore();

  const scrollX = useSharedValue(0);
  const { toggleWord, currentSelection } = useReadingSelectionStore();
  const showCompleteOpacity = useSharedValue(0);

  // 📘 오늘 목표 기준 계산
  const todayPages = pages.filter((p) => p.chunkIndex === currentChunkIndex);
  const todayTotal = todayPages.length;
  const todayLast = todayPages[todayTotal - 1];

  const isLastPageOfToday =
    todayLast?.chunkIndex === currentChunkIndex &&
    todayLast?.pageIndex === currentPageIndex;

    const handleMomentumEnd = (e: any) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / PAGE_WIDTH);
      const page = pages[index];
      console.log('index', index);
      console.log('page', page);
      if (page) {
        updatePage(page.chunkIndex, page.pageIndex); // ✅ chunkIndex는 유지, pageIndex만 업데이트
      }
    };
  useEffect(() => {
    if (isLastPageOfToday) {
      showCompleteOpacity.value = withTiming(1, { duration: 600 });
    } else {
      showCompleteOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isLastPageOfToday, showCompleteOpacity]);

  const handleWordPress = (index: number) => {
    toggleWord(index);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.FlatList
      ref={ref}
      data={pages}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item, index }) => (
        <RenderItemMemo
          item={item}
          index={index}
          scrollX={scrollX}
          currentSelection={currentSelection}
          handleWordPress={handleWordPress}
          onInstantInteraction={onInstantInteraction}
          translateLoading={translateLoading}
        />
      )}
      pagingEnabled
      snapToInterval={PAGE_WIDTH}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: PAGE_GAP }}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      onMomentumScrollEnd={handleMomentumEnd}
    />
  );
}));

export default memo(ReaderScreenAnimated);
