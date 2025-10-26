/**
 * WOS Guides - Whiteout Survival Game Guides & Tools
 *
 * @format
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import RootNavigator from './src/navigation/RootNavigator';
import NetworkStatus from './src/components/NetworkStatus';
import AnimatedSplash from './src/components/AnimatedSplash';
import { queryClient, persister } from './src/config/queryClient';
import { OneSignal } from 'react-native-onesignal';
import { ONESIGNAL_APP_ID } from '@env';

// Initialize OneSignal
OneSignal.initialize(ONESIGNAL_APP_ID);

// Set up notification handlers
OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
  event.preventDefault();
  event.getNotification().display();
});

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {showSplash ? (
        <AnimatedSplash onFinish={handleSplashFinish} />
      ) : (
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
            <NetworkStatus />
          </NavigationContainer>
        </SafeAreaProvider>
      )}
    </PersistQueryClientProvider>
  );
}

export default App;
