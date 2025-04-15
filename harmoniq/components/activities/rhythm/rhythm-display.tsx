import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

type RhythmDisplayProps = {
  rhythm: string[];
};

export default function RhythmDisplay({ rhythm }: RhythmDisplayProps) {
  const symbols: Record<string, string> = {
    q: '♩',
    '8': '♪',
    h: '|',
  };

  // Get screen dimensions
  const { width } = Dimensions.get('window');

  // Calculate font size as a percentage of screen width
  const fontSize = width * 0.20; // 10% of screen width

  return (
    <View style={styles.container}>
      {rhythm.map((note, index) => (
        <Text key={index} style={[styles.note, { fontSize }]}>
          {symbols[note] || '?'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    color: 'white',
    marginHorizontal: 5, // Add spacing between notes
  },
});