import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface ThemedTextProps extends TextProps {
  variant?: 'regular' | 'medium' | 'bold' | 'heading';
}

const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  style,
  variant = 'regular',
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        variant === 'medium' && styles.medium,
        variant === 'bold' && styles.bold,
        variant === 'heading' && styles.heading,
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textPrimary,
  },
  medium: {
    fontFamily: theme.typography.fontFamily.medium,
  },
  bold: {
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: theme.typography.weights.bold,
  },
  heading: {
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.weights.bold,
  },
});

export default ThemedText;
