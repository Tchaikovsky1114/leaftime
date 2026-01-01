import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import Icons from '../../../assets/Icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FeedbackType } from '..';

const captions = [
  '클릭해보면 더 많은 이야기를 들려줄 거예요 🌿',
  '작은 배움이 숨어 있어요. 클릭해볼까요? ✨',
  '조금 더 가까이 다가가면 새로운 의미가 보여요 🍃',
  '살짝 눌러보면 배움의 문이 열릴지도 몰라요 🔍',
  '그냥 지나치기엔 아까운 문장이에요! 클릭해볼까요? 🌼',
  '당신만의 방식으로 더 느껴보세요 🌱',
  '클릭으로 더 깊이 이해해보세요! 🌈',
];

function getDeterministicIndex(input: string, length: number) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % length;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const BUTTON_SIZE = (width - 32) / 3;

interface Props {
  sentence: string;
  sentenceId: string;
  onPressInteraction: (sentence: string, sentenceId: string, type: FeedbackType) => void;
}



export default function SavedSentenceCardWithFlip({ sentence, sentenceId, onPressInteraction }: Props) {
  const [flipped, setFlipped] = useState(false);
  const toggleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const caption = useMemo(() => {
    return captions[getDeterministicIndex(sentence, captions.length)];
  }, [sentence]);

  return (
    <Pressable style={styles.card} onPress={toggleFlip} hitSlop={10}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Icons name="leaf" size={16} color="#4CAF50" />
        <Text style={styles.sentenceText}>{sentence}</Text>
      </View>
      {!flipped && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.front} pointerEvents="auto">
          <Pressable onPress={toggleFlip}>
            <Text style={styles.caption}>{caption}</Text>
          </Pressable>
        </Animated.View>
      )}
      {flipped && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(50)} style={styles.back} pointerEvents="auto">
          <View style={styles.actions}>
            <InteractionBox title="분석해요" label="이 문장, 꼼꼼히 분석해볼까요?" onPress={() => onPressInteraction(sentence, sentenceId, 'analysis')} />
            <InteractionBox title="대화해요" label="일상 속 대화체로 바꿔 볼까요?" onPress={() => onPressInteraction(sentence, sentenceId, 'conversations')} />
            <InteractionBox title="정리해요" label="단어 및 표현을 정리 해 드릴게요!" onPress={() => onPressInteraction(sentence, sentenceId, 'wordsAndPhrase')} />
            <InteractionBox title="익혀봐요" label="비슷한 예문을 보고 감각을 익혀요!" onPress={() => onPressInteraction(sentence, sentenceId, 'examples')} />
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}

interface IBProps {
  title: string; // e.g. "문장분석"
  label: string; // e.g. "이 문장의 속뜻을 알려드려요 🌿"
  isFollowUp?: boolean;
  onPress: () => void;
}

function InteractionBox({ title, label, isFollowUp = false, onPress }: IBProps) {
  return (
    <Pressable
      style={[styles.button, isFollowUp && styles.followUpButton]}
      onPress={onPress}
    >
      <Text style={[styles.title, isFollowUp && styles.followUpTitle]}>{title}</Text>
      <Text style={[styles.label, isFollowUp && styles.followUpLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f1f8e9',
    borderLeftWidth: 4,
    borderLeftColor: '#81c784',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginBottom: 4,
  },
  front: {
    width: '100%',
  },
  back: {
    width: '100%',
  },
  sentenceText: {
    fontSize: 15,
    color: '#2e7d32',
    fontFamily: 'Georgia',

  },
  caption: {
    fontSize: 12,
    color: '#558b2f',
    fontStyle: 'italic',
    fontFamily: 'Georgia',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 8,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: '#fdfdfd',
    borderColor: '#388E3C',
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B5E20',
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#2E7D32',
    fontFamily: 'Georgia',
    textAlign: 'center',
    fontWeight: '400',
  },
  followUpButton: {
    borderColor: '#7B1FA2',
  },
  followUpTitle: {
    color: '#4A148C',
  },
  followUpLabel: {
    color: '#6A1B9A',
  },
});
