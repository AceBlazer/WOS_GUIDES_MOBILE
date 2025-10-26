import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const snowflake1 = useRef(new Animated.Value(-50)).current;
  const snowflake2 = useRef(new Animated.Value(-100)).current;
  const snowflake3 = useRef(new Animated.Value(-150)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
    ]).start();

    // Snowflakes falling animation
    Animated.loop(
      Animated.parallel([
        Animated.timing(snowflake1, {
          toValue: height + 50,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(snowflake2, {
          toValue: height + 50,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(snowflake3, {
          toValue: height + 50,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-hide after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, snowflake1, snowflake2, snowflake3, glowAnim, onFinish]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />

      {/* Background gradient effect */}
      <View style={styles.gradient} />

      {/* Animated snowflakes */}
      <Animated.Text
        style={[
          styles.snowflake,
          {
            left: '20%',
            transform: [{ translateY: snowflake1 }],
          },
        ]}
      >
        ❄️
      </Animated.Text>
      <Animated.Text
        style={[
          styles.snowflake,
          {
            left: '60%',
            transform: [{ translateY: snowflake2 }],
          },
        ]}
      >
        ❄️
      </Animated.Text>
      <Animated.Text
        style={[
          styles.snowflake,
          {
            left: '80%',
            transform: [{ translateY: snowflake3 }],
          },
        ]}
      >
        ❄️
      </Animated.Text>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow effect behind icon */}
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Main Icon/Logo */}
        <View style={styles.iconContainer}>
          <Text style={styles.mainIcon}>❄️</Text>
          <View style={styles.iconOverlay}>
            <Text style={styles.bookIcon}>📖</Text>
          </View>
        </View>

        {/* App Title */}
        <Text style={styles.title}>WOS Guides</Text>
        <Text style={styles.subtitle}>Whiteout Survival</Text>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Survive the Frost</Text>
          <View style={styles.divider} />
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D47A1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0D47A1',
    opacity: 1,
  },
  snowflake: {
    position: 'absolute',
    fontSize: 24,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4FC3F7',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 10,
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  mainIcon: {
    fontSize: 100,
    textShadowColor: 'rgba(79, 195, 247, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    backgroundColor: '#FFB300',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bookIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B3E5FC',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: '#81D4FA',
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB300',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  loadingDotDelay1: {
    opacity: 0.6,
  },
  loadingDotDelay2: {
    opacity: 0.4,
  },
});

export default AnimatedSplash;
