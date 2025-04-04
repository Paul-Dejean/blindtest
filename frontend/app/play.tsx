import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BlindTestGameProvider } from '../src/context/BlindTestGameContext';
import { BlindTestGame } from '../src/components/BlindTestGame';
import { GameConfig, GameMode, GameDifficulty, GameType } from '../src/types/game';

export default function PlayScreen() {
  const params = useLocalSearchParams<{ config: string }>();

  // Parse the config if it exists, otherwise use default values
  let gameConfig: GameConfig;

  try {
    if (params.config) {
      gameConfig = JSON.parse(params.config);
      console.log('Parsed game config:', gameConfig);
    } else {
      console.warn('No config provided, using defaults');
      gameConfig = {
        mode: GameMode.SINGLE_PLAYER,
        type: GameType.CUSTOM,
        difficulty: GameDifficulty.EASY,
        genre: 'all',
        songsCount: 5,
        songDuration: 30,
      };
    }
  } catch (error) {
    console.error('Error parsing game config:', error);
    gameConfig = {
      mode: GameMode.SINGLE_PLAYER,
      type: GameType.CUSTOM,
      difficulty: GameDifficulty.EASY,
      genre: 'all',
      songsCount: 5,
      songDuration: 30,
    };
  }

  return (
    <View style={styles.container}>
      <BlindTestGameProvider config={gameConfig}>
        <BlindTestGame />
      </BlindTestGameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
