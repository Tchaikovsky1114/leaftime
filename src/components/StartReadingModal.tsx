import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from './common/Typography';

interface StartReadingModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
  bookTitle?: string;
}

export default function StartReadingModal({ visible, onClose, onStart,bookTitle }: StartReadingModalProps) {

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Ionicons name="leaf-outline" size={40} color="#4CAF50" style={{ marginBottom: 12 }} />
        <Typography numberOfLines={1} ellipsizeMode="middle" variant="subtitle" color="#2e7d32" weight="600" mb={6}>『{bookTitle ?? '이 책'}』을 읽어볼까요?</Typography>
        <Typography variant="caption" color="#555" mb={20}>이 책을 통해 매일 스터디가 진행돼요! 🌱</Typography>
        <Typography variant="caption" color="#aaa" mb={20}>공부한 내역은 매일 매일 리포트에 저장됩니다. 😊</Typography>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Typography variant="caption" color="#555">나중에</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Typography variant="button" color="#fff">지금 시작</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fdfaf3',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 20,
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
