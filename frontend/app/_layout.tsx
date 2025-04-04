import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { GameConfig, GameDifficulty, GameMode, GameType } from '../src/types/game';

const defaultGameConfig: GameConfig = {
  mode: GameMode.SINGLE_PLAYER,
  type: GameType.CUSTOM,
  difficulty: GameDifficulty.MEDIUM,
  genre: 'all',
  songsCount: 10,
  songDuration: 30,
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'fade',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
