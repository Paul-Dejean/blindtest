import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTracks } from '../hooks/useTracks';
import { isCorrectGuess } from '../utils/stringComparison';
import { EqualizerAnimation } from './EqualizerAnimation';

interface Track {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
  duration: number;
  preview: string;
}

interface GameState {
  currentTrackIndex: number;
  score: number;
  showAnswer: boolean;
  artistGuess: string;
  titleGuess: string;
  artistGuessed: boolean;
  titleGuessed: boolean;
  artistError: string | null;
  titleError: string | null;
  artistCorrect: boolean;
  titleCorrect: boolean;
}

export const BlindTestGame = () => {
  const { tracks, isLoading, error } = useTracks();
  const { isPlaying, playTrack, stopPlaying } = useAudioPlayer();
  const [gameState, setGameState] = useState<GameState>({
    currentTrackIndex: 0,
    score: 0,
    showAnswer: false,
    artistGuess: '',
    titleGuess: '',
    artistGuessed: false,
    titleGuessed: false,
    artistError: null,
    titleError: null,
    artistCorrect: false,
    titleCorrect: false,
  });
  const [gameTracks, setGameTracks] = useState<Track[]>([]);

  const startNewGame = () => {
    // Select 10 random tracks
    const shuffled = [...tracks].sort(() => 0.5 - Math.random());
    const selectedTracks = shuffled.slice(0, 10);
    setGameTracks(selectedTracks);
    setGameState({
      currentTrackIndex: 0,
      score: 0,
      showAnswer: false,
      artistGuess: '',
      titleGuess: '',
      artistGuessed: false,
      titleGuessed: false,
      artistError: null,
      titleError: null,
      artistCorrect: false,
      titleCorrect: false,
    });
  };

  useEffect(() => {
    if (gameTracks.length === 0) return;

    const currentTrack = gameTracks[gameState.currentTrackIndex];
    playTrack(currentTrack.preview);
    setGameState((prev) => ({ ...prev, isPlaying: true }));

    return () => {
      stopPlaying();
    };
  }, [gameState.currentTrackIndex, gameTracks.length]);

  const skipTrack = async () => {
    await stopPlaying();
    setGameState((prev) => ({
      ...prev,
      showAnswer: true,
    }));
  };

  const nextTrack = async () => {
    await stopPlaying();
    setGameState((prev) => ({
      ...prev,
      currentTrackIndex: prev.currentTrackIndex + 1,
      showAnswer: false,
      artistGuess: '',
      titleGuess: '',
      artistGuessed: false,
      titleGuessed: false,
      artistError: null,
      titleError: null,
      artistCorrect: false,
      titleCorrect: false,
    }));
  };

  const submitArtistGuess = () => {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    const artistGuess = gameState.artistGuess;
    const artistName = currentTrack.artist.name;

    const isCorrect = artistGuess && isCorrectGuess(artistGuess, artistName);

    console.log('Artist guess details:', {
      artistGuess,
      artistName,
      isCorrect,
    });

    setGameState((prev) => ({
      ...prev,
      artistGuessed: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      artistError: isCorrect ? null : `Your guess is wrong`,
      artistCorrect: Boolean(isCorrect),
    }));
  };

  const submitTitleGuess = () => {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    const titleGuess = gameState.titleGuess;
    const trackTitle = currentTrack.title;

    const isCorrect = titleGuess && isCorrectGuess(titleGuess, trackTitle);

    console.log('Title guess details:', {
      titleGuess,
      trackTitle,
      isCorrect,
    });

    setGameState((prev) => ({
      ...prev,
      titleGuessed: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      titleError: isCorrect ? null : `Your guess is wrong `,
      titleCorrect: Boolean(isCorrect),
    }));
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }
  if (gameTracks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-2xl font-bold">Blind Test Game</Text>
        <TouchableOpacity onPress={startNewGame} className="rounded-full bg-[#1DB954] px-6 py-3">
          <Text className="font-semibold text-white">Start New Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentTrack = gameTracks[gameState.currentTrackIndex];

  return (
    <View className="flex-1 p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Track {gameState.currentTrackIndex + 1}/10</Text>
        <Text className="text-lg font-semibold">
          Score: {gameState.score}/{gameState.currentTrackIndex + 1}
        </Text>
      </View>

      <View className="mb-4 items-center justify-center">
        {isPlaying ? (
          <EqualizerAnimation isPlaying={isPlaying} />
        ) : (
          <Text className="text-lg text-gray-500">No Track</Text>
        )}
      </View>

      {!gameState.showAnswer ? (
        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700">Artist Name</Text>
            <TextInput
              className={`rounded-lg border p-4 ${
                gameState.artistCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Enter artist name"
              value={gameState.artistGuess}
              onChangeText={(text) => setGameState((prev) => ({ ...prev, artistGuess: text }))}
              editable={!gameState.artistGuessed}
            />
            {gameState.artistError && (
              <Text className="text-sm text-red-500">{gameState.artistError}</Text>
            )}
            {gameState.artistCorrect && (
              <Text className="text-sm text-green-500">Correct! Well done!</Text>
            )}
            {!gameState.artistGuessed && (
              <TouchableOpacity
                onPress={submitArtistGuess}
                className="rounded-full bg-blue-500 px-6 py-3">
                <Text className="text-center font-semibold text-white">Submit Artist Guess</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="space-y-2">
            <Text className="text-sm font-medium text-gray-700">Song Title</Text>
            <TextInput
              className={`rounded-lg border p-4 ${
                gameState.titleCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Enter song title"
              value={gameState.titleGuess}
              onChangeText={(text) => setGameState((prev) => ({ ...prev, titleGuess: text }))}
              editable={!gameState.titleGuessed}
            />
            {gameState.titleError && (
              <Text className="text-sm text-red-500">{gameState.titleError}</Text>
            )}
            {gameState.titleCorrect && (
              <Text className="text-sm text-green-500">Correct! Well done!</Text>
            )}
            {!gameState.titleGuessed && (
              <TouchableOpacity
                onPress={submitTitleGuess}
                className="rounded-full bg-blue-500 px-6 py-3">
                <Text className="text-center font-semibold text-white">Submit Title Guess</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={skipTrack} className="rounded-full bg-gray-500 px-6 py-3">
            <Text className="text-center font-semibold text-white">Skip Track</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-4">
          <Text className="text-center text-xl font-bold">
            {gameState.currentTrackIndex === 9 ? 'Game Over!' : 'Correct Answer:'}
          </Text>
          <Text className="text-center text-lg">
            {currentTrack.title} - {currentTrack.artist.name}
          </Text>
          <TouchableOpacity onPress={nextTrack} className="rounded-full bg-[#1DB954] px-6 py-3">
            <Text className="text-center font-semibold text-white">
              {gameState.currentTrackIndex === 9 ? 'Play Again' : 'Next Track'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
