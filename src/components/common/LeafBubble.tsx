import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// import { useReadingSelectionStore } from '../../store/readingSelectionStore';
import Icons from '../../assets/Icons';

interface LeafBubbleProps {
  text: string | null;
  translateTarget: string;
  onSave: (sentence: string) => void;
  onCancel: () => void;
}

export default function LeafBubble({
  text,
  translateTarget,
  onSave,
  onCancel,
}: LeafBubbleProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  // const { currentSelection } = useReadingSelectionStore();

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: text ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!text) {return null;}

  return (
    <Animated.View style={[styles.bubble, { opacity }]}>
      <Text style={styles.translation}>
        <Text style={styles.targetLabel}>{translateTarget}</Text>
        <Text style={styles.separator}> → </Text>
        <Text style={styles.resultText}>{text}</Text>
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(text)}>
          <Icons name="save-outline" size={18} color="#2e7d32" />
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.saveBtn}>
          <Icons name="refresh" size={18} color="#2e7d32" />
          <Text style={styles.saveText}>취소</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#f1f8e9',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  translation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e7d32',
    marginBottom: 12,
  },
  targetLabel: {
    fontWeight: '700',
    color: '#33691e',
  },
  separator: {
    color: '#4caf50',
    fontWeight: '500',
  },
  resultText: {
    fontWeight: '500',
    color: '#1b5e20',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    paddingVertical: 6,

    borderRadius: 16,
  },
  saveText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 14,
  },
  undoBtn: {
    padding: 6,
  },
});
