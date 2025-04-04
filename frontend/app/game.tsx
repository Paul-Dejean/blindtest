import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MasterConfigScreen } from '../src/components/menus/MasterConfigScreen';
import { GameMode, GameParams, GameDifficulty, Genre } from '../src/types/game';

export default function GameScreen() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [gameParams, setGameParams] = useState<GameParams>({
    genre: 'all',
    songsCount: 10,
    difficulty: GameDifficulty.MEDIUM,
  });

  const handleParamsChange = (
    key: 'genre' | 'songsCount' | 'difficulty',
    value: Genre | number | GameDifficulty
  ) => {
    setGameParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartGame = () => {
    // Navigate to the game play screen with the selected parameters
    router.push({
      pathname: '/play',
      params: { ...gameParams, mode },
    });
  };

  return (
    <View style={styles.container}>
      <MasterConfigScreen
        gameMode={mode as GameMode}
        gameParams={gameParams}
        onBack={() => router.back()}
        onParamsChange={handleParamsChange}
        onStartGame={handleStartGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
