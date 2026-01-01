// src/screens/BookListScreen/BookCard.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import FallbackImage from '../../components/common/FallbackImage';
import { Book } from '../BookListScreen';
import Typography from '../../components/common/Typography';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [expanded, setExpanded] = useState(false);

  const coverUrl = book.cover_image || null;
  const tags = Array.isArray(book.subject) ? book.subject.slice(0, 4) : [];
  const readingLevel = useCallback(() => {
    if (book.reading_level === '0') {
      return 'Recommended';
    } else if (book.reading_level === '1') {
      return 'Beginner';
    } else if (book.reading_level === '2') {
      return 'Intermediate';
    } else {
      return '';
    }
  },[book.reading_level]);
  const readingLevelColor = useCallback(() => {
    if (book.reading_level === '0') {
      return { backgroundColor: '#e0f2f1', textColor: '#00796b' };
    } else if (book.reading_level === '1') {
      return { backgroundColor: '#e8eaf6', textColor: '#3949ab' };
    } else if (book.reading_level === '2') {
      return { backgroundColor: '#f3e5f5', textColor: '#8e24aa' };
    } else {
      return { backgroundColor: '#eeeeee', textColor: '#777' };
    }
  },[book.reading_level]);
  // console.log('BookCard:', book);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <FallbackImage uri={coverUrl} style={styles.cover} resizeMode="stretch" />
        <View style={styles.info}>
          <Typography variant="subtitle" color="#2e7d32" weight="600" mb={4}>{book.ko_title}</Typography>
          <Typography variant="caption" weight="500" mb={4}>{book.title}</Typography>
          <Typography variant="caption" color="#666">{book.author}</Typography>
          {/* <Text style={styles.download}>📅 Published: {book.date}</Text> */}
          <View style={styles.readingLevelWrapper}>
  {readingLevel() !== '' && (
    <Animated.View style={[styles.readingLevelTag, { backgroundColor: readingLevelColor().backgroundColor, transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
    <Animated.Text style={[styles.readingLevelText, { color: readingLevelColor().textColor }]}>
      {readingLevel()}
    </Animated.Text>
  </Animated.View>
  )}
</View>
        </View>
      </View>

        <TouchableOpacity onPress={() => setExpanded((prev) => !prev)} style={styles.toggle}>
          <Typography variant="caption" color="#4CAF50">{expanded ? '접기 ▲' : '자세히 보기 ▼'}</Typography>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <Typography variant="body" color="#444">📖 {book.ko_description}</Typography>
          <Typography variant="caption" color="#666" mb={10}>📖 {book.description}</Typography>
          <View style={styles.tags}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Typography variant="caption" color="#2e7d32">{tag}</Typography>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfaf3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: 'row', gap: 12 },
  cover: { width: 80, height: 110, borderRadius: 4 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  enTitle: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  author: { fontSize: 14, color: '#666' },
  download: { fontSize: 13, color: '#999', marginTop: 4 },
  toggle: { marginTop: 10 },
  toggleText: { fontSize: 14, color: '#4CAF50' },
  details: { marginTop: 10 },
  summary: { fontSize: 14, color: '#444', marginBottom: 4 },
  enSummary: { fontSize: 14, color: '#666', marginBottom: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tagText: { fontSize: 12, color: '#2e7d32' },
  readingLevelWrapper: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  readingLevelTag: {
    backgroundColor: '#e0f2f1', // 연한 민트 (자연 느낌)
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },

  readingLevelText: {
    fontSize: 12,
    color: '#00796b', // 약간 진한 청록색
    fontWeight: '600',
  },
});
