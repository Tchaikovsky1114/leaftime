// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootNavigation } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const navigation = useNavigation<RootNavigation>();
  const { user, setLogout } = useAuthStore();
  console.log(user);
  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        style: 'destructive',
        onPress: async () => {
          await setLogout(); // Zustand + AsyncStorage 상태 초기화
          navigation.reset({ index: 0, routes: [{ name: 'PhoneInput' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Ionicons name="leaf-outline" size={28} color="#4CAF50" />
        <Text style={styles.nickname}>
          {user?.nickname || '사용자'}님, 안녕하세요 👋
        </Text>
        <Text style={styles.membership}>
          {user?.membershipType === 'PREMIUM' ? '🌟 Premium 멤버' : 'Free 멤버'}
        </Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Review')}>
        <Ionicons name="refresh-outline" size={20} color="#4CAF50" />
        <Text style={styles.cardText}>복습하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Reports')}>
        <Ionicons name="bar-chart-outline" size={20} color="#4CAF50" />
        <Text style={styles.cardText}>학습 리포트</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings-outline" size={20} color="#4CAF50" />
        <Text style={styles.cardText}>설정</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FCF6',
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color: '#2E7D32',
  },
  membership: {
    fontSize: 14,
    color: '#66BB6A',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2E7D32',
  },
  logoutButton: {
    marginTop: 'auto',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#FFCDD2',
    borderRadius: 20,
  },
  logoutText: {
    color: '#B71C1C',
    fontWeight: 'bold',
  },
});
