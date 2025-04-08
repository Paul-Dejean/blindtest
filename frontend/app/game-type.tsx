import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameTypeScreen } from '../src/components/menus/GameTypeScreen';
import { GameMode, GameType as GameTypeEnum, GameDifficulty, GameConfig } from '../src/types/game';

export default function GameType() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: GameMode }>();

  const handleSelectGameType = (type: string) => {
    // For automatic mode, go directly to play with default configuration
    if (type === GameTypeEnum.AUTO) {
      const autoConfig: GameConfig = {
        mode: mode as GameMode,
        type: GameTypeEnum.AUTO,
        difficulty: GameDifficulty.MEDIUM,
        genre: 'all',
        songsCount: 5,
        songDuration: 30,
      };

      router.push({
        pathname: '/play',
        params: { config: JSON.stringify(autoConfig) },
      });
    }
    // For custom/master mode, go to config screen
    else if (type === GameTypeEnum.CUSTOM) {
      router.push({
        pathname: '/master-config',
        params: { mode },
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <GameTypeScreen
          gameMode={mode}
          onSelectGameType={handleSelectGameType}
          onBack={handleBack}
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
