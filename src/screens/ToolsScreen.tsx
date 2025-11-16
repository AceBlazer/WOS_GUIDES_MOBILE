import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/theme';
import CompactLanguageSelector from '../components/CompactLanguageSelector';
import StrokedText from '../components/StrokedText';
import type {
  ToolsStackNavigationProp,
  ToolsStackParamList,
} from '../types/navigation';

function ToolsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<ToolsStackNavigationProp>();

  const navigateToScreen = (screenName: keyof ToolsStackParamList) => {
    navigation.navigate(screenName as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>{t('tools.title')}</Text>
          </View>
          <CompactLanguageSelector />
        </View>
        <Text style={styles.subtitle}>{t('tools.subtitle')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToScreen('AutoClicker')}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={require('../../assets/fonts/buttons/button_2_1.png')}
                style={styles.buttonBackground}
                resizeMode="stretch"
              >
                <StrokedText style={styles.buttonText} strokeColor="#0D4D7A" strokeWidth={1}>
                  {t('tools.autoClicker.title')}
                </StrokedText>
                <StrokedText style={styles.buttonSubText} strokeColor="#0D4D7A" strokeWidth={1}>
                  {t('tools.autoClicker.description')}
                </StrokedText>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToScreen('BlacklistTracker')}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={require('../../assets/fonts/buttons/button_2_1.png')}
                style={styles.buttonBackground}
                resizeMode="stretch"
              >
                <StrokedText style={styles.buttonText} strokeColor="#0D4D7A" strokeWidth={1}>
                  {t('tools.blacklistTracker.title')}
                </StrokedText>
                <StrokedText style={styles.buttonSubText} strokeColor="#0D4D7A" strokeWidth={1}>
                  {t('tools.blacklistTracker.description')}
                </StrokedText>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToScreen('Notifications')}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={require('../../assets/fonts/buttons/button_2_1.png')}
                style={styles.buttonBackground}
                resizeMode="stretch"
              >
                <StrokedText style={styles.buttonText} strokeColor="#0D4D7A" strokeWidth={1}>
                  {t('tools.notifications.title')}
                </StrokedText>
                <StrokedText style={styles.buttonSubText} strokeColor="#0D4D7A" strokeWidth={1}>
                  {t('tools.notifications.description')}
                </StrokedText>
              </ImageBackground>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.heading,
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textHeader,
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
  buttonContainer: {
    gap: theme.spacing.md,
  },
  button: {
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
  },
  buttonBackground: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
  },
  buttonSubText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    opacity: 0.95,
    textAlign: 'center',
  },
});

export default ToolsScreen;
