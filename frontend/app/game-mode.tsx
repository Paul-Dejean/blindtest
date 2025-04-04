import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameModeScreen } from '../src/components/menus/GameModeScreen';
import { GameMode as GameModeEnum } from '../src/types/game';
export default function GameMode() {
  const router = useRouter();

  const handleSelectGameMode = (mode: GameModeEnum) => {
    router.push({
      pathname: '/game-type',
      params: { mode },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <GameModeScreen onSelectGameMode={handleSelectGameMode} onBack={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
