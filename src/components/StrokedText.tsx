import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';

interface StrokedTextProps {
  children: string;
  style?: TextStyle;
  strokeColor?: string;
  strokeWidth?: number;
}

const StrokedText: React.FC<StrokedTextProps> = ({
  children,
  style,
  strokeColor = '#0D1721',
  strokeWidth = 2,
}) => {
  // Create offsets for the stroke effect
  const offsets = [
    { x: -strokeWidth, y: -strokeWidth },
    { x: 0, y: -strokeWidth },
    { x: strokeWidth, y: -strokeWidth },
    { x: -strokeWidth, y: 0 },
    { x: strokeWidth, y: 0 },
    { x: -strokeWidth, y: strokeWidth },
    { x: 0, y: strokeWidth },
    { x: strokeWidth, y: strokeWidth },
  ];

  return (
    <View style={styles.container}>
      {/* Render stroke layers */}
      {offsets.map((offset, index) => (
        <Text
          key={index}
          style={[
            style,
            styles.strokeText,
            {
              color: strokeColor,
              left: offset.x,
              top: offset.y,
            },
          ]}
        >
          {children}
        </Text>
      ))}
      {/* Render main text on top */}
      <Text style={[style, styles.mainText]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  strokeText: {
    position: 'absolute',
  },
  mainText: {
    position: 'relative',
  },
});

export default StrokedText;
