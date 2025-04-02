import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { BlindTestGame } from '../components/BlindTestGame';
import { GameSummary } from '../components/GameSummary';
import { History } from '../components/History';
import { MenusRoot } from '../components/menus';
import { GameConfig } from '../types/game';
import { TrackResult } from '../types/track';

export type RootStackParamList = {
  HomeMenu: undefined;
  BlindTestGame: {
    config: GameConfig;
  };
  GameSummary: {
    tracks: TrackResult[];
    score: number;
    onPlayAgain: () => void;
    onBackToMenu: () => void;
    isMultiplayer?: boolean;
    playerScores?: { [key: number]: number };
  };
  GameHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <View className="flex-1 bg-black">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeMenu"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'black' },
          }}>
          <Stack.Screen name="HomeMenu" component={MenusRoot} />
          <Stack.Screen name="BlindTestGame" component={BlindTestGame} />
          <Stack.Screen name="GameSummary" component={GameSummary} />
          <Stack.Screen name="GameHistory" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
