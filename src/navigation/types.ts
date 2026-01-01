import { StackNavigationProp } from '@react-navigation/stack';


export type RootStackParamList = {
  PhoneInput: undefined;
  VerifyCode: { phone: string };
  LearningReportScreen: { date: string };
  Home: undefined;
  Login: undefined;
  Auth: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Reader: { bookId: number, title: string };
  Review: undefined;
  Reports: undefined;
  Settings: undefined;
};

export type VerifyCodeNavigation = StackNavigationProp<RootStackParamList, 'VerifyCode'>;
export type RootNavigation = StackNavigationProp<RootStackParamList>;
