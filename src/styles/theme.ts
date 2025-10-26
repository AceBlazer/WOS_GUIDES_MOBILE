// Whiteout Survival inspired theme
import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary colors - Bright ice blue (for highlights and active states)
    primary: '#4FC3F7', // Bright ice blue
    primaryDark: '#0288D1', // Deep ice blue
    primaryLight: '#81D4FA', // Light ice blue

    // Accent colors - Warm gold/fire (warmth in the cold)
    accent: '#FFB300', // Warm gold
    accentDark: '#FF8F00', // Deeper gold
    accentLight: '#FFD54F', // Light gold

    // Background colors - DARK frozen theme (like the game)
    background: '#0D1721', // Very dark blue-black (main app background)
    backgroundLight: '#1A2938', // Dark frozen steel (elevated surfaces)
    backgroundCard: '#243441', // Dark card background
    backgroundModal: 'rgba(13, 23, 33, 0.95)', // Dark modal overlay

    // Surface colors - Dark ice and metal
    surface: '#1E2D3D', // Dark ice surface
    surfaceLight: '#2A3F52', // Lighter dark surface
    surfaceDark: '#0F1A24', // Darker surface (almost black)

    // Text colors - Light on dark for readability
    textPrimary: '#E8F4FD', // Almost white with blue tint
    textSecondary: '#8FA9C1', // Muted ice blue-grey
    textTertiary: '#6B7B8C', // Subtle grey-blue
    textInverse: '#0D1721', // Dark text on light backgrounds

    // Status colors - Survival themed
    success: '#4CAF50', // Green for success/safe
    warning: '#FFC107', // Amber for warning/caution
    danger: '#DC3545', // Red for danger/critical
    error: '#DC3545', // Red for errors
    info: '#4FC3F7', // Ice blue for information

    // Border and divider colors - Subtle in dark theme
    border: '#2A3F52', // Dark border
    divider: '#1E2D3D', // Dark divider

    // Special colors - Game elements
    ice: '#4FC3F7', // Ice blue
    fire: '#FF6B35', // Fire orange
    metal: '#6B7B8C', // Metallic grey
    wood: '#8D6E63', // Wood brown
  },

  gradients: {
    primary: ['#1B4B7A', '#0F2F4D'],
    accent: ['#FF7F3F', '#E6602D'],
    background: ['#0A1A24', '#152B3D', '#1E3547'],
    card: ['#1E3547', '#243947', '#2A3F52'],
    ice: ['#B3E5FC', '#81D4FA', '#4FC3F7'],
    fire: ['#FF7F3F', '#FF5722', '#D32F2F'],
    danger: ['#F44336', '#C62828', '#8E0000'],
    success: ['#4CAF50', '#2E7D32', '#1B5E20'],
    warning: ['#FFC107', '#F57F17', '#E65100'],
    frostbite: ['#E1F5FE', '#B3E5FC', '#4FC3F7', '#0277BD'],
    blizzard: ['#263238', '#37474F', '#455A64', '#546E7A'],
    aurora: ['#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB'],
  },

  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.7,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },

  typography: {
    fontFamily: {
      // Powerless font - Bold, game-style font for Whiteout Survival theme
      regular: 'Powerless',
      medium: 'Powerless',
      bold: 'Powerless',
      heading: 'Powerless',
      body: 'Powerless',
    },
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      title: 24,
      heading: 28,
      display: 32,
    },
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
};

export type Theme = typeof theme;