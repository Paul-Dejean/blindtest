import { Text, View } from 'react-native';
import { Track } from '../types/track';
import React from 'react';

interface AnswerDisplayProps {
  track: Track;
  artistCorrect: boolean;
  titleCorrect: boolean;
}

export const AnswerDisplay = ({ track, artistCorrect, titleCorrect }: AnswerDisplayProps) => {
  return (
    <View
      className="mx-8 items-center rounded-xl bg-black/80 p-6"
      style={{ width: 400, maxWidth: '100%' }}>
      {artistCorrect && titleCorrect && (
        <View className="mb-4 items-center">
          <Text className="mb-2 text-6xl">🎉</Text>
          <Text className="text-2xl font-bold text-green-400">Perfect!</Text>
        </View>
      )}
      {(artistCorrect || titleCorrect) && !(artistCorrect && titleCorrect) && (
        <View className="mb-4 items-center">
          <Text className="mb-2 text-6xl">😐</Text>
          <Text className="text-2xl font-bold text-yellow-400">Mah!</Text>
        </View>
      )}
      {!artistCorrect && !titleCorrect && (
        <View className="mb-4 items-center">
          <Text className="mb-2 text-6xl">👎</Text>
          <Text className="text-2xl font-bold text-red-400">Boo!</Text>
        </View>
      )}
      <Text className="mb-2 text-2xl font-bold text-white">{track.title}</Text>
      <Text className="text-xl text-white">by {track.artist.name}</Text>

      <View className="mt-5 w-full space-y-3">
        <View className="flex-row items-center justify-between rounded-lg bg-gray-800/70 p-3">
          <Text className="text-lg text-gray-300">Artist:</Text>
          <Text
            className={`text-lg font-bold ${artistCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {artistCorrect ? 'Correct ✓' : 'Missed ✗'}
          </Text>
        </View>
        <View className="flex-row items-center justify-between rounded-lg bg-gray-800/70 p-3">
          <Text className="text-lg text-gray-300">Title:</Text>
          <Text className={`text-lg font-bold ${titleCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {titleCorrect ? 'Correct ✓' : 'Missed ✗'}
          </Text>
        </View>
      </View>
    </View>
  );
};
