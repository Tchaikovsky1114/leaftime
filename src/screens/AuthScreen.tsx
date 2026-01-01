import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Typography from '../components/common/Typography';

export default function AuthScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Typography variant="h2" mb={20}>👋 로그인 화면</Typography>
      <Button title="앱 시작하기" onPress={() => navigation.replace('MainTabs')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
