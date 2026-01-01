import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { usePromptStore } from '../../store/promptStore';

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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
        <Text style={styles.message}>{message}</Text>

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
      <Text style={isGhost ? styles.ghostText : styles.buttonText}>
        {option.label}
      </Text>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e7d32',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    color: '#777',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
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
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  ghostText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
});
