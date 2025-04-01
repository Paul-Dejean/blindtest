import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EqualizerAnimation } from './EqualizerAnimation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const Home = ({ navigation }: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-black/90 p-4">
      <View className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-xl">
        <Text className="mb-8 text-center text-4xl font-bold text-white">
          Welcome to Blind Test
        </Text>

        <View className="mb-8 rounded-xl bg-gray-800 p-4">
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Menu')}
            className="rounded-xl bg-[#1DB954] p-4">
            <Text className="text-center text-xl font-semibold text-white">Start Playing</Text>
            <Text className="text-center text-sm text-gray-200">
              Choose your game mode and begin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('History')}
            className="rounded-xl bg-gray-700 p-4">
            <Text className="text-center text-xl font-semibold text-white">View History</Text>
            <Text className="text-center text-sm text-gray-300">Check your past performances</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
