import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useGameHistory } from '../hooks/useGameHistory';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GameHistory } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'GameHistory'>;

export const History = ({ navigation }: Props) => {
  const { history, clearHistory } = useGameHistory();

  console.log('History data:', JSON.stringify(history));

  if (history.length > 0 && history[0].trackResults) {
    console.log('First game track results:', JSON.stringify(history[0].trackResults));
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          {history.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-lg text-gray-400">No games played yet</Text>
            </View>
          ) : (
            <View className="space-y-4">
              {history.map((game: GameHistory, index: number) => (
                <View key={game.timestamp} className="rounded-xl bg-gray-900 p-4 shadow-lg">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-white">
                      Game {history.length - index}
                    </Text>
                    <Text className="text-sm text-gray-400">{formatDate(game.timestamp)}</Text>
                  </View>

                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-white">
                      {game.score}/{game.maxScore}
                    </Text>
                    <Text className="text-lg text-gray-300">
                      {Math.round((game.score / game.maxScore) * 100)}%
                    </Text>
                  </View>

                  <View className="space-y-2">
                    {game.trackResults && game.trackResults.length > 0 ? (
                      game.trackResults.map((result, trackIndex: number) => (
                        <View key={trackIndex} className="rounded-lg bg-gray-800 p-3">
                          <Text className="font-medium text-white">
                            {result && result.title ? result.title : 'Unknown Title'}
                          </Text>
                          <Text className="text-sm text-gray-400">
                            by {result && result.artist ? result.artist : 'Unknown Artist'}
                          </Text>
                          <View className="mt-2 flex-row justify-between">
                            <Text
                              className={
                                result && result.artistAnswerTime !== null
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }>
                              {result && result.artistAnswerTime !== null
                                ? `Artist: ${(result.artistAnswerTime / 1000).toFixed(1)}s`
                                : 'Artist: Not found'}
                            </Text>
                            <Text
                              className={
                                result && result.titleAnswerTime !== null
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }>
                              {result && result.titleAnswerTime !== null
                                ? `Title: ${(result.titleAnswerTime / 1000).toFixed(1)}s`
                                : 'Title: Not found'}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View className="rounded-lg bg-gray-800 p-3">
                        <Text className="text-center font-medium text-white">
                          No track details available
                        </Text>
                      </View>
                    )}
                  </View>
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
