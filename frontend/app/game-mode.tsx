import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <GameModeScreen onSelectGameMode={handleSelectGameMode} onBack={handleBack} />
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
