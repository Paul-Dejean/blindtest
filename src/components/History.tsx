import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useGameHistory } from '../hooks/useGameHistory';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GameHistory } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'GameHistory'>;

// Group games by date
interface GroupedGames {
  [key: string]: GameHistory[];
}

export const History = ({ navigation }: Props) => {
  const { history, clearHistory } = useGameHistory();
  const [expandedGames, setExpandedGames] = useState<{ [key: number]: boolean }>({});
  const [expandedDates, setExpandedDates] = useState<{ [key: string]: boolean }>({});

  // Group games by date
  const gamesByDate = useMemo(() => {
    const grouped: GroupedGames = {};

    history.forEach((game) => {
      const date = new Date(game.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(game);
    });

    // Initially expand the most recent date
    if (Object.keys(grouped).length > 0 && Object.keys(expandedDates).length === 0) {
      const mostRecentDate = Object.keys(grouped).sort().reverse()[0];
      setExpandedDates({ [mostRecentDate]: true });
    }

    return grouped;
  }, [history]);

  // Format time for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Toggle game expansion
  const toggleGameExpansion = (timestamp: number) => {
    setExpandedGames((prev) => ({
      ...prev,
      [timestamp]: !prev[timestamp],
    }));
  };

  // Toggle date expansion
  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <View className="flex-1 bg-black/90">
      <View className="flex-1 p-4">
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Game History</Text>
          <TouchableOpacity onPress={clearHistory} className="rounded-lg bg-red-500 px-4 py-2">
            <Text className="font-semibold text-white">Clear History</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {Object.keys(gamesByDate).length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-lg text-gray-400">No games played yet</Text>
            </View>
          ) : (
            <View className="space-y-6">
              {Object.entries(gamesByDate)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, games]) => (
                  <View key={date} className="overflow-hidden rounded-xl bg-gray-800/70">
                    <TouchableOpacity
                      onPress={() => toggleDateExpansion(date)}
                      className="flex-row items-center justify-between border-b border-gray-700 p-4">
                      <Text className="text-xl font-bold text-white">{date}</Text>
                      <View className="flex-row items-center">
                        <Text className="mr-2 text-gray-300">
                          {games.length} game{games.length !== 1 ? 's' : ''}
                        </Text>
                        <Ionicons
                          name={expandedDates[date] ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>

                    {expandedDates[date] && (
                      <View className="bg-gray-900/60 p-3">
                        <View className="space-y-3">
                          {games
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((game) => (
                              <View
                                key={game.timestamp}
                                className="overflow-hidden rounded-lg bg-gray-800/90">
                                <TouchableOpacity
                                  onPress={() => toggleGameExpansion(game.timestamp)}
                                  className="flex-row items-center justify-between p-3">
                                  <View className="flex-1">
                                    <View className="flex-row items-center justify-between">
                                      <Text className="text-lg font-semibold text-white">
                                        {formatTime(game.timestamp)}
                                      </Text>
                                      <Text className="text-lg font-bold text-white">
                                        {game.score}/{game.maxScore}
                                        <Text className="ml-2 text-gray-300">
                                          ({Math.round((game.score / game.maxScore) * 100)}%)
                                        </Text>
                                      </Text>
                                    </View>
                                    <Text className="text-sm text-gray-400">
                                      {game.totalSongs} songs played
                                    </Text>
                                  </View>
                                  <Ionicons
                                    name={
                                      expandedGames[game.timestamp] ? 'chevron-up' : 'chevron-down'
                                    }
                                    size={20}
                                    color="white"
                                  />
                                </TouchableOpacity>

                                {expandedGames[game.timestamp] && (
                                  <View className="border-t border-gray-700/40 p-3 pt-0">
                                    <View className="mt-2 space-y-2">
                                      {game.trackResults && game.trackResults.length > 0 ? (
                                        game.trackResults.map((result, trackIndex: number) => (
                                          <View
                                            key={trackIndex}
                                            className="rounded-lg bg-gray-700/70 p-3">
                                            <Text className="font-medium text-white">
                                              {result && result.title
                                                ? result.title
                                                : 'Unknown Title'}
                                            </Text>
                                            <Text className="text-sm text-gray-400">
                                              by{' '}
                                              {result && result.artist
                                                ? result.artist
                                                : 'Unknown Artist'}
                                            </Text>
                                            <View className="mt-2 flex-row justify-between">
                                              <Text
                                                className={
                                                  result && result.artistAnswerTime !== null
                                                    ? result.artistAnswerTime > 0
                                                      ? 'text-green-400'
                                                      : 'text-red-400'
                                                    : 'text-red-400'
                                                }>
                                                {result && result.artistAnswerTime !== null
                                                  ? result.artistAnswerTime > 0
                                                    ? `Artist: ${(result.artistAnswerTime / 1000).toFixed(1)}s`
                                                    : result.artistAnswerTime < 0
                                                      ? 'Artist: Skipped'
                                                      : 'Artist: Missed'
                                                  : 'Artist: Missed'}
                                              </Text>
                                              <Text
                                                className={
                                                  result && result.titleAnswerTime !== null
                                                    ? result.titleAnswerTime > 0
                                                      ? 'text-green-400'
                                                      : 'text-red-400'
                                                    : 'text-red-400'
                                                }>
                                                {result && result.titleAnswerTime !== null
                                                  ? result.titleAnswerTime > 0
                                                    ? `Title: ${(result.titleAnswerTime / 1000).toFixed(1)}s`
                                                    : result.titleAnswerTime < 0
                                                      ? 'Title: Skipped'
                                                      : 'Title: Missed'
                                                  : 'Title: Missed'}
                                              </Text>
                                            </View>
                                          </View>
                                        ))
                                      ) : (
                                        <View className="rounded-lg bg-gray-700/70 p-3">
                                          <Text className="text-center font-medium text-white">
                                            No track details available
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                )}
                              </View>
                            ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate('HomeMenu')}
          className="mt-4 rounded-xl bg-gray-700 p-4">
          <Text className="text-center text-lg font-semibold text-white">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
