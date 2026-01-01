// components/HomeScreen/StudyHistoryCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../../components/common/Typography';

export default function StudyHistoryCard() {
  return (
    <View style={styles.card}>
      <Typography variant="subtitle" color="#2f4f4f" weight="600" mb={4}>2024.04.20</Typography>
      <Typography variant="caption" color="#4CAF50" mb={6}>총 25분 학습</Typography>
      <Typography variant="caption" color="#444">
        🔊 발음 3개 • 💡 유사어 2개 • ✍️ 예문 1개
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2f4f4f',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#444',
  },
});
