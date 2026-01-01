import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Icons from '../../../assets/Icons';
import Typography from '../../../components/common/Typography';

interface Props {
  word: string;
  count: number;
  onPress?: () => void;
  stopwordDeleteMode?: boolean;
}

export default function FrequencyWordTag({ word, count, onPress, stopwordDeleteMode }: Props) {
  return (

      <View style={styles.tag}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="body" color="#1b5e20" weight="500">{word}</Typography>
        <Typography variant="caption" color="#388e3c">×{count}</Typography>
        </View>
        {
          stopwordDeleteMode ?
        <Pressable onPress={onPress} >
          <Icons name="trash-outline" size={16} color="#ff0000" />
        </Pressable> : null}
      </View>

  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    backgroundColor: '#c8e6c9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    gap: 8,
  },
  text: {
    fontSize: 14,
    color: '#1b5e20',
    fontWeight: '500',
    fontFamily: 'Georgia',
    marginRight: 4,
  },
  count: {
    fontSize: 13,
    color: '#388e3c',
    fontFamily: 'Georgia',
  },
});
