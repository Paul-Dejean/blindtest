import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { EqualizerAnimation } from '../EqualizerAnimation';

interface HomeScreenProps {
  onCreateNewGame: () => void;
  onViewHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateNewGame, onViewHistory }) => {
  return (
    <View className="w-full overflow-hidden rounded-3xl bg-gray-900/80 shadow-2xl backdrop-blur-lg">
      <View className="relative px-6 pb-8 pt-8">
        {/* Logo and Title */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-28 w-28 items-center justify-center rounded-full border border-[#1DB954]/20 bg-gradient-to-br from-[#1DB954]/30 to-[#1DB954]/10">
            <Ionicons name="musical-notes" size={56} color="#1DB954" />
          </View>
          <Text className="text-center text-4xl font-bold text-white">Welcome to Blind Test</Text>
          <Text className="mt-2 text-center text-base text-gray-300">
            Test your music knowledge and challenge yourself
          </Text>
        </View>

        {/* Equalizer */}
        <View className="mb-8 overflow-hidden rounded-xl border border-gray-800/50 bg-black/40 p-4">
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        {/* Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={onCreateNewGame}
            className="flex-row items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#1DB954] to-[#1DB980]">
            <View className="flex-1 flex-row items-center p-5">
              <View className="mr-4 rounded-full bg-white/30 p-3">
                <Ionicons name="play" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">Start Playing</Text>
                <Text className="text-base text-white/80">Choose your game mode</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onViewHistory}
            className="flex-row items-center overflow-hidden rounded-xl bg-gradient-to-r from-gray-700 to-gray-800">
            <View className="flex-1 flex-row items-center p-5">
              <View className="mr-4 rounded-full bg-white/20 p-3">
                <Ionicons name="time" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">View History</Text>
                <Text className="text-base text-white/70">Check past performances</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <View className="mt-8 items-center">
            <Text className="text-center text-base font-medium text-gray-400">
              Made with <Ionicons name="heart" size={16} color="#1DB954" /> by Music Lovers
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
