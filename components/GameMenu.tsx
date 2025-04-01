import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { GameMode } from 'types/game';

import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export const GameMenu = ({ navigation }: Props) => {
  const startGame = (mode: GameMode) => {
    navigation.navigate('Game', { mode });
  };

  return (
    <View className="flex-1 items-center justify-center space-y-4 p-4">
      <Text className="mb-8 text-3xl font-bold">Blind Test Game</Text>

      <View className="w-full space-y-4">
        <Text className="text-xl font-semibold text-gray-700">Game Modes</Text>
        <TouchableOpacity
          onPress={() => startGame(GameMode.MASTER)}
          className="w-full rounded-full bg-[#1DB954] px-6 py-4">
          <Text className="text-center text-lg font-semibold text-white">Mode Master</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => startGame(GameMode.PLAYER)}
          className="w-full rounded-full bg-blue-500 px-6 py-4">
          <Text className="text-center text-lg font-semibold text-white">Mode Player</Text>
        </TouchableOpacity>
      </View>

      <View className="w-full pt-8">
        <Text className="mb-4 text-xl font-semibold text-gray-700">Other</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
          className="w-full rounded-full bg-gray-500 px-6 py-4">
          <Text className="text-center text-lg font-semibold text-white">View History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
