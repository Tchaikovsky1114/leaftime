import React, { useMemo, useCallback, useState, memo, useEffect } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
  Extrapolation,
  withTiming,
  useSharedValue,

} from 'react-native-reanimated';
import { Word } from '../../../store/readingStore';
import { useReadingSelectionStore } from '../../../store/readingSelectionStore';
import { getSentenceBoundaryIndexes } from '../../../util/getSentenceBoundary';
import Icons from '../../../assets/Icons';

const PAGE_WIDTH = Dimensions.get('window').width;

interface Page {
  words: Word[];
}

interface Props {
  item: Page;
  index: number;
  scrollX: SharedValue<number>;
  currentSelection: number[];
  translateLoading: boolean;
  handleWordPress: (i: number) => void;
  onInstantInteraction: () => Promise<void>;
}

function RenderItem({
  item,
  index,
  scrollX,
  currentSelection,
  translateLoading,
  handleWordPress,
  onInstantInteraction,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * PAGE_WIDTH, index * PAGE_WIDTH, (index + 1) * PAGE_WIDTH],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const selectionSet = useMemo(() => new Set(currentSelection), [currentSelection]);

  const setCurrentSelection = useReadingSelectionStore((s) => s.setCurrentSelection);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [showButton, setShowButton] = useState(-1);
  const isVisible = useSharedValue(0); // 0이면 안보임, 1이면 보임
  const handleLongPress = useCallback(
    (wordIndex: number) => {
      const indexes = getSentenceBoundaryIndexes(item.words, wordIndex);
      setCurrentSelection(indexes);
      setShowButton(wordIndex);
    },
    [item.words, setCurrentSelection]
  );

  const handleInstantInteraction = () => {
    onInstantInteraction();
  };


  const instantButtonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value, { duration: 600 }),
  }));

  useEffect(() => {
    if(currentSelection.length === 0){
      setShowButton(-1);
      setButtonPos(null);
    } else {
      // currentSelection의 가장 큰 값을 setShowButton에 저장
      const maxIndex = Math.max(...currentSelection);
      setShowButton(maxIndex);
      setButtonPos({ x: 0, y: 30 });
    }

  },[currentSelection]);




  useEffect(() => {
    isVisible.value = withTiming(currentSelection.length > 0 ? 1 : 0, { duration: 500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelection.length]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  return (
    <Animated.View style={[styles.pageContainer, animatedStyle]}>
      <ScrollView
        contentContainerStyle={styles.textContainer}
        onScroll={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          const reachedBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;
          setIsAtBottom(reachedBottom);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.lineWrap}>
          {item.words.map((word, i) => {
            if (word.isLineBreak) {
              return <View key={`br-${i}`} style={styles.lineBreak} />;
            }

            const isSelected = selectionSet.has(i);

            return (
              <Pressable
                key={`${word.text}-${i}`}
                onPress={() => {
                  handleWordPress(i);
                }}
                onLongPress={() => handleLongPress(i)}
                delayLongPress={300}
                style={{ position: 'relative' }}
              >
                <View style={{ position: 'relative' }}>
                  {showButton === i && buttonPos && currentSelection.length > 0 && (
                    <Animated.View
                      style={[
                        styles.translateButton,
                        instantButtonStyle,
                        {
                          top: buttonPos.y,
                          left: buttonPos.x,
                        },
                      ]}
                    >
                      <Pressable style={styles.buttonInner} onPress={handleInstantInteraction}>
                        {
                          translateLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>🍃 번역</Text>
                        }

                      </Pressable>
                    </Animated.View>
                  )}

                  <Text
                    style={[
                      styles.word,
                      isSelected && styles.highlighted,
                      word.isEmphasized && styles.emphasized,
                      word.isItalic && styles.italic,
                      word.isBracketed && styles.bracketed,
                    ]}
                  >
                    {word.text + ' '}
                  </Text>
                </View>
              </Pressable>
            );
          })}

        </View>
      </ScrollView>
      {!isAtBottom && (
  <View style={styles.readMoreHint}>
    <Text style={styles.readMoreText}>
      More
    </Text>
    <Icons name="arrow-down" size={16} color="#388E3C" />
  </View>
)}
    </Animated.View>
  );
}

export const RenderItemMemo = memo(RenderItem);

const styles = StyleSheet.create({
  pageContainer: {
    position: 'relative',
    width: PAGE_WIDTH,
    paddingBottom: 40,
  },
  textContainer: {
    paddingTop: 20,
    paddingRight: 40,
    paddingLeft: 8,
  },
  lineWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    rowGap: 16.8,
  },
  word: {
    fontSize: 18,
    lineHeight: 32,
    color: '#2e3d2f',
    letterSpacing: 0.2,
    textAlign: 'left',
    fontFamily: 'Georgia',
    zIndex: 1,
  },
  italic: {
    fontStyle: 'italic',
  },
  highlighted: {
    backgroundColor: '#d0eadd',
    borderRadius: 4,
  },
  lineBreak: {
    width: '100%',
    height: 12,
  },
  bracketed: {
    fontStyle: 'italic',
  },
  emphasized: {
    fontWeight: '400',
    color: '#555',
    fontStyle: 'italic',
    fontSize: 14,
    letterSpacing: 0,
  },
  translateButton: {
    position: 'absolute',
    width: 80,
    height: 32,
    zIndex: 4,
  },
  buttonInner: {

    backgroundColor: '#558B2F',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  readMoreHint: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
    width: 100,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    left: (PAGE_WIDTH - 100) / 2 - 16,
    opacity: 0.6,
  },

  readMoreText: {
    // backgroundColor: 'rgba(76,175,80,0.1)',
    color: '#388E3C',
    fontSize: 13,
    paddingVertical: 4,
    paddingHorizontal: 4,
    // fontFamily: 'italic',
  },
});
