import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        <Text numberOfLines={1} ellipsizeMode="middle" style={styles.title}>『{bookTitle ?? '이 책'}』을 읽어볼까요?</Text>
        <Text style={styles.subtitle}>이 책을 통해 매일 스터디가 진행돼요! 🌱</Text>
        <Text style={styles.message}>공부한 내역은 매일 매일 리포트에 저장됩니다. 😊</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>나중에</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startText}>지금 시작</Text>
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
