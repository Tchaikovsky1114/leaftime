import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, UIManager, Platform } from 'react-native';
import Icons from '../../../assets/Icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FrequentSentenceCardProps {
  sentence: string;
  count: number | null;
}

export default function FrequentSentenceCard({ sentence, count }: FrequentSentenceCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <Pressable style={styles.card} onPress={toggleExpanded}>
      <Text style={styles.sentenceText}>{sentence}</Text>
      <View style={styles.footer}>
        {count && <Text style={styles.countText}>저장 {count}회</Text>}
        <Icons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#4CAF50" />
      </View>

      {expanded && (
        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>문장 분석</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>예문 생성</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>단어 풀이</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  sentenceText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: '#2e3d2f',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  countText: {
    fontSize: 13,
    color: '#689f38',
    fontFamily: 'Georgia',
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#a5d6a7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionText: {
    color: '#1b5e20',
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
});
