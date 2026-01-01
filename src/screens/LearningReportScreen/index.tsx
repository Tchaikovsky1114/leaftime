import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useDailyReport } from '../../apis/queries/queries';
import FrequentSentenceCard from './components/FrequentSentenceCard';
import FrequencyWordTag from './components/FrequencyWordTag';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Icons from '../../assets/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SavedSentenceCard from './components/SavedSentenceCard';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FeedbackBottomSheetContent from './components/FeedbackBottomSheetContent';
import { useAddStopwordMutation } from '../../apis/queries/mutations';
import { useAlertStore } from '../../store/alertStore';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../apis/queries/queryKeys';
import { useFeedbackSocket } from '../../hooks/useFeedbackSocket';

import Typography from '../../components/common/Typography';
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="subtitle" color="#388e3c" mt={24} mb={8}>{children}</Typography>
);

type ReportRouteProp = RouteProp<{ params: { date: string } }>;
export type FeedbackType = 'analysis' | 'conversations' | 'wordsAndPhrase' | 'examples';
export default function LearningReportScreen() {
  const route = useRoute<ReportRouteProp>();
  const { date } = route.params;
  const { data: report, isLoading, error } = useDailyReport(date);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [selectedSentence, setSelectedSentence] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState<FeedbackType | null>(null);
  const [stopwordDeleteMode, setStopwordDeleteMode] = React.useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const queryClient = useQueryClient();
  const { show } = useAlertStore();
  const { mutate, isPending } = useAddStopwordMutation();
  const [selectedSentenceId, setSelectedSentenceId] = useState<string | null>(null);
const { result } = useFeedbackSocket(selectedSentence ?? '', selectedSentenceId, selectedType ?? 'analysis', date);
  const insets = useSafeAreaInsets();
const handleInteractionButtonPress = (sentence: string, sentenceId: string, type: FeedbackType) => {
  setSelectedSentence(sentence);
  setSelectedSentenceId(sentenceId);
  setSelectedType(type);
  bottomSheetRef.current?.expand();
  setBottomSheetIndex(1);
};
  const handleStopwordToggle = () => {
    setStopwordDeleteMode((prev) => !prev);
  };

  const handleAddStopword = async (word: string) => {
      mutate({
        word,
        date,
      }, {
        onSuccess: () => {
          show({
            title: '단어 차단 성공',
            message: `${word} 단어가 차단되었습니다.`,
          });

          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.dailyReport(date)});
        },
        onError: () => {
          show({
            title: '단어 차단 실패',
            message: '차단 단어 추가에 실패했습니다. 다시 시도해주세요.',
          });
        },
      });
  };



  if (isLoading || !report) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Typography variant="body" color="#666" mt={12}>리포트를 불러오는 중입니다...</Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Typography variant="body" color="#666" mt={12}>리포트를 불러오는 데 오류가 발생했습니다.</Typography>
      </View>
    );
  }

  const {
    saved_sentences: savedSentences,
    top_sentences: frequentSentences,
    top_words: frequentWords,
    usedInteractions,
  } = report.summary;

  const totalInteractions = Object.values(usedInteractions || {}).reduce(
    (acc, cur) => acc + cur,
    0
  );


  console.log(report);
  return (
    <>
    <View
      style={{ flex: 1, backgroundColor: '#f8fef7', paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <ScrollView style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.introBox}>
          <Typography variant="h2" color="#1b5e20" weight="700" mb={6}>🌿 {report.report_date} 학습 리포트</Typography>
          <Typography variant="body" color="#33691e" mb={6}>오늘도 한 걸음, 영어 감각에 물들었어요 🍃</Typography>
          <Typography variant="caption" color="#4CAF50">
            저장한 문장 {savedSentences.length}개 · 인터렉션 {totalInteractions}회
          </Typography>
        </Animated.View>

        <SectionTitle>📝 저장한 문장 전체 보기</SectionTitle>
        {savedSentences.map((item, idx) => {
          if (typeof item === 'string') {return null;}
          return (
            <Animated.View entering={FadeInDown.delay(idx * 60)} key={`saved-${idx}`}>
              <SavedSentenceCard
                sentence={item.sentence}
                sentenceId={item.id}
                onPressInteraction={handleInteractionButtonPress}
              />
            </Animated.View>
          );
        })}

        <SectionTitle>📌 자주 저장된 문장</SectionTitle>
        {frequentSentences.map((item, idx) => (
          <Animated.View entering={FadeInDown.delay(idx * 100)} key={idx}>
            <FrequentSentenceCard sentence={item.sentence} count={item.count} />
          </Animated.View>
        ))}
        {
          frequentSentences.length === 0 && (
            <Typography variant="body" color="#999" weight="700" align="center" mt={12} mb={12}>오늘은 자주 저장된 문장이 없어요.</Typography>
          )
        }
        <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 8}}>
          <SectionTitle>🌱 자주 등장한 단어</SectionTitle>
          <Pressable onPress={handleStopwordToggle} style={{
            ...styles.stopWordButton,
            backgroundColor: stopwordDeleteMode ? '#4CAF50' : '#f8fef7',
            borderColor: !stopwordDeleteMode ? '#4CAF50' : '#f8fef7',
            }}>
            <Typography variant="caption"
              color={stopwordDeleteMode ? '#fff' : '#4CAF50'}
              weight="700"
            >
              차단 단어 관리
            </Typography>
          </Pressable>
        </View>
        <View style={styles.wordTagWrap}>
        {
                isPending ? (
                  // overlay
                  <View style={styles.wordTagOverlay}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  </View>
                ) : null
              }
          {frequentWords.map((item, idx) => (
            <Animated.View entering={FadeInDown.delay(idx * 80)} key={idx}>

              <FrequencyWordTag
                word={item.word}
                count={item.count}
                onPress={() => {
                  show({
                    title: '차단 단어 추가',
                    message: `${item.word} 를 차단 단어에 추가하시겠어요? \n  앞으로 "자주 등장한 단어" 목록에 ${item.word}는 보이지 않아요!`,
                    onConfirm: () => handleAddStopword(item.word),
                  });
                }}
                stopwordDeleteMode={stopwordDeleteMode}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.nextSection}>
          <Typography variant="body" color="#1b5e20" mb={12}> 내일도 리딩 이어가볼까요? ☀️</Typography>
          <Pressable style={styles.nextButton}>
            <Icons name="book" size={20} color="#fff" />
            <Typography variant="button" color="#fff">오늘 학습 완료하기</Typography>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={['50%', '90%']}
        onChange={(index) => {
          setBottomSheetIndex(index);
        }}
        backdropComponent={(props) => (<BottomSheetBackdrop {...props} pressBehavior="close" />)}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#f8fef7' }}
        handleIndicatorStyle={{ backgroundColor: '#4CAF50' }}
        handleStyle={{ backgroundColor: '#f8fef7' }}
        style={{ borderRadius: 24, padding: 20 }}
      >
        <FeedbackBottomSheetContent
          sentence={selectedSentence}
          type={selectedType}
          onTypeChange={setSelectedType}
          result={result}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fef7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  introBox: { marginBottom: 32, alignItems: 'center' },
  wordTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  nextSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#81C784',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    gap: 6,
  },
  stopWordButton: {
    marginLeft: 8, marginTop: 24,marginBottom: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
  },
  wordTagOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
});


