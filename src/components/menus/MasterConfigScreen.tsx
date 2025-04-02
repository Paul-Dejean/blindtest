import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { GameDifficulty, GameMode, GameParams, Genre } from '~/types/game';
import { GENRE_DISPLAY_NAMES, getAllGenres } from '~/utils/itunesGenres';

interface MasterConfigScreenProps {
  gameMode: GameMode;
  gameParams: GameParams;
  onBack: () => void;
  onParamsChange: (key: 'genre' | 'songsCount' | 'difficulty', value: any) => void;
  onStartGame: () => void;
}

// Helper function to get appropriate icon for each genre
const getGenreIcon = (genre: string): string => {
  const iconMap: Record<string, string> = {
    all: 'albums',
    ALTERNATIVE: 'musical-note',
    ROCK: 'flame',
    POP: 'musical-note',
    HIP_HOP_RAP: 'mic',
    ELECTRONIC: 'pulse',
    DANCE: 'disc',
    R_AND_B_SOUL: 'musical-notes',
    JAZZ: 'musical-notes',
    REGGAE: 'musical-note',
    COUNTRY: 'musical-note',
    CLASSICAL: 'musical-note',
    BLUES: 'musical-note',
    SOUNDTRACK: 'film',
    WORLD: 'globe',
  };

  return iconMap[genre] || 'musical-note';
};

export const MasterConfigScreen: React.FC<MasterConfigScreenProps> = ({
  gameMode,
  gameParams,
  onBack,
  onParamsChange,
  onStartGame,
}) => {
  // Get all iTunes genres with proper type casting
  const availableGenres = getAllGenres()
    .filter((genre) => genre.key !== 'ALL') // Filter out ALL as we add it separately
    .map((genre) => ({
      value: genre.key as Genre,
      label: genre.name,
      icon: getGenreIcon(genre.key),
    }));

  // Create genre options with 'all' option first
  const genreOptions: { value: Genre; label: string; icon: string }[] = [
    { value: 'all', label: 'All Genres', icon: 'albums' },
    ...availableGenres,
  ];

  const songCountOptions = [5, 10, 15, 20];

  const difficultyOptions: { value: GameDifficulty; label: string; icon: string }[] = [
    { value: GameDifficulty.EASY, label: 'Easy', icon: 'sunny' },
    { value: GameDifficulty.MEDIUM, label: 'Medium', icon: 'partly-sunny' },
    { value: GameDifficulty.HARD, label: 'Hard', icon: 'flash' },
  ];

  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  return (
    <View className="w-full overflow-hidden rounded-3xl bg-gray-900/80 shadow-2xl backdrop-blur-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative px-6 pb-8 pt-8">
          {/* Header */}
          <View className="mb-8 items-center">
            <View className="absolute left-0 top-1 rounded-full bg-gray-800/80 p-2.5">
              <TouchableOpacity onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-3xl font-bold text-white">Configure Master Mode</Text>
            <Text className="mt-2 text-center text-base text-gray-300">
              {gameMode === GameMode.SINGLE_PLAYER ? 'Single Player' : 'Multiplayer'} - Customize
              your challenge
            </Text>
          </View>

          {/* Genre Selection */}
          <View className="mb-8">
            <Text className="mb-3 text-xl font-bold text-white">Musical Genre</Text>
            <TouchableOpacity
              onPress={() => {
                // Toggle dropdown visibility
                setIsGenreDropdownOpen(!isGenreDropdownOpen);
              }}
              className="flex-row items-center justify-between rounded-xl border border-gray-700/30 bg-gray-800/60 p-3">
              <View className="flex-row items-center">
                <View className="mr-3 rounded-full bg-white/20 p-2">
                  <Ionicons name={getGenreIcon(gameParams.genre) as any} size={20} color="white" />
                </View>
                <Text className="text-lg font-medium text-white">
                  {GENRE_DISPLAY_NAMES[
                    gameParams.genre.toUpperCase() as keyof typeof GENRE_DISPLAY_NAMES
                  ] || 'All Genres'}
                </Text>
              </View>
              <Ionicons
                name={isGenreDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            {isGenreDropdownOpen && (
              <>
                <TouchableOpacity
                  activeOpacity={0.1}
                  className="fixed inset-0 h-screen w-screen"
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}
                  onPress={() => setIsGenreDropdownOpen(false)}
                />
                <View className="z-10 mt-2 max-h-60 overflow-hidden rounded-xl border border-gray-700/30 bg-gray-800/90">
                  <ScrollView className="max-h-60" showsVerticalScrollIndicator={false}>
                    {genreOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                          onParamsChange('genre', option.value);
                          setIsGenreDropdownOpen(false);
                        }}
                        className={`flex-row items-center p-3 ${
                          gameParams.genre === option.value
                            ? 'bg-blue-600/40'
                            : 'border-b border-gray-700/20'
                        }`}>
                        <View className="mr-3 rounded-full bg-white/20 p-2">
                          <Ionicons name={option.icon as any} size={20} color="white" />
                        </View>
                        <Text className="flex-1 text-lg font-medium text-white">
                          {option.label}
                        </Text>
                        {gameParams.genre === option.value && (
                          <Ionicons name="checkmark-circle" size={24} color="white" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </View>

          {/* Number of Songs */}
          <View className="mb-8">
            <Text className="mb-3 text-xl font-bold text-white">Number of Songs</Text>
            <View className="flex-row justify-between">
              {songCountOptions.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => onParamsChange('songsCount', count)}
                  className={`items-center rounded-xl px-5 py-3 ${
                    gameParams.songsCount === count
                      ? 'border border-blue-400/20 bg-gradient-to-b from-blue-600 to-blue-700'
                      : 'border border-gray-700/30 bg-gray-800/60'
                  }`}>
                  <Text className="text-lg font-medium text-white">{count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty */}
          <View className="mb-8">
            <Text className="mb-3 text-xl font-bold text-white">Difficulty</Text>
            <View className="flex-row justify-between">
              {difficultyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => onParamsChange('difficulty', option.value)}
                  className={`mx-1 flex-1 items-center rounded-xl border py-3 ${
                    gameParams.difficulty === option.value
                      ? option.value === GameDifficulty.EASY
                        ? 'border-green-400/20 bg-gradient-to-r from-green-600 to-green-700'
                        : option.value === GameDifficulty.MEDIUM
                          ? 'border-orange-400/20 bg-gradient-to-r from-orange-500 to-orange-600'
                          : 'border-red-400/20 bg-gradient-to-r from-red-600 to-red-700'
                      : 'border-gray-700/30 bg-gray-800/60'
                  }`}>
                  <Ionicons name={option.icon as any} size={24} color="white" />
                  <Text className="mt-1 text-base font-medium text-white">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            onPress={onStartGame}
            className="mt-6 overflow-hidden rounded-xl border border-blue-400/20 bg-gradient-to-r from-blue-600 to-blue-700">
            <View className="flex-row items-center justify-center p-5">
              <Ionicons name="play-circle" size={28} color="white" />
              <Text className="ml-2 text-2xl font-bold text-white">Start Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
