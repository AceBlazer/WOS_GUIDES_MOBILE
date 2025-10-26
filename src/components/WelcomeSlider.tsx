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
import { theme } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeSliderProps {
  onComplete: () => void;
}

interface SlideData {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    icon: '❄️',
    title: 'Welcome to WOS Guides',
    subtitle: 'Your Ultimate Survival Companion',
    description: 'Master the art of survival in the endless winter with our comprehensive guides and powerful tools.',
    backgroundColor: '#E3F2FD',
  },
  {
    id: 2,
    icon: '📚',
    title: 'Expert Survival Guides',
    subtitle: 'Learn From the Best',
    description: 'Access detailed strategies for events, R4/R5 tactics, and hidden tips to build the strongest shelter.',
    backgroundColor: '#F1F8E9',
  },
  {
    id: 3,
    icon: '🛠️',
    title: 'Powerful Tools',
    subtitle: 'Automate & Optimize',
    description: 'Use our auto clicker, player tracker, and notification system to stay ahead of the competition.',
    backgroundColor: '#FFF3E0',
  },
  {
    id: 4,
    icon: '🏔️',
    title: 'Survive the Wasteland',
    subtitle: 'Build Your Legacy',
    description: 'Ready to dominate the frozen world? Let\'s begin your journey to becoming the ultimate survivor!',
    backgroundColor: '#E8F5E8',
  },
];

function WelcomeSlider({ onComplete }: WelcomeSliderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const insets = useSafeAreaInsets();

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
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
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
          <Text style={styles.skipText}>Skip</Text>
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
            {currentPage === slides.length - 1 ? 'Get Started' : 'Next'}
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
  description: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
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