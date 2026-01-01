import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabs from './MainTabs';
import ReaderScreen from '../screens/ReaderScreen';
import PhoneInputScreen from '../screens/PhoneInputScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from './types';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LearningReportScreen from '../screens/LearningReportScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {isLoggedIn} = useAuthStore();
  console.log('🚀 RootNavigator - isLoggedIn:', isLoggedIn);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        headerShadowVisible: false,
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LearningReportScreen" component={LearningReportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
    )}
    </Stack.Navigator>
  );
}
