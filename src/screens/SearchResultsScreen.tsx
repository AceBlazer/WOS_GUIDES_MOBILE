import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';
import { useSearchGuides } from '../hooks/useApi';
import type { GuidesStackNavigationProp, GuidesStackParamList } from '../types/navigation';
import type { Guide } from '../types/api';
import { useLocalizedText } from '../utils/localization';

type SearchResultsRouteProp = RouteProp<GuidesStackParamList, 'SearchResults'>;

function SearchResultsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GuidesStackNavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();
  const { query } = route.params;
  const getLocalizedText = useLocalizedText();

  const { data: guides, isLoading, error } = useSearchGuides(query);

  const handleGuidePress = (guide: Guide) => {
    navigation.navigate('GuideDetail', {
      guideId: guide._id,
      guideTitle: getLocalizedText(guide.title),
    });
  };

  const renderGuideItem = ({ item }: { item: Guide }) => (
    <TouchableOpacity
      style={styles.guideItem}
      onPress={() => handleGuidePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.guideContent}>
        <Text style={styles.guideTitle} numberOfLines={2}>
          {getLocalizedText(item.title)}
        </Text>
        {item.category && (
          <Text style={styles.categoryText} numberOfLines={1}>
            {typeof item.category === 'object' ? getLocalizedText(item.category.name) : item.category}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('guides.searchResults')}</Text>
            <Text style={styles.queryText} numberOfLines={1}>
              "{query}"
            </Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('guides.searching')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('guides.searchResults')}</Text>
            <Text style={styles.queryText} numberOfLines={1}>
              "{query}"
            </Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={theme.colors.error}
          />
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : t('common.error')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('guides.searchResults')}</Text>
          <Text style={styles.queryText} numberOfLines={1}>
            "{query}"
          </Text>
        </View>
      </View>

      {!guides || guides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="file-search-outline"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyText}>{t('guides.noGuidesFound')}</Text>
          <Text style={styles.emptySubtext}>
            {t('guides.tryDifferentKeywords')}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {guides.length} {guides.length === 1 ? t('guides.result') : t('guides.resultsFound')}
            </Text>
          </View>
          <FlatList
            data={guides}
            renderItem={renderGuideItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
          />
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textHeader,
    marginBottom: theme.spacing.xs,
  },
  queryText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  emptySubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  resultsHeader: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
  },
  resultsCount: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  guideContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  guideTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tag: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textInverse,
  },
  moreTagsText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
});

export default SearchResultsScreen;
