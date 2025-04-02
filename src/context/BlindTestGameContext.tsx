import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTimer } from '../hooks/useTimer';
import { useTracks } from '../hooks/useTracks';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GameConfig, GameMode } from '../types/game';
import { Track, TrackResult } from '../types/track';
import { saveGameToHistory } from '../utils/storage';
import { isCorrectGuess } from '../utils/stringComparison';

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
}

interface BlindTestGameContextType {
  // Game state
  gameState: GameState;
  config: GameConfig;
  timeLeft: number;

  trackResults: TrackResult[];
  isMultiplayer: boolean;

  // Derived values
  gameTracks: Track[];
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  currentTrack: Track | null;

  // Refs
  artistInputRef: React.RefObject<TextInput>;
  titleInputRef: React.RefObject<TextInput>;

  // Actions
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  handleMenuPress: () => Promise<void>;
  skipTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  submitArtistGuess: () => void;
  submitTitleGuess: () => void;
  restartGame: () => void;
  handleBackToMenu: () => void;
  updateTrackResult: (
    track: Track,
    updates: {
      artistCorrect?: boolean;
      titleCorrect?: boolean;
      artistAnswerTime?: number | null;
      titleAnswerTime?: number | null;
    }
  ) => void;
}

const BlindTestGameContext = createContext<BlindTestGameContextType | undefined>(undefined);

export function useBlindTestGameContext() {
  const context = useContext(BlindTestGameContext);
  if (context === undefined) {
    throw new Error('useBlindTestGameContext must be used within a BlindTestGameProvider');
  }
  return context;
}

interface BlindTestGameProviderProps {
  children: ReactNode;
  config: GameConfig;
}

// Get game difficulty settings based on config

export function BlindTestGameProvider({ children, config }: BlindTestGameProviderProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isMultiplayer = config.mode === GameMode.MULTI_PLAYER;

  // Get genre from config or default to 'all'
  const genre = config.genre || 'all';

  // Hooks
  const { tracks, isLoading, error: tracksError } = useTracks({ genre });
  const { isPlaying, error: audioError, playTrack, stopTrack } = useAudioPlayer();
  console.log('****** is playing : ', isPlaying);

  // Combine errors from different sources
  const error = audioError || tracksError;

  // Refs
  const artistInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);

  // State
  const [playerScores, setPlayerScores] = useState<{ [key: number]: number }>({ 1: 0, 2: 0 });
  const [trackResults, setTrackResults] = useState<TrackResult[]>([]);

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
  });

  // Centralized function to update track results
  const updateTrackResult = (
    track: Track,
    updates: {
      artistCorrect?: boolean;
      titleCorrect?: boolean;
      artistAnswerTime?: number | null;
      titleAnswerTime?: number | null;
    }
  ) => {
    setTrackResults((prev) => {
      const currentResults = [...prev];
      const currentIndex = gameState.currentTrackIndex;

      // Get existing result or create a new one
      const existingResult = currentResults[currentIndex];

      const newResult: TrackResult = {
        track,
        artistCorrect: existingResult?.artistCorrect || false,
        titleCorrect: existingResult?.titleCorrect || false,
        artistAnswerTime: existingResult?.artistAnswerTime || null,
        titleAnswerTime: existingResult?.titleAnswerTime || null,
        ...updates,
      };

      currentResults[currentIndex] = newResult;
      return currentResults;
    });
  };

  // Filter tracks based on game mode and config
  const gameTracks = React.useMemo(() => {
    if (!tracks) return [];

    // No need to filter by genre here as it's already done in useTracks
    const filteredTracks = [...tracks];

    // Determine number of songs based on config
    const songsCount = config.songsCount || 10;
    return filteredTracks.slice(0, songsCount);
  }, [tracks, config]);

  // Function to move to next track
  async function nextTrack() {
    const isLastTrack = gameState.currentTrackIndex === gameTracks.length - 1;

    if (isLastTrack) {
      // Calculate final score
      const finalScore = gameState.score;

      // Record game history
      const gameHistory = {
        timestamp: Date.now(),
        score: finalScore,
        totalSongs: gameTracks.length,
        maxScore: gameTracks.length * 3,
        trackResults: trackResults.map((result) => ({
          title: result.track.title,
          artist: result.track.artist.name,
          artistAnswerTime: result.artistAnswerTime,
          titleAnswerTime: result.titleAnswerTime,
        })),
        isMultiplayer,
        playerScores: isMultiplayer ? { ...playerScores, 2: gameState.score } : undefined,
      };

      // Save and navigate to summary
      await saveGameToHistory(gameHistory);
      navigation.navigate('GameSummary', {
        tracks: trackResults,
        score: finalScore,
        onPlayAgain: restartGame,
        onBackToMenu: handleBackToMenu,
        isMultiplayer,
        playerScores: isMultiplayer ? { ...playerScores, 2: gameState.score } : undefined,
      });
    } else {
      // Move to next track
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
      }));
      resetTimer(config.songDuration);
    }
  }

  // Function to skip current track
  async function skipTrack() {
    // Stop audio
    await stopTrack();

    // Get current track
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    // Record skip in results
    updateTrackResult(currentTrack, {});

    // Show answer
    setGameState((prev) => ({
      ...prev,
      showAnswer: true,
    }));

    // Wait 2 seconds then move to next track
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        nextTrack();
        resolve();
      }, 2000);
    });
  }

  // Use the timer hook
  const { timeLeft, resetTimer } = useTimer({
    duration: config.songDuration,
    isRunning: !gameState.showAnswer && isPlaying,
    onTimerEnd: skipTrack,
  });

  // Play track when currentTrackIndex changes
  useEffect(() => {
    if (gameTracks.length === 0 || gameState.showAnswer) return;

    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    // Reset timer for new track
    resetTimer(config.songDuration);

    // Play the track
    playTrack(currentTrack.preview);

    // Update start time for scoring
    setGameState((prev) => ({
      ...prev,
      startTime: Date.now(),
    }));

    // Clean up on unmount or when track changes
    return () => {
      stopTrack();
    };
  }, [gameState.currentTrackIndex, gameState.showAnswer, gameTracks]);

  // Handle menu button press
  const handleMenuPress = async () => {
    await stopTrack();
    navigation.navigate('HomeMenu');
  };

  // Handle artist guess submission
  const submitArtistGuess = () => {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    const artistGuess = gameState.artistGuess;
    const artistName = currentTrack.artist.name;
    const answerTime = Date.now() - gameState.startTime;
    const isCorrect = artistGuess && isCorrectGuess(artistGuess, artistName);

    // Update game state
    setGameState((prev) => ({
      ...prev,
      score: isCorrect && !prev.artistCorrect ? prev.score + 1 : prev.score,
      artistError: isCorrect ? null : `Try again!`,
      artistCorrect: Boolean(isCorrect),
      artistGuess: isCorrect ? artistGuess : prev.artistGuess,
      showAnswer: Boolean(isCorrect && prev.titleCorrect),
    }));

    if (isCorrect) {
      // Record correct answer
      updateTrackResult(currentTrack, {
        artistCorrect: true,
        artistAnswerTime: answerTime,
      });

      // If both answers correct, move to next track
      if (gameState.titleCorrect) {
        setTimeout(nextTrack, 2000);
      }
    } else {
      // Clear error and field after 500ms
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

  // Handle title guess submission
  const submitTitleGuess = () => {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    const titleGuess = gameState.titleGuess;
    const trackTitle = currentTrack.title;
    const answerTime = Date.now() - gameState.startTime;
    const isCorrect = titleGuess && isCorrectGuess(titleGuess, trackTitle);

    // Update game state
    setGameState((prev) => ({
      ...prev,
      score: isCorrect && !prev.titleCorrect ? prev.score + 2 : prev.score,
      titleError: isCorrect ? null : `Try again!`,
      titleCorrect: Boolean(isCorrect),
      titleGuess: isCorrect ? titleGuess : prev.titleGuess,
      showAnswer: Boolean(isCorrect && prev.artistCorrect),
    }));

    if (isCorrect) {
      // Record correct answer
      updateTrackResult(currentTrack, {
        titleCorrect: true,
        titleAnswerTime: answerTime,
      });

      // If both answers correct, move to next track
      if (gameState.artistCorrect) {
        setTimeout(nextTrack, 2000);
      }
    } else {
      // Clear error and field after 500ms
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

  // Restart the game
  const restartGame = () => {
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
    });
    resetTimer(config.songDuration);
    setTrackResults([]);
  };

  // Navigate back to main menu
  const handleBackToMenu = () => {
    navigation.navigate('HomeMenu');
  };

  // Current track from gameState
  const currentTrack = gameTracks[gameState.currentTrackIndex] || null;

  const value = {
    // Game state
    gameState,
    config,
    trackResults,
    timeLeft,

    playerScores,
    isMultiplayer,

    // Derived values
    gameTracks,
    isLoading,
    error,
    isPlaying,

    currentTrack,

    // Refs
    artistInputRef,
    titleInputRef,

    // Actions
    setGameState,
    handleMenuPress,
    skipTrack,
    nextTrack,
    submitArtistGuess,
    submitTitleGuess,
    restartGame,
    handleBackToMenu,
    updateTrackResult,
  };

  return <BlindTestGameContext.Provider value={value}>{children}</BlindTestGameContext.Provider>;
}
