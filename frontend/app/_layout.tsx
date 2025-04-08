import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#111827' },
            animation: 'fade',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});
