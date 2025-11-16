import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';
import { useCategories } from '../hooks/useApi';
import CompactLanguageSelector from '../components/CompactLanguageSelector';
import StrokedText from '../components/StrokedText';
import type { GuidesStackNavigationProp } from '../types/navigation';
import type { Category } from '../types/api';
import { useLocalizedText } from '../utils/localization';

function GuidesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GuidesStackNavigationProp>();
  const { data: categories, isLoading, error, refetch, isRefetching } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const getLocalizedText = useLocalizedText();

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryGuides', {
      categoryId: category._id,
      categoryName: getLocalizedText(category.name),
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('SearchResults', {
        query: searchQuery.trim()
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>
              {t('guides.title')}
            </Text>
          </View>
          <CompactLanguageSelector />
        </View>
        <Text style={styles.subtitle}>
          {t('guides.subtitle')}
        </Text>
        <Text style={styles.headerDescription}>
          {t('guides.description')}
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('common.searchPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={searchQuery.trim().length === 0}
          >
            <Text style={styles.searchButtonText}>{t('common.search')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('guides.sectionTitle')}
          </Text>

          {isLoading && !isRefetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>{t('guides.loadingCategories')}</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {t('guides.failedToLoad')}
              </Text>
              <Text style={styles.errorSubText}>
                {error instanceof Error ? error.message : 'An error occurred'}
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
              </TouchableOpacity>
            </View>
          ) : categories && categories.length > 0 ? (
            <View style={styles.buttonContainer}>
              {categories.map((category, index) => {
                return (
                  <TouchableOpacity
                    key={category._id}
                    style={styles.button}
                    onPress={() => handleCategoryPress(category)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require('../../assets/fonts/buttons/button_1_1.png')}
                      style={styles.buttonBackground}
                      resizeMode="stretch"
                    >
                      <StrokedText style={styles.buttonText} strokeColor="#0D4D7A" strokeWidth={1}>
                        {getLocalizedText(category.name)}
                      </StrokedText>
                      {category.description && (
                        <StrokedText style={styles.buttonSubText} strokeColor="#0D4D7A" strokeWidth={1}>
                          {category.description}
                        </StrokedText>
                      )}
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('guides.noCategories')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.heading,
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
  searchContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
    width: '100%',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textPrimary,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
  },
  searchButtonText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
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
  loadingContainer: {
    paddingVertical: theme.spacing.xl * 2,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  errorSubText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
  },
  retryButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emptySubText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    opacity: 0.8,
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

export default GuidesScreen;