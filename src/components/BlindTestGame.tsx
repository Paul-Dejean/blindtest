import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BlindTestGameProvider, useBlindTestGameContext } from '../context/BlindTestGameContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AnimatedVinyl } from './animations/AnimatedVinyl';

type Props = NativeStackScreenProps<RootStackParamList, 'BlindTestGame'>;

const BlindTestGameContent = () => {
  const {
    gameState,
    gameTracks,
    isLoading,
    isPlaying,
    currentTrack,
    timeLeft,
    skipTrack,
    submitArtistGuess,
    submitTitleGuess,
    setGameState,
    artistInputRef,
    titleInputRef,
    handleMenuPress,
  } = useBlindTestGameContext();

  if (isLoading || !gameTracks || gameTracks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-950">
      <View className="w-full bg-black pt-12">
        <View className="flex-row items-center justify-between px-8 py-4">
          <TouchableOpacity
            onPress={handleMenuPress}
            className="rounded-full bg-gray-700 px-4 py-2">
            <Text className="font-semibold text-white">← Menu</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Score: {gameState.score}</Text>
          <Text className="text-lg font-bold text-white">
            Track {gameState.currentTrackIndex + 1}/{gameTracks.length}
          </Text>
        </View>
      </View>
      <View className="flex-1 flex-col items-center justify-center">
        <View className="relative h-full w-full flex-1">
          <AnimatedVinyl isPlaying={isPlaying} />
          <View className="absolute inset-0 items-center justify-center">
            {!gameState.showAnswer && (
              <Text
                className={`text-7xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}s
              </Text>
            )}
            {gameState.showAnswer && currentTrack && (
              <View className="items-center rounded-lg bg-black/80 p-6">
                {gameState.artistCorrect && gameState.titleCorrect && (
                  <View className="mb-4 items-center">
                    <Text className="mb-2 text-6xl">🎉</Text>
                    <Text className="text-2xl font-bold text-green-400">Perfect!</Text>
                  </View>
                )}
                <Text className="mb-2 text-2xl font-bold text-white">{currentTrack.title}</Text>
                <Text className="text-xl text-white">by {currentTrack.artist.name}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className="bg-black px-4 pb-10">
        <View style={{ width: '90%', minWidth: 300 }} className="mx-auto space-y-4">
          <View className="flex-row space-x-4">
            <TextInput
              ref={artistInputRef}
              className={`flex-1 rounded-lg px-4 py-3 text-lg ${
                gameState.artistError ? 'font-bold text-red-300' : 'text-white'
              } ${
                gameState.artistCorrect
                  ? 'bg-green-600'
                  : gameState.artistError
                    ? 'bg-red-600'
                    : 'bg-gray-800'
              }`}
              placeholder="Artist"
              placeholderTextColor="#666"
              value={gameState.artistGuess}
              onChangeText={(text) => setGameState((prev) => ({ ...prev, artistGuess: text }))}
              onSubmitEditing={submitArtistGuess}
              returnKeyType="send"
              editable={!gameState.artistCorrect}
            />
            <TouchableOpacity
              onPress={submitArtistGuess}
              className={`rounded-lg px-4 py-3 ${
                gameState.artistCorrect ? 'bg-green-600' : 'bg-blue-500'
              }`}>
              <View className="relative items-center justify-center">
                {/* Hidden placeholder to lock width */}
                <Text className="text-lg font-semibold text-white opacity-0">Submit</Text>

                {/* Actual visible content */}
                <Text className="absolute text-center text-lg font-semibold text-white">
                  {gameState.artistCorrect ? '✓' : 'Submit'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="flex-row space-x-4">
            <TextInput
              ref={titleInputRef}
              className={`flex-1 rounded-lg px-4 py-3 text-lg ${
                gameState.titleError ? 'font-bold text-red-300' : 'text-white'
              } ${
                gameState.titleCorrect
                  ? 'bg-green-600'
                  : gameState.titleError
                    ? 'bg-red-600'
                    : 'bg-gray-800'
              }`}
              placeholder="Title"
              placeholderTextColor="#666"
              value={gameState.titleGuess}
              onChangeText={(text) => setGameState((prev) => ({ ...prev, titleGuess: text }))}
              onSubmitEditing={submitTitleGuess}
              returnKeyType="send"
              editable={!gameState.titleCorrect}
            />
            <TouchableOpacity
              onPress={submitTitleGuess}
              className={`rounded-lg px-4 py-3 ${
                gameState.titleCorrect ? 'bg-green-600' : 'bg-blue-500'
              }`}>
              <View className="relative items-center justify-center">
                {/* Hidden placeholder to lock width */}
                <Text className="text-lg font-semibold text-white opacity-0">Submit</Text>

                {/* Actual visible content */}
                <Text className="absolute text-center text-lg font-semibold text-white">
                  {gameState.titleCorrect ? '✓' : 'Submit'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={skipTrack}
            disabled={gameState.showAnswer}
            className={`self-center rounded-lg bg-gray-700 px-4 py-3 ${
              gameState.showAnswer ? 'opacity-0' : ''
            }`}>
            <Text className="text-center text-lg font-semibold text-white">Skip Track →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const BlindTestGame = ({ route }: Props) => {
  const { config } = route.params;

  return (
    <BlindTestGameProvider config={config}>
      <BlindTestGameContent />
    </BlindTestGameProvider>
  );
};
