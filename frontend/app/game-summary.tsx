import React from 'react';
import { View, StyleSheet } from 'react-native';
import GameSummary from '../src/components/GameSummary';

export default function GameSummaryScreen() {
  return (
    <View style={styles.container}>
      <GameSummary />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
