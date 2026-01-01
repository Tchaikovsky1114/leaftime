// stacks/ReportsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LearningReportScreen from '../../screens/LearningReportScreen';

export type ReportsStackParamList = {
  LearningReportScreen: { date: string };
};

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export default function ReportsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="LearningReportScreen"
        component={LearningReportScreen}
      />
    </Stack.Navigator>
  );
}
