import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameTypeScreen } from '../src/components/menus/GameTypeScreen';
import { GameMode } from '../src/types/game';

export default function GameType() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: GameMode }>();

  const handleSelectGameType = (type: string) => {
    router.push({
      pathname: '/play',
      params: { mode, type },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <GameTypeScreen gameMode={mode} onSelectGameType={handleSelectGameType} onBack={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
