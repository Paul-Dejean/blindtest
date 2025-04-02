import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSummary'>;

export const GameSummary = ({ route, navigation }: Props) => {
  const { tracks, score, isMultiplayer, playerScores } = route.params;
  const maxScore = tracks.length * 3; // 1 point for artist, 2 points for title
  const percentage = Math.round((score / maxScore) * 100);

  const handlePlayAgain = () => {
    if (route.params.onPlayAgain) {
      route.params.onPlayAgain();
    } else {
      // If no callback, navigate back to Game screen
      navigation.goBack();
    }
  };

  const handleBackToMenu = () => {
    if (route.params.onBackToMenu) {
      route.params.onBackToMenu();
    } else {
      // If no callback, navigate directly to HomeMenu screen
      navigation.navigate('HomeMenu');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black/90">
      <View className="flex h-full w-full flex-col px-4 py-5">
        <View className="w-full max-w-md flex-1 self-center rounded-2xl bg-gray-900 p-6 shadow-xl">
          <Text className="mb-6 text-center text-3xl font-bold text-white">
            {isMultiplayer ? 'Multiplayer Results' : 'Game Summary'}
          </Text>

          {isMultiplayer && playerScores ? (
            <View className="mb-4 rounded-xl bg-gray-800 p-4">
              <Text className="mb-2 text-center text-2xl font-bold text-white">Player Scores</Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="mb-1 text-lg font-semibold text-white">Player 1</Text>
                  <Text className="text-3xl font-bold text-blue-400">
                    {playerScores[1]}/{maxScore}
                  </Text>
                  <Text className="text-gray-300">
                    {Math.round((playerScores[1] / maxScore) * 100)}%
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="mb-1 text-lg font-semibold text-white">Player 2</Text>
                  <Text className="text-3xl font-bold text-green-400">
                    {playerScores[2]}/{maxScore}
                  </Text>
                  <Text className="text-gray-300">
                    {Math.round((playerScores[2] / maxScore) * 100)}%
                  </Text>
                </View>
              </View>
              <View className="mt-4 items-center border-t border-gray-700 pt-4">
                <Text className="text-lg text-white">Winner</Text>
                <Text className="text-2xl font-bold text-yellow-400">
                  {playerScores[1] > playerScores[2]
                    ? 'Player 1'
                    : playerScores[2] > playerScores[1]
                      ? 'Player 2'
                      : 'Tie'}
                </Text>
              </View>
            </View>
          ) : (
            <View className="mb-4 rounded-xl bg-gray-800 p-4">
              <Text className="text-center text-4xl font-bold text-white">
                {score}/{maxScore}
              </Text>
              <Text className="text-center text-xl text-gray-300">{percentage}% correct</Text>
            </View>
          )}

          <Text className="mb-2 text-xl font-bold text-white">Track Results</Text>
          <ScrollView className="mb-4 flex-1" showsVerticalScrollIndicator={true}>
            <View className="space-y-4">
              {tracks.map((result, index) => (
                <View key={result.track.id} className="rounded-lg bg-gray-800 p-4">
                  <Text className="mb-2 text-lg font-semibold text-white">Track {index + 1}</Text>
                  <Text className="text-xl font-bold text-white">{result.track.title}</Text>
                  <Text className="text-lg text-gray-300">by {result.track.artist.name}</Text>

                  <View className="mt-3 space-y-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-300">Artist:</Text>
                      <View className="flex-row items-center space-x-2">
                        <Text className={result.artistCorrect ? 'text-green-400' : 'text-red-400'}>
                          {result.artistCorrect ? '✓' : '✗'}
                        </Text>
                        {result.artistAnswerTime !== null && (
                          <Text className="text-gray-300">
                            {result.artistAnswerTime > 0
                              ? `${(result.artistAnswerTime / 1000).toFixed(1)}s`
                              : result.artistAnswerTime < 0
                                ? 'Skipped'
                                : 'Missed'}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-300">Title:</Text>
                      <View className="flex-row items-center space-x-2">
                        <Text className={result.titleCorrect ? 'text-green-400' : 'text-red-400'}>
                          {result.titleCorrect ? '✓' : '✗'}
                        </Text>
                        {result.titleAnswerTime !== null && (
                          <Text className="text-gray-300">
                            {result.titleAnswerTime > 0
                              ? `${(result.titleAnswerTime / 1000).toFixed(1)}s`
                              : result.titleAnswerTime < 0
                                ? 'Skipped'
                                : 'Missed'}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="space-y-4">
            <TouchableOpacity onPress={handlePlayAgain} className="rounded-xl bg-[#1DB954] p-4">
              <Text className="text-center text-lg font-semibold text-white">Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBackToMenu} className="rounded-xl bg-gray-700 p-4">
              <Text className="text-center text-lg font-semibold text-white">Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
