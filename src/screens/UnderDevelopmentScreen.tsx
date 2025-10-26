import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

interface UnderDevelopmentScreenProps {
  title: string;
  subtitle?: string;
}

function UnderDevelopmentScreen({ title, subtitle }: UnderDevelopmentScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏗️</Text>
          </View>

          <Text style={styles.developmentTitle}>
            🚧 CONSTRUCTION ZONE
          </Text>

          <Text style={styles.developmentText}>
            Our engineers are building this survival feature in the harsh conditions of the frozen wasteland.
          </Text>

          <Text style={styles.developmentSubText}>
            🔥 Stay warm, survivor!
          </Text>
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
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  section: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.large,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  icon: {
    fontSize: 80,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  developmentTitle: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.warning,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  developmentText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  developmentSubText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.accent,
    textAlign: 'center',
    fontWeight: theme.typography.weights.medium,
    letterSpacing: 0.5,
  },
});

export default UnderDevelopmentScreen;