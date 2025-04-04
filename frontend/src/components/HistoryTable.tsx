import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { GameHistory, getGameHistory } from '../utils/storage';

type SortField = 'date' | 'score';
type SortDirection = 'asc' | 'desc';

export const HistoryTable = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const gameHistory = await getGameHistory();
    setHistory(gameHistory);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    } else {
      return sortDirection === 'asc' ? a.score - b.score : b.score - a.score;
    }
  });

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Game History</Text>
      </View>

      {history.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="mb-2 text-center text-xl text-gray-600">No games played yet</Text>
          <Text className="text-center text-gray-500">
            Play some games to see your history here
          </Text>
        </View>
      ) : (
        <>
          <View className="flex-row rounded-t-lg bg-gray-100 p-2">
            <TouchableOpacity
              onPress={() => handleSort('date')}
              className="flex-1 flex-row items-center">
              <Text className="font-semibold">Date</Text>
              {sortField === 'date' && (
                <Text className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSort('score')}
              className="flex-1 flex-row items-center">
              <Text className="font-semibold">Score</Text>
              {sortField === 'score' && (
                <Text className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</Text>
              )}
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-semibold">Songs</Text>
            </View>
          </View>

          <ScrollView className="flex-1">
            {sortedHistory.map((game, index) => (
              <View
                key={game.timestamp}
                className={`flex-row border-b border-gray-200 p-3 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                <View className="flex-1">
                  <Text>{formatDate(game.timestamp)}</Text>
                </View>
                <View className="flex-1">
                  <Text>
                    {game.score}/{game.maxScore}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text>{game.totalSongs}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};
