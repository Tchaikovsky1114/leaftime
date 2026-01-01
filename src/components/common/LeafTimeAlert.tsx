// components/LeafTimeAlert.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useAlertStore } from '../../store/alertStore';
import Typography from './Typography';


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
        <Typography variant="h2" color="#2e7d32" weight="600" mb={12}>{title || '알림'}</Typography>
        <Typography variant="body" color="#4e4e4e" align="center" mb={20}>{message}</Typography>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Typography variant="button" color="#fff" weight="700">확인</Typography>
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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
});
