import React from 'react';
import {
  StyleSheet,
  
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  description?: string;
}

function PlaceholderScreen({ title, subtitle, description }: PlaceholderScreenProps) {
  const navigation = useNavigation();

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
            <MaterialCommunityIcons name="snowflake" size={80} color={theme.colors.primary} />
          </View>

          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="progress-wrench" size={24} color={theme.colors.accent} />
            <Text style={styles.comingSoonTitle}>UNDER CONSTRUCTION</Text>
          </View>

          <Text style={styles.comingSoonText}>
            {description || `${title} content is coming soon! We're working hard to bring you the best survival guides and tools for the frozen wasteland.`}
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonContent}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.backButtonText}>RETURN TO BASE</Text>
            </View>
          </TouchableOpacity>
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
    color: theme.colors.textHeader,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  comingSoonTitle: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.accent,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  comingSoonText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
    ...theme.shadows.medium,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default PlaceholderScreen;