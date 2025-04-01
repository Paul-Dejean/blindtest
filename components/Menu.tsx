import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EqualizerAnimation } from './EqualizerAnimation';
import { GameMode } from '../types/game';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export const Menu = ({ navigation }: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-black/90 p-4">
      <View className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-xl">
        <Text className="mb-8 text-center text-4xl font-bold text-white">Blind Test</Text>

        <View className="mb-8 rounded-xl bg-gray-800 p-4">
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Game', { mode: GameMode.PLAYER })}
            className="rounded-xl bg-[#1DB954] p-4">
            <Text className="text-center text-xl font-semibold text-white">Player Mode</Text>
            <Text className="text-center text-sm text-gray-200">3 songs - Quick challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Game', { mode: GameMode.MASTER })}
            className="rounded-xl bg-blue-500 p-4">
            <Text className="text-center text-xl font-semibold text-white">Master Mode</Text>
            <Text className="text-center text-sm text-gray-200">10 songs - Full experience</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
