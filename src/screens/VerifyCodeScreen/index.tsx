import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyCode } from '../../apis/auth/fetcher';
import { useAuthStore } from '../../store/authStore';
import { RootNavigation } from '../../navigation/types';
import { useAlertStore } from '../../store/alertStore';
import Typography from '../../components/common/Typography';

interface RouteParams {
  phone: string;
}
export enum MemberShipType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export default function VerifyCodeScreen() {
  const navigation = useNavigation<RootNavigation>();
  const {setLogin} = useAuthStore();
  const route = useRoute();
  const {show} = useAlertStore();
  const { phone } = route.params as RouteParams;

  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      const { token, user } = await verifyCode(phone.replace(/[^0-9]/g, ''), code);
      setLogin(user, token);

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      show({title:'인증 실패', message: '코드가 올바르지 않거나 서버 오류가 발생했습니다.'});
    }
  };

  return (
    <ImageBackground
          source={require('../../assets/images/background-texture.png')}
          style={styles.background}
          imageStyle={{ resizeMode: 'cover' }}
        >
    <View style={styles.container}>
      <Typography variant="subtitle" color="#3a3a3a" align="center" mb={12}>인증번호 입력</Typography>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        placeholder="6자리 인증번호"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Typography variant="button" color="#fff">확인</Typography>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  label: {
    fontSize: 20,
    marginBottom: 12,
    fontFamily: 'Georgia',
    color: '#3a3a3a',
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#fffaf5',
    borderWidth: 1,
    borderColor: '#c1b7a2',
    borderRadius: 14,
    fontSize: 17,
    fontFamily: 'Georgia',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3a5a40',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  background: {
    flex: 1,
  },
});
