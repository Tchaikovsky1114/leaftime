import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeDrawer from '../drawers/HomeDrawer';
import LearningReportScreen from '../screens/LearningReportScreen';

const Stack = createStackNavigator();

export default function HomeDrawerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
      <Stack.Screen name="LearningReportScreen" component={LearningReportScreen} />
    </Stack.Navigator>
  );
}
