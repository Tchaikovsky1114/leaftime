import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyBookmarks = [
  { id: '1', title: 'Chapter 1 - Alice in Wonderland' },
  { id: '2', title: 'A quote you saved from Pride and Prejudice' },
  { id: '3', title: 'The Great Gatsby - Highlighted passage' },
];

export default function BookMarksScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <View style={{ marginBottom: 16 }}>
        <Text
          onPress={() => navigation.goBack()}
          style={{ fontSize: 18, color: '#007AFF' }}
        >
          {'< 뒤로가기'}
        </Text>
      </View>
      <Text style={styles.header}>📚 북마크한 내용</Text>
      <FlatList
        data={dummyBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookmarkItem}>
            <Text style={styles.bookmarkText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>북마크된 항목이 없습니다.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
    padding: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '600',
    color: '#333',
  },
  bookmarkItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookmarkText: {
    fontSize: 16,
    color: '#444',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#aaa',
  },
});
