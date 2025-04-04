import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { GameMode } from '~/types/game';

import { EqualizerAnimation } from '../EqualizerAnimation';

interface PlayerModeScreenProps {
  onBack: () => void;
  onSelectGameMode: (mode: GameMode) => void;
}

export const PlayerModeScreen: React.FC<PlayerModeScreenProps> = ({ onBack, onSelectGameMode }) => {
  return (
    <View className="w-full overflow-hidden rounded-3xl bg-gray-900/80 shadow-2xl backdrop-blur-lg">
      <View className="relative px-6 pb-8 pt-8">
        {/* Header */}
        <View className="mb-8 items-center">
          <View className="absolute left-0 top-1 rounded-full bg-gray-800/80 p-2.5">
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-4xl font-bold text-white">Player Mode</Text>
          <Text className="mt-2 text-center text-base text-gray-300">Select player mode</Text>
        </View>

        {/* Equalizer */}
        <View className="mb-8 overflow-hidden rounded-xl border border-gray-800/50 bg-black/40 p-4">
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        {/* Player Mode Options */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => onSelectGameMode(GameMode.SINGLE_PLAYER)}
            className="overflow-hidden rounded-xl bg-gradient-to-r from-[#1DB954] to-[#1DB980]">
            <View className="flex-row items-center p-5">
              <View className="mr-4 rounded-full bg-white/30 p-3">
                <Ionicons name="person" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">Single Player</Text>
                <Text className="text-base text-white/80">Play by yourself</Text>
                <Text className="mt-1 text-sm text-white/60">Challenge your knowledge</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSelectGameMode(GameMode.MULTI_PLAYER)}
            className="overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700">
            <View className="flex-row items-center p-5">
              <View className="mr-4 rounded-full bg-white/30 p-3">
                <Ionicons name="people" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white">Multiplayer</Text>
                <Text className="text-base text-white/80">Play with friends</Text>
                <Text className="mt-1 text-sm text-white/60">Compete for the highest score</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
