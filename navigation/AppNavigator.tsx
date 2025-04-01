import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { BlindTestGame } from '../components/BlindTestGame';
import { GameSummary } from '../components/GameSummary';
import { Home } from '../components/Home';
import { Menu } from '../components/Menu';
import { GameMode } from '../types/game';
import { TrackResult } from '../types/track';

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Game: { mode: GameMode };
  GameSummary: {
    tracks: TrackResult[];
    score: number;
    onPlayAgain: () => void;
    onBackToMenu: () => void;
  };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <View className="flex-1 bg-black">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'black' },
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="Game" component={BlindTestGame} />
          <Stack.Screen name="GameSummary" component={GameSummary} />
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
