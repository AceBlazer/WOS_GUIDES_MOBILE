import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import type { ToolsStackNavigationProp, ToolsStackParamList } from '../types/navigation';

function ToolsScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<ToolsStackNavigationProp>();

  const navigateToScreen = (screenName: keyof ToolsStackParamList) => {
    navigation.navigate(screenName as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>
          🛠️ Survival Tools
        </Text>
        <Text style={styles.subtitle}>
          Enhance Your Shelter Management
        </Text>
        <Text style={styles.headerDescription}>
          Helpful utilities to optimize your survival experience
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ⚙️ Utility Tools
          </Text>
          <Text style={styles.description}>
            Practical tools to help you manage your shelter more efficiently and stay ahead in the survival game.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.autoClickerButton]}
              onPress={() => navigateToScreen('AutoClicker')}
            >
              <Text style={styles.buttonText}>🤖 Auto Clicker</Text>
              <Text style={styles.buttonSubText}>Automate repetitive tapping tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.blacklistButton]}
              onPress={() => navigateToScreen('BlacklistTracker')}
            >
              <Text style={styles.buttonText}>📝 Player Tracker</Text>
              <Text style={styles.buttonSubText}>Keep track of allies and rivals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.notificationsButton]}
              onPress={() => navigateToScreen('Notifications')}
            >
              <Text style={styles.buttonText}>🔔 Notifications</Text>
              <Text style={styles.buttonSubText}>Game updates and reminders</Text>
            </TouchableOpacity>
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
  title: {
    fontSize: theme.typography.sizes.heading,
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.accent,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(255, 179, 0, 0.3)',
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
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  button: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    ...theme.shadows.small,
  },
  autoClickerButton: {
    backgroundColor: theme.colors.success,
    borderColor: '#2E7D32',
  },
  blacklistButton: {
    backgroundColor: theme.colors.danger,
    borderColor: '#C62828',
  },
  notificationsButton: {
    backgroundColor: theme.colors.warning,
    borderColor: '#F57F17',
  },
  buttonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonSubText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default ToolsScreen;