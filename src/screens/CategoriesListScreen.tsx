import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';
import { useCategories } from '../hooks/useApi';
import type { GuidesStackNavigationProp } from '../types/navigation';
import type { Category } from '../types/api';
import { useLocalizedText } from '../utils/localization';

function CategoriesListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GuidesStackNavigationProp>();
  const { data: categories, isLoading, error, refetch, isRefetching } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const getLocalizedText = useLocalizedText();

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryGuides', {
      categoryId: category._id,
      categoryName: getLocalizedText(category.name)
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('SearchResults', {
        query: searchQuery.trim()
      });
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryContent}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{getLocalizedText(item.name)}</Text>
          {item.description && (
            <Text style={styles.categoryDescription}>{item.description}</Text>
          )}
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={error ? "alert-circle" : "inbox"}
        size={48}
        color={theme.colors.textSecondary}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>
        {error ? t('guides.failedToLoad') : t('guides.noCategories')}
      </Text>
      {error && (
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : t('common.error')}
        </Text>
      )}
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <View style={styles.retryButtonContent}>
          <MaterialCommunityIcons name="refresh" size={18} color={theme.colors.textInverse} />
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="snowflake" size={28} color={theme.colors.primary} />
          <Text style={styles.title}>{t('guides.title')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('guides.subtitle')}</Text>
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

      {isLoading && !isRefetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('guides.loadingCategories')}</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
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
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.heading,
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
  listContent: {
    padding: theme.spacing.lg,
  },
  categoryCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  categoryDescription: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 32,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
  },
  retryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  retryButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
  },
});

export default CategoriesListScreen;
