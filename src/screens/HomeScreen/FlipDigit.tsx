import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,

} from 'react-native-reanimated';

interface FlipDigitProps {
  digit: string;
}

export default function FlipDigit({ digit }: FlipDigitProps) {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [currentDigit, setCurrentDigit] = useState(digit);
  const slideAnim = useSharedValue(0); // 0 → 1 transition

  useEffect(() => {
    if (digit !== currentDigit) {
      setPrevDigit(digit);
      setCurrentDigit(digit);
      slideAnim.value = 0;
      slideAnim.value = withTiming(1, { duration: 800 });
    }
  }, [digit, currentDigit, slideAnim]);

  const prevStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateY: slideAnim.value * 30 }],
    opacity: 1 - slideAnim.value,
  }));

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - slideAnim.value) * -30 }],
    opacity: slideAnim.value,
  }));

  return (
    <View style={styles.digitWrapper}>
      {/* 과거 숫자 */}
      <Animated.Text style={[styles.digit, prevStyle]}>
        {prevDigit}
      </Animated.Text>
      {/* 현재 숫자 */}
      <Animated.Text style={[styles.digit, currentStyle]}>
        {currentDigit}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  digitWrapper: {
    width: 24,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  digit: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2f4f4f',
  },
});
