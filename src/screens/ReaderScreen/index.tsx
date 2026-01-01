import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReadingStore } from '../../store/readingStore';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
// import { useAlertStore } from '../../store/alertStore';
import ReaderScreenAnimated from './components/ReaderScreenAnimated';
import { useReadingSelectionStore } from '../../store/readingSelectionStore';
import { api } from '../../apis/auth/fetcher';
import { useNavigation } from '@react-navigation/native';
import { RootNavigation } from '../../navigation/types';
import { useSelectedWordText } from '../../hooks/useSelectedWordText';
import { useInstantTranslate } from '../../hooks/useInstantTranslate';
import LeafBubble from '../../components/common/LeafBubble';
import { usePromptStore } from '../../store/promptStore';
import { repeatReadingRound } from '../../apis/reading/fetcher';
import { useTimerStore } from '../../store/useTimerStore';
import { FlatList } from 'react-native-gesture-handler';
import { joinWordsFromIndexes } from '../../util/joinWordsFromIndexes';
import Icons from '../../assets/Icons';
import dayjs from 'dayjs';
import Typography from '../../components/common/Typography';

export default function ReaderScreen() {
  const {
    currentBookId,
    currentBookTitle: title,
    currentChunkIndex,
    currentPageIndex,
    pages,
    updatePage,
  } = useReadingStore();
  const getSelectedText = useSelectedWordText();
const { translate,translatedText, clearTransaltedText,loading: translateLoading } = useInstantTranslate();
const { show:promptShow } = usePromptStore();
const {setRunning} = useTimerStore();
  const {addSelectedSentence,clearCurrentSelection,selectedSentences,clearSelections} = useReadingSelectionStore();
  const insets = useSafeAreaInsets();
  const [saveStatus, setSaveStatus] = useState('');
  const navigation = useNavigation<RootNavigation>();
  const flatListRef = useRef<FlatList>(null);
  // const {show} = useAlertStore();
  // 📚 오늘 목표 chunk에 해당하는 pages
  const todayPages = pages.filter((p) => p.chunkIndex === currentChunkIndex);
  const todayTotalPages = todayPages.length;
  const todayLastPage = todayPages[todayTotalPages - 1];

  // 📚 오늘 목표 내 현재 페이지
  const currentPageNumberInToday = todayPages.findIndex(
    (p) => p.chunkIndex === currentChunkIndex && p.pageIndex === currentPageIndex
  ) + 1;

  const isLastPageOfToday =
    todayLastPage?.chunkIndex === currentChunkIndex &&
    todayLastPage?.pageIndex === currentPageIndex;

  const page = pages.find(
    (p) => p.chunkIndex === currentChunkIndex && p.pageIndex === currentPageIndex
  );

  const progressWidth = useSharedValue(0);

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value * 100}%`,
    };
  });


  useEffect(() => {
    if (todayTotalPages > 0) {
      const ratio = currentPageNumberInToday / todayTotalPages;
      progressWidth.value = withTiming(ratio, { duration: 400 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageNumberInToday, todayTotalPages]);


  const completeButtonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isLastPageOfToday ? 1 : 0, { duration: 2000 }),
  }),[isLastPageOfToday]);

  useEffect(() => {
    clearCurrentSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChunkIndex, currentPageIndex]);
  const saveStatusOpacity = useSharedValue(0);

  const feedbackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: saveStatusOpacity.value,
    transform: [{ translateY: withTiming(saveStatusOpacity.value ? 0 : 20) }],
  }));




  const handleSaveSentence = () => {
    const { currentSelection, addSelectedSentence, clearCurrentSelection } = useReadingSelectionStore.getState();

    if (currentSelection.length === 0 || !page) {return;}

    const sentenceText = joinWordsFromIndexes(page.words, currentSelection);

    addSelectedSentence(sentenceText);
    clearCurrentSelection(); // 저장 후 선택 초기화

    setSaveStatus(sentenceText);
    saveStatusOpacity.value = withTiming(1, { duration: 300 });

    setTimeout(() => {
      saveStatusOpacity.value = withTiming(0, { duration: 500 });
    }, 2000);
  };

  const onStudyComplete = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    try {
      // ✅ 1. /complete-chunk API 호출
      const completeRes = await api('/complete-chunk', {
        method: 'POST',
        body: JSON.stringify({
          bookId: currentBookId,
          currentChunkIndex,
          currentPageIndex,
        }),
      });

      if (!completeRes.ok) {
        throw new Error(await completeRes.text());
      }

      // ✅ 2. (추후) 저장한 문장도 전송할 준비
      if (selectedSentences.length > 0) {
        try {
          const saveRes = await api('/reports/upsert-sentences', {
            method: 'POST',
            body: JSON.stringify({
              bookId: currentBookId,
              sentences: selectedSentences,
              chunkIndex: currentChunkIndex,
            }),
          });

          if (!saveRes.ok) {
            throw new Error(await saveRes.text());
          }
        } catch (error) {
          console.error('🔥 문장 저장 오류', error);
        }

        // 리포트 생성은 save-sentences와 통합
        // try {
        //   await api('/reports/generate-daily', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       date: today, // '2025-05-02'
        //     }),
        //   });
        // } catch (error) {
        //   console.error('🔥 일일 리포트 생성 오류', error);
        // }
      }
      clearSelections();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LearningReportScreen',
            params: { date: today },
          },
        ],
      });

    } catch (err) {
      console.error('🔥 학습 완료 오류', err);
    } finally {
      setRunning(false);
    }
  };

  const handleRepeatRound = async () => {
    if(!currentBookId) {
      return;
    }
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    await repeatReadingRound(currentBookId, currentChunkIndex);
    clearCurrentSelection();
    updatePage(currentChunkIndex, 0);


  };
  const handleCompleteStudy = () => {
    promptShow(
      '오늘의 리프를 모두 읽었습니다! 🍃',
      '지금까지 N번 읽었어요!',
      `오늘의 리프를 한 번 더 읽어볼까요? 
      회차를 반복할 때, 저장한 문장들을 기억해보세요!
      기억 속에 자연스럽게 자리 잡을 거예요! 🪴`,
      [
        { label: '한 번 더 읽기', onPress: () => handleRepeatRound() },
        { label: '학습 완료', onPress: () => onStudyComplete() },
        { label: '닫기', onPress: () => {} },
      ]
    );
  };

const onInstantInteraction = useCallback(async () => {
  const text = getSelectedText();
  if (!text) {return;}
  await translate(text); // LeafBubble로 전달됨
}, [getSelectedText, translate]);

if (!pages.length || !page) {
  return (
    <SafeAreaView style={styles.centered}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Typography variant="body" color="#666" mt={12}>페이지를 불러오는 중입니다...</Typography>
    </SafeAreaView>
  );
}
  return (
      <ImageBackground
      style={[styles.container, { paddingBottom: insets.bottom + 20,paddingTop: insets.top + 20}]}
        source={require('../../assets/images/background-texture.png')}
        resizeMode="stretch"
        >
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
        </View>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
      <Typography variant="h2" color="#1b5e20" weight="700" mb={12}>『{title}』</Typography>
    </View>
    <ReaderScreenAnimated
    ref={flatListRef}
    onInstantInteraction={onInstantInteraction}
    translateLoading={translateLoading}
    pages={todayPages}
    />


      <View style={{ marginVertical: 12, alignItems: 'center',gap: 8 }}>
      <Animated.View style={completeButtonStyle}>
          <Pressable style={styles.completeButton} onPress={handleCompleteStudy}>
            <Typography variant="button" color="#fff">🌸 학습 완료</Typography>
          </Pressable>
      </Animated.View>
        <View style={styles.saveWrapper}>
          <Pressable style={styles.saveButton} onPress={handleSaveSentence}>
            <Icons name="archive-sharp" size={20} color="#fff" />
            <Typography variant="body" color="#fff" weight="700">선택한 문장 저장하기 </Typography>

          </Pressable>
          <Typography variant="caption" color="#4CAF50" italic weight="900">총 {selectedSentences.length}개 저장됨</Typography>
        </View>
        <Animated.View style={[styles.feedbackBox, feedbackAnimatedStyle]}>
          <Typography variant="caption" color="#2e7d32" align="center">
            🍃 "{saveStatus}" 저장했어요!
          </Typography>
        </Animated.View>
          <View style={styles.nav}>
            <Typography variant="caption" color="#555">
              {currentPageNumberInToday} / {todayTotalPages}
          </Typography>
        </View>
      </View>

      <LeafBubble
      translateTarget={getSelectedText()}
      text={translatedText}
      onSave={() => {
        const originalText = getSelectedText(); // ✅ 영어 원문만 저장
        if (originalText) {
          addSelectedSentence(originalText);
        }
        clearCurrentSelection();
        clearTransaltedText();
      }}
        onCancel={() => {
          clearCurrentSelection();
          clearTransaltedText();
        }}
      />
      </ImageBackground>

  );
}

const styles = StyleSheet.create({

  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  title: {
    // moved to Typography: fontSize/weight/fontFamily
    marginBottom: 12,
    color: '#1b5e20',
  },
  textWrapper: { paddingBottom: 40 },
  completeButton: {

    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#9575CD',  // 따뜻한 라벤더 계열 (보라빛 자연)

    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },

  // completeText handled by Typography
  saveStatus: {
    marginTop: 8,
    color: '#1b5e20',
    fontWeight: '500',
  },
  nav: {

    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: { color: '#555', fontSize: 14 },
  buttons: { flexDirection: 'row', gap: 16 },
  navButton: { color: '#4CAF50', fontWeight: '600', fontSize: 16 },
  disabledButton: {
    color: '#bbb',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4CAF50',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    marginTop: 8,
    marginBottom: 40,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#4CAF50',
  },
  feedbackBox: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#f0f4ec',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  // feedbackText handled by Typography
  saveWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#108716',  // 부드러운 자연 녹색 (기존보다 밝고 따뜻하게)
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },

  // saveText handled by Typography

  // savedCountText handled by Typography
  instantButtonWrapper: {
    position: 'absolute',
    bottom: 200, // ✨ 저장 버튼 위에 살짝 떠 있게
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 20,
  },
  instantButton: {
    backgroundColor: '#558B2F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  // instantButtonText handled by Typography
  instantTranslateButton: {
    backgroundColor: '#558B2F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
});
