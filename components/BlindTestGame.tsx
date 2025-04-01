import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTracks } from '../hooks/useTracks';
import { RootStackParamList } from '../navigation/AppNavigator';
import { saveGameToHistory } from '../utils/storage';
import { isCorrectGuess } from '../utils/stringComparison';
import { AnimatedVinyl } from './AnimatedVinyl';
import { EqualizerAnimation } from './EqualizerAnimation';
import { GameSummary } from './GameSummary';
import { GameMode } from '../types/game';
import { Track, TrackResult } from '../types/track';

interface GameState {
  currentTrackIndex: number;
  score: number;
  showAnswer: boolean;
  artistGuess: string;
  titleGuess: string;
  artistError: string | null;
  titleError: string | null;
  artistCorrect: boolean;
  titleCorrect: boolean;
  startTime: number;
  timeLeft: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export const BlindTestGame = ({ route, navigation }: Props) => {
  const { mode } = route.params;
  const { tracks, isLoading, error } = useTracks();
  const { isPlaying, playTrack, stopPlaying } = useAudioPlayer();
  const [gameState, setGameState] = useState<GameState>({
    currentTrackIndex: 0,
    score: 0,
    showAnswer: false,
    artistGuess: '',
    titleGuess: '',
    artistError: null,
    titleError: null,
    artistCorrect: false,
    titleCorrect: false,
    startTime: Date.now(),
    timeLeft: mode === GameMode.MASTER ? 10 : 30,
  });
  const [trackResults, setTrackResults] = useState<TrackResult[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const artistInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);

  // Filter tracks based on game mode
  const gameTracks = React.useMemo(() => {
    if (!tracks) return [];
    return tracks.slice(0, mode === GameMode.MASTER ? 10 : 3);
  }, [tracks, mode]);

  // Cleanup when leaving the screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        try {
          stopPlaying();
        } catch (e) {
          console.log('Error stopping sound during cleanup:', e);
        }
      };
    }, [])
  );

  // Timer effect
  useEffect(() => {
    if (gameState.showAnswer || !isPlaying) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          skipTrack();
          return prev;
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.showAnswer, isPlaying]);

  // Reset timer when moving to next track
  useEffect(() => {
    if (gameState.currentTrackIndex > 0) {
      setGameState((prev) => ({
        ...prev,
        timeLeft: mode === GameMode.MASTER ? 10 : 30,
      }));
    }
  }, [gameState.currentTrackIndex, mode]);

  const handleMenuPress = async () => {
    try {
      await stopPlaying();
    } catch (e) {
      console.log('Error stopping sound:', e);
    }
    navigation.navigate('Menu');
  };

  useEffect(() => {
    if (gameTracks.length === 0) return;

    console.log({ gameTracks, currentTrackIndex: gameState.currentTrackIndex });
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    console.log({ currentTrack });
    playTrack(currentTrack.preview);
    setGameState((prev) => ({ ...prev, isPlaying: true, startTime: Date.now() }));

    return () => {
      stopPlaying();
    };
  }, [gameState.currentTrackIndex, gameTracks.length]);

  const skipTrack = async () => {
    await stopPlaying();

    const currentTrack = gameTracks[gameState.currentTrackIndex];

    // Add skipped track with no answer times
    setTrackResults((prev) => {
      const currentResults = [...prev];
      const currentTrackResult = currentResults[gameState.currentTrackIndex] || {
        track: currentTrack,
        titleCorrect: false,
        artistCorrect: false,
        artistAnswerTime: null,
        titleAnswerTime: null,
      };
      currentResults[gameState.currentTrackIndex] = currentTrackResult;
      return currentResults;
    });

    setGameState((prev) => ({
      ...prev,
      showAnswer: true,
    }));

    setTimeout(() => {
      nextTrack();
    }, 2000);
  };

  const nextTrack = async () => {
    if (gameState.currentTrackIndex === gameTracks.length - 1) {
      // Save game results to history with answer times
      const gameHistory = {
        timestamp: Date.now(),
        score: gameState.score,
        totalSongs: gameTracks.length,
        maxScore: gameTracks.length * 3,
        trackResults: trackResults.map((result) => ({
          title: result.track.title,
          artist: result.track.artist.name,
          artistAnswerTime: result.artistAnswerTime,
          titleAnswerTime: result.titleAnswerTime,
        })),
      };
      await saveGameToHistory(gameHistory);

      setShowSummary(true);
    } else {
      setGameState((prev) => ({
        ...prev,
        currentTrackIndex: prev.currentTrackIndex + 1,
        showAnswer: false,
        artistGuess: '',
        titleGuess: '',
        artistError: null,
        titleError: null,
        artistCorrect: false,
        titleCorrect: false,
        startTime: Date.now(),
        timeLeft: mode === GameMode.MASTER ? 10 : 30,
      }));
    }
  };

  const submitArtistGuess = () => {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    const artistGuess = gameState.artistGuess;
    const artistName = currentTrack.artist.name;
    const answerTime = Date.now() - gameState.startTime;

    const isCorrect = artistGuess && isCorrectGuess(artistGuess, artistName);

    console.log('Artist guess details:', {
      artistGuess,
      artistName,
      isCorrect,
      answerTime,
    });

    setGameState((prev) => ({
      ...prev,
      score: isCorrect && !prev.artistCorrect ? prev.score + 1 : prev.score,
      artistError: isCorrect ? null : `Try again!`,
      artistCorrect: Boolean(isCorrect),
      artistGuess: isCorrect ? artistGuess : prev.artistGuess,
      showAnswer: Boolean(isCorrect && prev.titleCorrect),
    }));

    if (isCorrect) {
      // Store the answer time when correct
      setTrackResults((prev) => {
        const currentResults = [...prev];
        const currentTrackResult = currentResults[gameState.currentTrackIndex] || {
          track: currentTrack,
          titleCorrect: false,
          artistCorrect: true,
          artistAnswerTime: answerTime,
          titleAnswerTime: null,
        };
        currentResults[gameState.currentTrackIndex] = currentTrackResult;
        return currentResults;
      });

      // If both answers are correct, wait 2 seconds then move to next track
      if (gameState.titleCorrect) {
        setTimeout(() => {
          nextTrack();
        }, 2000);
      }
    }

    if (!isCorrect) {
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          artistError: null,
          artistGuess: '',
        }));
        artistInputRef.current?.focus();
      }, 500);
    }
  };

  const submitTitleGuess = () => {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    const titleGuess = gameState.titleGuess;
    const trackTitle = currentTrack.title;
    const answerTime = Date.now() - gameState.startTime;

    const isCorrect = titleGuess && isCorrectGuess(titleGuess, trackTitle);

    console.log('Title guess details:', {
      titleGuess,
      trackTitle,
      isCorrect,
      answerTime,
    });

    setGameState((prev) => ({
      ...prev,
      score: isCorrect && !prev.titleCorrect ? prev.score + 2 : prev.score,
      titleError: isCorrect ? null : `Try again!`,
      titleCorrect: Boolean(isCorrect),
      titleGuess: isCorrect ? titleGuess : prev.titleGuess,
      showAnswer: Boolean(isCorrect && prev.artistCorrect),
    }));

    if (isCorrect) {
      // Store the answer time when correct
      setTrackResults((prev) => {
        const currentResults = [...prev];
        const currentTrackResult = currentResults[gameState.currentTrackIndex] || {
          track: currentTrack,
          titleCorrect: true,
          artistCorrect: false,
          artistAnswerTime: null,
          titleAnswerTime: answerTime,
        };
        if (!currentTrackResult.titleAnswerTime) {
          currentTrackResult.titleCorrect = true;
          currentTrackResult.titleAnswerTime = answerTime;
        }
        currentResults[gameState.currentTrackIndex] = currentTrackResult;
        return currentResults;
      });

      // If both answers are correct, wait 2 seconds then move to next track
      if (gameState.artistCorrect) {
        setTimeout(() => {
          nextTrack();
        }, 2000);
      }
    }

    if (!isCorrect) {
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          titleError: null,
          titleGuess: '',
        }));
        titleInputRef.current?.focus();
      }, 500);
    }
  };

  const handlePlayAgain = () => {
    setGameState({
      currentTrackIndex: 0,
      score: 0,
      showAnswer: false,
      artistGuess: '',
      titleGuess: '',
      artistError: null,
      titleError: null,
      artistCorrect: false,
      titleCorrect: false,
      startTime: Date.now(),
      timeLeft: mode === GameMode.MASTER ? 10 : 30,
    });
    setTrackResults([]);
    setShowSummary(false);
  };

  const handleBackToMenu = async () => {
    try {
      await stopPlaying();
    } catch (e) {
      console.log('Error stopping sound:', e);
    }
    navigation.navigate('Menu');
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Menu')}
          className="rounded-full bg-[#1DB954] px-6 py-3">
          <Text className="font-semibold text-white">Retour au menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showSummary) {
    return (
      <GameSummary
        tracks={trackResults}
        score={gameState.score}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  const currentTrack = gameTracks[gameState.currentTrackIndex];

  return (
    <View className="flex-1">
      <View className="absolute left-0 right-0 top-4 z-10 flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={handleMenuPress} className="rounded-full bg-gray-500 px-4 py-2">
          <Text className="font-semibold text-white">← Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">
          Track {gameState.currentTrackIndex + 1}/{mode === GameMode.MASTER ? 10 : 3}
        </Text>
      </View>
      <View className="flex-1 flex-col items-center justify-center">
        <View className="relative h-full w-full flex-1">
          <AnimatedVinyl />
          <View className="absolute inset-0 items-center justify-center">
            {!gameState.showAnswer && (
              <Text
                className={`text-7xl font-bold ${
                  gameState.timeLeft <= 3 ? 'text-red-500' : 'text-white'
                }`}>
                {gameState.timeLeft}s
              </Text>
            )}
            {gameState.showAnswer && (
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
      <View className="bg-black p-4 pb-10">
        <View style={{ width: '90%', minWidth: 300 }} className="mx-auto space-y-4">
          {isPlaying && (
            <View style={{ width: '100%', height: 120 }} className="mb-4">
              <EqualizerAnimation isPlaying={isPlaying} height={120} />
            </View>
          )}
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
