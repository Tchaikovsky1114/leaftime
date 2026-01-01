import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootNavigation } from '../../navigation/types';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: 'slide1',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    key: 'slide2',
    image: require('../../assets/images/onboarding2.png'),
  },
  {
    key: 'slide3',
    image: require('../../assets/images/onboarding3.png'),
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RootNavigation>();
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem = ({ item }: {
    item: { key: string; image: any };
  }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="stretch" />

    </View>
  );

  // Fade-in animation for "시작하기" button on last slide
  const showButton = useDerivedValue(() => {
    return scrollX.value >= (slides.length - 1) * width ? 1 : 0;
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showButton.value, { duration: 400 }),
      position: 'absolute',
      bottom: insets.bottom + 8 ,
      left: 0,
      right: 0,
    };
  });

  return (
    <View style={[styles.container]}>
      <Animated.FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <Animated.View style={[buttonAnimatedStyle]}>
        <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('PhoneInput')}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Login')}
          style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 48,
          borderRadius: 30,

          }}
        >
        <Text style={styles.loginText}>이미 계정이 있으신가요? <Text style={{ fontWeight: 'bold',color: '#197b1c' }}>로그인</Text></Text>
      </TouchableOpacity> */}
      </Animated.View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,

  },
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    width: Dimensions.get('screen').width,
    fontSize: 36,
    lineHeight: 48,
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2f6c31',
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 24,

    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
  },
});
