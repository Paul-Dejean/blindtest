import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MasterConfigScreen } from '../src/components/menus/MasterConfigScreen';
import {
  GameDifficulty,
  GameMode,
  GameParams,
  GameType,
  Genre,
  GameConfig,
} from '../src/types/game';

const getDurationFromDifficulty = (difficulty: GameDifficulty): number => {
  switch (difficulty) {
    case GameDifficulty.EASY:
      return 29;
    case GameDifficulty.MEDIUM:
      return 19;
    case GameDifficulty.HARD:
      return 9;
    default:
      return 29;
  }
};

export default function MasterConfig() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: GameMode }>();

  // Default parameters
  const [gameParams, setGameParams] = useState<GameParams>({
    difficulty: GameDifficulty.MEDIUM,
    genre: 'all',
    songsCount: 10,
  });

  const handleParamsChange = (
    key: 'genre' | 'songsCount' | 'difficulty',
    value: Genre | number | GameDifficulty
  ) => {
    setGameParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStartGame = () => {
    // Create the complete config object
    const config: GameConfig = {
      mode: mode as GameMode,
      type: GameType.CUSTOM,
      difficulty: gameParams.difficulty,
      genre: gameParams.genre,
      songsCount: gameParams.songsCount,
      songDuration: getDurationFromDifficulty(gameParams.difficulty),
    };

    // Navigate to play with the full config as a JSON string
    router.push({
      pathname: '/play',
      params: {
        config: JSON.stringify(config),
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MasterConfigScreen
          gameMode={mode as GameMode}
          gameParams={gameParams}
          onBack={handleBack}
          onParamsChange={handleParamsChange}
          onStartGame={handleStartGame}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
