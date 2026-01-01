import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookCard from './BookListScreen/BookCard';
import StartReadingModal from '../components/StartReadingModal';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icons from '../assets/Icons';
import { TextInput } from 'react-native-gesture-handler';
import { startReading } from '../apis/reading/fetcher';
import { useAlertStore } from '../store/alertStore';
import { useTimerStore } from '../store/useTimerStore';
import { RootNavigation } from '../navigation/types';
import { BASE_URL } from '../apis/auth/fetcher';
import Typography from '../components/common/Typography';

export interface Book {
  _id: number;
  title: string;
  author: string;
  cover_image: string;
  subject: string[];
  description: string;
  date: string;
  text_url: string;
  reading_level?: '0' | '1' | '2' | '3' | '4' | '5';
  ko_title?: string;
  ko_description?: string;

}

export default function BookListScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [inputVisible, setInputVisible] = useState(false);
const [inputText, setInputText] = useState('');
const {show} = useAlertStore();
const {setRunning} = useTimerStore();
const confirmPageInput = () => {

  const parsed = parseInt(inputText);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
    setPage(parsed);
  }
  setInputVisible(false);
  setInputText('');
};
  const navigation = useNavigation<RootNavigation>();


  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/books?page=${page}&limit=5`);
      setBooks(res.data.data);
      setTotalPages(res.data.meta.lastPage);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <BookCard book={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="h2" weight="700">📚 도서 선택</Typography>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          style={{ marginTop: 16 }}
          data={books}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
        />
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          style={[styles.pageBtn, page === 1 && styles.disabledBtn]}
          disabled={page === 1}
        >
          <Icons name="arrow-back" size={18} color={page === 1 ? '#9E9E9E' : '#2E7D32'} />

        </TouchableOpacity>
        <Pressable style={styles.pageIndicator} onPress={() => setInputVisible(true)}>
          <Typography variant="caption" weight="600" color="#388E3C">📄 {page} / {totalPages}</Typography>
        </Pressable>


        <TouchableOpacity
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          style={[styles.pageBtn, page === totalPages && styles.disabledBtn]}
          disabled={page === totalPages}
        >
            <Icons name="arrow-forward" size={18} color={page === totalPages ? '#9E9E9E' : '#2E7D32'} />
        </TouchableOpacity>
      </View>

      <StartReadingModal
        visible={modalVisible}
        bookTitle={selectedBook?.title}
        onClose={() => setModalVisible(false)}
        onStart={async () => {
          if (!selectedBook) {return;}

          const success = await startReading(selectedBook._id);
          if (success) {
            setRunning(true);
            setModalVisible(false);
            navigation.navigate('Reader', {
              bookId: selectedBook._id,
              title: selectedBook.title,
              // currentChunkIndex:
            });

          } else {
            show({
              title: 'Oopsy!',
              message: '책을 읽는 중에 오류가 발생했습니다. 다시 시도해주세요.',
            });
            // 에러 처리 UI 또는 토스트
          }
        }}
      />
      <Modal visible={inputVisible} transparent animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.leafModal}>
      <Typography variant="subtitle" color="#2e7d32" weight="600" mb={6}>어디로 이동할까요? 🍀</Typography>
      <Typography variant="caption" color="#888" mb={16}>1 ~ {totalPages} 사이의 숫자를 입력해주세요 </Typography>

      <TextInput
        style={styles.leafInput}
        keyboardType="numeric"
        value={inputText}
        onChangeText={setInputText}
        placeholder="여기에요 👋"
        placeholderTextColor="#999"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setInputVisible(false)}>
          <Typography variant="caption" color="#555">취소</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={confirmPageInput}>
          <Typography variant="button" color="#fff">이동</Typography>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fffaf3' },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 16 },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,

  },
  pageBtn: {
    padding: 12,
    backgroundColor: '#C8E6C9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: '#E0E0E0',
  },
  pageText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2E7D32',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#388E3C',
  },
  pageIndicator: {
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#C8E6C9',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  leafModal: {
    backgroundColor: '#fdfaf3',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  leafModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  leafModalSub: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  leafInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    minWidth: 140,
    textAlign: 'center',
    color: '#2e7d32',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  startButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#81C784',
    borderRadius: 10,
  },
  cancelText: {
    color: '#555',
    fontSize: 14,
  },
  startText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
