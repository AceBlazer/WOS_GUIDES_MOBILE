import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/theme';
import LanguageSelector from './LanguageSelector';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeSliderProps {
  onComplete: () => void;
}

interface SlideData {
  id: number;
  icon: string;
  titleKey: string;
  subtitleKey: string;
  backgroundColor: string;
}

const getSlides = (): SlideData[] => [
  {
    id: 1,
    icon: '❄️',
    titleKey: 'onboarding.slide1.title',
    subtitleKey: 'onboarding.slide1.subtitle',
    backgroundColor: '#E3F2FD',
  },
  {
    id: 2,
    icon: '📚',
    titleKey: 'onboarding.slide2.title',
    subtitleKey: 'onboarding.slide2.subtitle',
    backgroundColor: '#F1F8E9',
  },
  {
    id: 3,
    icon: '🛠️',
    titleKey: 'onboarding.slide3.title',
    subtitleKey: 'onboarding.slide3.subtitle',
    backgroundColor: '#FFF3E0',
  },
  {
    id: 4,
    icon: '🏔️',
    titleKey: 'onboarding.slide4.title',
    subtitleKey: 'onboarding.slide4.subtitle',
    backgroundColor: '#E8F5E8',
  },
];

function WelcomeSlider({ onComplete }: WelcomeSliderProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const insets = useSafeAreaInsets();
  const slides = getSlides();

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      const nextPage = currentPage + 1;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePageSelected = (event: any) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const renderSlide = (slide: SlideData) => (
    <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t(slide.titleKey)}</Text>
          <Text style={styles.subtitle}>{t(slide.subtitleKey)}</Text>
        </View>

        {/* Show language selector only on first slide */}
        {slide.id === 1 && (
          <View style={styles.languageSelectorContainer}>
            <LanguageSelector />
          </View>
        )}
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentPage ? theme.colors.primary : theme.colors.textTertiary,
              width: index === currentPage ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </TouchableOpacity>
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {slides.map(renderSlide)}
      </PagerView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) }]}>
        {renderDots()}

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentPage === slides.length - 1 ? t('common.getStarted') : t('common.next')}
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  skipButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  skipText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  pagerView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: theme.spacing.xxl,
  },
  icon: {
    fontSize: 120,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.display,
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: 0.3,
  },
  languageSelectorContainer: {
    marginTop: theme.spacing.xxl,
    alignItems: 'center',
    width: '100%',
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textTertiary,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    minWidth: 120,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  nextButtonText: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
    letterSpacing: 0.5,
  },
});

export default WelcomeSlider;