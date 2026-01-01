// components/HomeScreen/StudyHistoryCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudyHistoryCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>2024.04.20</Text>
      <Text style={styles.time}>총 25분 학습</Text>
      <Text style={styles.detail}>
        🔊 발음 3개 • 💡 유사어 2개 • ✍️ 예문 1개
      </Text>
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
