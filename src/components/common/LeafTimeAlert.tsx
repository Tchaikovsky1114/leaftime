// components/LeafTimeAlert.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useAlertStore } from '../../store/alertStore';


export default function LeafTimeAlert() {
  const { visible, title, message, dismiss, onConfirm } = useAlertStore();
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(); // ✅ 확인 버튼 누르면 실행
    }
    dismiss(); // 항상 닫기
  };
  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.4}
      onBackdropPress={dismiss}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title || '알림'}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fffaf5',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Georgia',
    fontWeight: '600',
    marginBottom: 12,
    color: '#2e7d32',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Georgia',
    textAlign: 'center',
    color: '#4e4e4e',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
  },
});
