import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { OnboardingService } from '../services/onboardingService';
import WelcomeSlider from '../components/WelcomeSlider';
import AppNavigator from './AppNavigator';
import { theme } from '../styles/theme';
import { OneSignal } from 'react-native-onesignal';

function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  const requestNotificationPermission = useCallback(async () => {
    try {
      // Request push notification permissions
      const accepted = await OneSignal.Notifications.requestPermission(true);

      if (accepted) {
        // Opt in the user to receive notifications
        OneSignal.User.pushSubscription.optIn();
      }
    } catch (error) {
      // Silently fail - user can be prompted again later if needed
    }
  }, []);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const isCompleted = await OnboardingService.isOnboardingCompleted();
      setShouldShowOnboarding(!isCompleted);

      // If onboarding is already completed, request permission now (for existing users)
      if (isCompleted) {
        requestNotificationPermission();
      }
    } catch (error) {
      setShouldShowOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  }, [requestNotificationPermission]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  const handleOnboardingComplete = async () => {
    try {
      await OnboardingService.setOnboardingCompleted();
      setShouldShowOnboarding(false);

      // Request push notification permissions after onboarding
      await requestNotificationPermission();
    } catch (error) {
      // Silently fail - user can still use the app
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (shouldShowOnboarding) {
    return <WelcomeSlider onComplete={handleOnboardingComplete} />;
  }

  return <AppNavigator />;
}

export default RootNavigator;
