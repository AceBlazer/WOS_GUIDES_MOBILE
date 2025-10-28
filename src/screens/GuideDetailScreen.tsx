import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/theme';
import { useGuide } from '../hooks/useApi';
import type { GuidesStackNavigationProp, GuidesStackParamList } from '../types/navigation';

type GuideDetailRouteProp = RouteProp<GuidesStackParamList, 'GuideDetail'>;

function GuideDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GuidesStackNavigationProp>();
  const route = useRoute<GuideDetailRouteProp>();
  const { guideId, guideTitle } = route.params;
  const webViewRef = useRef<WebView>(null);

  const { data: guide, isLoading, error, refetch } = useGuide(guideId);

  // Create a styled HTML template for the WebView
  const createHtmlContent = (content: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: ${theme.colors.textPrimary};
              background-color: ${theme.colors.background};
              padding: 16px;
            }
            h1, h2, h3, h4, h5, h6 {
              color: ${theme.colors.textPrimary};
              margin-top: 24px;
              margin-bottom: 12px;
              font-weight: bold;
            }
            h1 { font-size: 28px; }
            h2 { font-size: 24px; }
            h3 { font-size: 20px; }
            p {
              margin-bottom: 16px;
              color: ${theme.colors.textPrimary};
            }
            a {
              color: ${theme.colors.primary};
              text-decoration: none;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 16px 0;
            }
            ul, ol {
              margin-bottom: 16px;
              padding-left: 24px;
            }
            li {
              margin-bottom: 8px;
              color: ${theme.colors.textPrimary};
            }
            code {
              background-color: ${theme.colors.backgroundLight};
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              font-size: 14px;
            }
            pre {
              background-color: ${theme.colors.backgroundLight};
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
              margin-bottom: 16px;
            }
            pre code {
              background-color: transparent;
              padding: 0;
            }
            blockquote {
              border-left: 4px solid ${theme.colors.primary};
              padding-left: 16px;
              margin: 16px 0;
              color: ${theme.colors.textSecondary};
              font-style: italic;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
            }
            th, td {
              border: 1px solid ${theme.colors.border};
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: ${theme.colors.backgroundLight};
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>{guideTitle}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('guides.loadingGuide')}</Text>
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
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>{guideTitle}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{t('guides.failedToLoadGuide')}</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!guide) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>{guideTitle}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{t('guides.guideNotFound')}</Text>
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
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>{guide.title}</Text>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: createHtmlContent(guide.htmlContent) }}
        style={styles.webView}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        scalesPageToFit={true}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
      />
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
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.sizes.heading,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.heading,
    color: theme.colors.textHeader,
    letterSpacing: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
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
    paddingHorizontal: theme.spacing.lg,
  },
  errorTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
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
});

export default GuideDetailScreen;
