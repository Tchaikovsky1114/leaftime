import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Typography from '../../components/common/Typography';
// import { useNavigation } from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  // const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // const {setLogin} = useAuthStore();
  return (
    <ImageBackground
      source={require('../../assets/images/background-texture.png')}
      style={styles.background}
      imageStyle={{resizeMode: 'cover'}}>
      <View style={styles.container}>
        <Typography variant="subtitle" color="#3a3a3a" mt={12} mb={8}>
          휴대폰 번호
        </Typography>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="010-1234-5678"
          placeholderTextColor="#999"
        />
        <Typography variant="subtitle" color="#3a3a3a" mt={12} mb={8}>
          비밀번호
        </Typography>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="비밀번호 입력"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // 로그인 로직 추가
            // setLogin('Anchor', '1234');
            // setTimeout(() => {
            // navigation.navigate('MainTabs');
            // }, 300);
          }}>
          <Typography variant="button" color="#fff">
            로그인
          </Typography>
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 12,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}>
          {/* <TouchableOpacity onPress={() => navigation.navigate('PhoneInput')}>
          <Text style={styles.linkText}>아직 계정이 없으신가요? 회원가입</Text>
        </TouchableOpacity> */}
        </View>
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
    fontSize: 18,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Georgia',
    color: '#3a3a3a',
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
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3a5a40',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 10,
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
