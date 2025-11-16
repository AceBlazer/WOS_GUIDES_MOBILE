import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  
  View,
  Text,
  TouchableOpacity,
  Alert,
  NativeModules,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';

const { AutoClickerModule } = NativeModules;

function AutoClickerScreen() {
  const { t } = useTranslation();
  const [hasOverlayPermission, setHasOverlayPermission] = useState(false);
  const [hasAccessibilityPermission, setHasAccessibilityPermission] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  useEffect(() => {
    checkPermissions();

    // Listen for app state changes to check permissions when returning from settings
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, []);

  const checkPermissions = async () => {
    try {
      const hasOverlay = await AutoClickerModule.checkOverlayPermission();
      const hasAccessibility = await AutoClickerModule.checkAccessibilityService();
      setHasOverlayPermission(hasOverlay);
      setHasAccessibilityPermission(hasAccessibility);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestOverlayPermission = async () => {
    try {
      await AutoClickerModule.requestOverlayPermission();
      Alert.alert(
        'Permission Required',
        'Please grant overlay permission and return to the app',
        [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => checkPermissions(), 1000);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request overlay permission');
    }
  };

  const requestAccessibilityPermission = async () => {
    try {
      await AutoClickerModule.requestAccessibilityService();
      Alert.alert(
        t('tools.autoClicker.permissionTitle'),
        t('tools.autoClicker.permissionMessage'),
        [
          {
            text: t('tools.autoClicker.permissionButton'),
            onPress: () => {
              // Check permissions again after user returns
              setTimeout(() => checkPermissions(), 1000);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to open accessibility settings');
    }
  };

  const startAutoClicker = async () => {
    try {
      if (!hasOverlayPermission) {
        Alert.alert(
          'Permission Required',
          'Overlay permission is required to show the floating auto clicker button',
          [
            { text: 'Grant Permission', onPress: requestOverlayPermission },
            { text: 'Cancel' },
          ]
        );
        return;
      }

      await AutoClickerModule.startOverlayService();
      setIsOverlayActive(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start auto clicker');
    }
  };

  const stopAutoClicker = async () => {
    try {
      await AutoClickerModule.stopOverlayService();
      setIsOverlayActive(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop auto clicker');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="robot" size={32} color={theme.colors.primary} />
          <Text style={styles.title}>Auto Clicker</Text>
        </View>
        <Text style={styles.subtitle}>
          Automated Tapping Assistant
        </Text>
        <Text style={styles.headerDescription}>
          Helpful tool for automating repetitive tapping tasks in mobile games
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.description}>
            Creates a floating button that automatically taps every 500ms. Perfect for resource collection, building upgrades, and other repetitive tasks in Whiteout Survival.
          </Text>

          <View style={styles.permissionStatus}>
            <View style={styles.permissionHeaderContainer}>
              <MaterialCommunityIcons name="cellphone" size={20} color={theme.colors.accent} />
              <Text style={styles.permissionHeader}>Required Permissions</Text>
            </View>
            <View style={styles.permissionRow}>
              <MaterialCommunityIcons name="shield-check" size={18} color={hasOverlayPermission ? theme.colors.success : theme.colors.danger} />
              <Text style={[styles.permissionText, hasOverlayPermission ? styles.permissionGranted : styles.permissionRequired]}>
                Display over apps:
              </Text>
              <MaterialCommunityIcons
                name={hasOverlayPermission ? "check-circle" : "close-circle"}
                size={16}
                color={hasOverlayPermission ? theme.colors.success : theme.colors.danger}
              />
              <Text style={[styles.permissionText, hasOverlayPermission ? styles.permissionGranted : styles.permissionRequired]}>
                {hasOverlayPermission ? ' Granted' : ' Required'}
              </Text>
            </View>
            <View style={styles.permissionRow}>
              <MaterialCommunityIcons name="cog" size={18} color={hasAccessibilityPermission ? theme.colors.success : theme.colors.danger} />
              <Text style={[styles.permissionText, hasAccessibilityPermission ? styles.permissionGranted : styles.permissionRequired]}>
                Accessibility service:
              </Text>
              <MaterialCommunityIcons
                name={hasAccessibilityPermission ? "check-circle" : "close-circle"}
                size={16}
                color={hasAccessibilityPermission ? theme.colors.success : theme.colors.danger}
              />
              <Text style={[styles.permissionText, hasAccessibilityPermission ? styles.permissionGranted : styles.permissionRequired]}>
                {hasAccessibilityPermission ? ' Enabled' : ' Required'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {!hasOverlayPermission && (
              <TouchableOpacity
                style={[styles.button, styles.permissionButton]}
                onPress={requestOverlayPermission}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.buttonText}>Grant Overlay Permission</Text>
                </View>
                <Text style={styles.buttonSubText}>Allow app to display over other apps</Text>
              </TouchableOpacity>
            )}

            {!hasAccessibilityPermission && (
              <TouchableOpacity
                style={[styles.button, styles.permissionButton]}
                onPress={requestAccessibilityPermission}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons name="cog" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.buttonText}>Enable Accessibility</Text>
                </View>
                <Text style={styles.buttonSubText}>Required for automatic tapping</Text>
              </TouchableOpacity>
            )}

            {!isOverlayActive ? (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={startAutoClicker}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons name="rocket-launch" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.buttonText}>Start Auto Clicker</Text>
                </View>
                <Text style={styles.buttonSubText}>Begin automated tapping</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.stopButton]}
                onPress={stopAutoClicker}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons name="stop" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.buttonText}>Stop Auto Clicker</Text>
                </View>
                <Text style={styles.buttonSubText}>End automated tapping</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.heading,
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.accent,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(255, 127, 63, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerDescription: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.9,
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  description: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  permissionStatus: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  permissionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  permissionHeader: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.accent,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 127, 63, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  permissionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  permissionGranted: {
    color: theme.colors.success,
  },
  permissionRequired: {
    color: theme.colors.danger,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    ...theme.shadows.small,
  },
  permissionButton: {
    backgroundColor: theme.colors.info,
    borderColor: theme.colors.primary,
  },
  startButton: {
    backgroundColor: theme.colors.success,
    borderColor: '#2E7D32',
  },
  stopButton: {
    backgroundColor: theme.colors.danger,
    borderColor: '#C62828',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonSubText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.sm,
    opacity: 0.9,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AutoClickerScreen;