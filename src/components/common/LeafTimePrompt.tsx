import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { usePromptStore } from '../../store/promptStore';
import Typography from './Typography';

export default function LeafTimePrompt() {
  const { visible, title, message, options, subTitle, dismiss } = usePromptStore();

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.45}
      onBackdropPress={dismiss}
    >
      <View style={styles.container}>
        <Typography variant="h2" color="#2e7d32" align="center">{title}</Typography>
        <Typography variant="subtitle" color="#2e7d32" align="center" mt={6}>{subTitle}</Typography>
        <Typography variant="body" color="#777" align="center" mt={6}>{message}</Typography>

        <View style={styles.buttonContainer}>
        {options.map((option, index) => {
  const isGhost = option.label === '닫기';
  return (
    <TouchableOpacity
      key={index}
      style={isGhost ? styles.ghostButton : styles.button}
      onPress={() => {
        option.onPress();
        dismiss();
      }}
    >
      <Typography variant="button" color={isGhost ? '#555' : '#fff'} weight={isGhost ? '500' : '600'}>
        {option.label}
      </Typography>
    </TouchableOpacity>
  );
})}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fbef',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#bbb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
});
