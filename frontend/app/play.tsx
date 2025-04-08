import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { DEFAULT_GAME_CONFIG } from '~/config';
import { BlindTestGame } from '../src/components/BlindTestGame';
import { BlindTestGameProvider } from '../src/context/BlindTestGameContext';
import { GameConfig } from '../src/types/game';

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
      gameConfig = DEFAULT_GAME_CONFIG;
    }
  } catch (error) {
    console.error('Error parsing game config:', error);
    gameConfig = DEFAULT_GAME_CONFIG;
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
