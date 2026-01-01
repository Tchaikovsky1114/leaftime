import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../components/common/Typography';

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
        <Typography variant="subtitle" color="#007AFF" onPress={() => navigation.goBack()}>{'< 뒤로가기'}</Typography>
      </View>
      <Typography variant="h2" weight="600" color="#333" mb={12}>📚 북마크한 내용</Typography>
      <FlatList
        data={dummyBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookmarkItem}>
            <Typography variant="body" color="#444">{item.title}</Typography>
          </View>
        )}
        ListEmptyComponent={
          <Typography align="center" color="#aaa" mt={32}>북마크된 항목이 없습니다.</Typography>
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
  bookmarkItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
