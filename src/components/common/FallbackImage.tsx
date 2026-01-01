import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Animated,
  StyleProp,
  ImageStyle,
  StyleSheet,
} from 'react-native';

type FallbackImageProps = {
  uri: string | null;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
};

const FallbackImage: React.FC<FallbackImageProps> = ({
  uri,
  style,
  resizeMode = 'cover',
}) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;

  const fallbackSource = require('../../assets/images/fallback.png');
  const isFallback = !uri || hasError;

  useEffect(() => {
    if (isFallback) {
      // fallback일 경우 직접 fade-in + loading false 처리
      setLoading(false);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isFallback]);

  const onImageLoad = () => {
    setLoading(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View style={[styles.wrapper, style]}>
      {loading && (
        <Animated.View
          style={[
            styles.skeleton,
            {
              opacity: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        />
      )}

      <Animated.Image
        source={isFallback ? fallbackSource : { uri }}
        style={[StyleSheet.absoluteFill, style, { opacity }]}
        resizeMode={resizeMode}
        onLoadStart={() => {
          if (!isFallback) {
            setLoading(true);
            setHasError(false);
          }
        }}
        onLoad={onImageLoad}
        onError={() => {
          setHasError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fbef',
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
});

export default memo(FallbackImage);
