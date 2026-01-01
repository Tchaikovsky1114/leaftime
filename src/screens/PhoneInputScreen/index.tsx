import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestVerificationCode } from '../../apis/auth/fetcher';
import { VerifyCodeNavigation } from '../../navigation/types';
import { useAlertStore } from '../../store/alertStore';
import Typography from '../../components/common/Typography';


export default function PhoneInputScreen() {
  const navigation = useNavigation<VerifyCodeNavigation>();
  // const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const {show} = useAlertStore();
  const handleRequestCode = async () => {
    try {
      const status = await requestVerificationCode(phone.replace(/[^0-9]/g, ''));
      if (status === 'pending' || status === 'sent') {
        navigation.navigate('VerifyCode', { phone }); // ✨ 다음 단계로 이동
      } else {
        show({title:'오류', message:'인증번호 요청에 실패했습니다.'});
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        show({title:'요청 실패', message:'이 번호는 일시적으로 인증이 제한되어 있습니다.\n다른 번호로 시도해주세요.'});
      } else {
        show({title:'요청 실패', message: '서버 연결 또는 요청 처리 중 문제가 발생했습니다.'});
      }
      console.error('Error requesting verification code:', error);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/images/background-texture.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.container}>
        <Typography variant="subtitle" color="#3a3a3a" align="center" mb={12}>휴대폰 번호를 입력해주세요</Typography>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="01012345678"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleRequestCode}>
          <Typography variant="button" color="#fff">인증번호 받기</Typography>
        </TouchableOpacity>
        {/* <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 12,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>이미 계정이 있으신가요? 로그인</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    // backgroundColor: 'rgba(248, 245, 240, 0.92)',
  },
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
  linkText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#3a5a40',
    fontFamily: 'Georgia',
  },
});
