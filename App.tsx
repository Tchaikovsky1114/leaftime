import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigation';
import LeafTimeAlert from './src/components/common/LeafTimeAlert';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LeafTimePrompt from './src/components/common/LeafTimePrompt';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();
export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
          <LeafTimeAlert />
          <LeafTimePrompt />
        </QueryClientProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
