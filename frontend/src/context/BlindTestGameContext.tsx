import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTimer } from '../hooks/useTimer';
import { useTracks } from '../hooks/useTracks';
import { GameConfig, GameHistory, GameMode } from '../types/game';
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

  // Derived values
  tracks: Track[];
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

const ANSWER_DELAY = 2000;

const BlindTestGameContext = createContext<BlindTestGameContextType | undefined>(undefined);

function createInitialGameState(): GameState {
  return {
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
  };
}

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

export function BlindTestGameProvider({ children, config }: BlindTestGameProviderProps) {
  const router = useRouter();

  const isMultiplayer = config.mode === GameMode.MULTI_PLAYER;

  const {
    tracks,
    isLoading,
    error: tracksError,
  } = useTracks({ genre: config.genre, numberOfTracks: config.songsCount });

  const { isPlaying, error: audioError, playTrack, stopTrack } = useAudioPlayer();

  const error = (audioError || tracksError)?.toString() || null;

  const artistInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);

  const [trackResults, setTrackResults] = useState<TrackResult[]>([]);

  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const { timeLeft, resetTimer } = useTimer({
    duration: config.songDuration,
    isRunning: true,
    onTimerEnd: () => {
      showAnswerPanel();
    },
  });

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

  async function showAnswerPanel() {
    const currentTrack = getCurrentTrack();
    updateTrackResult(currentTrack, {
      artistCorrect: gameState.artistCorrect,
      titleCorrect: gameState.titleCorrect,
    });

    setGameState((prev) => ({
      ...prev,
      showAnswer: true,
    }));

    setTimeout(async () => {
      await nextTrack();
    }, ANSWER_DELAY);
  }

  async function onGameEnd() {
    const finalScore = gameState.score;
    const finalTrackResults = [...trackResults];

    const gameHistory: GameHistory = {
      timestamp: Date.now(),
      score: finalScore,
      totalSongs: tracks.length,
      maxScore: tracks.length * 2, // Only counting title and artist as 1 point each
      trackResults: finalTrackResults.map((result) => ({
        // Include all necessary data
        title: result.track.title,
        artist: result.track.artist.name,
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
        artistAnswerTime: result.artistAnswerTime,
        titleAnswerTime: result.titleAnswerTime,
      })),
      isMultiplayer,
    };

    try {
      await saveGameToHistory(gameHistory);

      const summaryTracks = finalTrackResults.map((result) => ({
        track: {
          title: result.track.title,
          artist: {
            name: result.track.artist.name,
          },
        },
        artistCorrect: result.artistCorrect,
        titleCorrect: result.titleCorrect,
        artistAnswerTime: result.artistAnswerTime,
        titleAnswerTime: result.titleAnswerTime,
      }));

      router.push({
        pathname: '/game-summary',
        params: {
          tracks: JSON.stringify(summaryTracks),
          score: finalScore.toString(),
          isMultiplayer: isMultiplayer.toString(),
        },
      });
    } catch (error) {
      console.error('Error navigating to game summary:', error);
    }
  }

  function getCurrentTrack() {
    const currentTrack = tracks[gameState.currentTrackIndex];
    if (!currentTrack) {
      throw new Error('No current track');
    }
    return currentTrack;
  }

  async function nextTrack() {
    await stopTrackIfPlaying();
    if (gameState.currentTrackIndex === tracks.length - 1) {
      await onGameEnd();
      return;
    }

    setGameState((prev) => ({
      ...prev,
      currentTrackIndex: prev.currentTrackIndex + 1,
      artistGuess: '',
      titleGuess: '',
      artistCorrect: false,
      titleCorrect: false,
      artistError: null,
      titleError: null,
      showAnswer: false,
      startTime: Date.now(),
    }));

    artistInputRef.current?.focus();
  }

  async function stopTrackIfPlaying() {
    if (!isPlaying) return;
    try {
      await stopTrack();
    } catch (error) {
      console.error(`Error stopping track:`, error);
    }
  }

  async function handleMenuPress() {
    await stopTrackIfPlaying();
    router.push('/');
  }

  function restartGame() {
    setGameState(createInitialGameState());
    setTrackResults([]);
    router.push('/play');
  }

  async function skipTrack() {
    await showAnswerPanel();
  }

  async function submitArtistGuess() {
    if (!gameState.artistCorrect) return;
    const currentTrack = getCurrentTrack();

    const isCorrect = isCorrectGuess(gameState.artistGuess, currentTrack.artist.name);

    const answerTime = Date.now() - gameState.startTime;
    updateTrackResult(currentTrack, {
      artistCorrect: isCorrect,
      artistAnswerTime: isCorrect ? answerTime : null,
    });

    if (!isCorrect) {
      setGameState((prev) => ({
        ...prev,
        artistError: 'Incorrect artist',
        artistGuess: '',
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      artistCorrect: true,
      artistError: null,
      score: prev.score + 1,
    }));

    if (!gameState.titleCorrect) {
      titleInputRef.current?.focus();
      return;
    }

    await showAnswerPanel();
  }

  async function submitTitleGuess() {
    if (gameState.titleCorrect) return;
    const currentTrack = getCurrentTrack();

    const isCorrect = isCorrectGuess(gameState.titleGuess, currentTrack.title);
    const answerTime = Date.now() - gameState.startTime;
    updateTrackResult(currentTrack, {
      artistCorrect: isCorrect,
      artistAnswerTime: isCorrect ? answerTime : null,
    });
    if (!isCorrect) {
      setGameState((prev) => ({
        ...prev,
        titleError: 'Incorrect title',
        titleGuess: '',
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      score: prev.score + 2,
      titleCorrect: true,
      titleError: null,
    }));

    if (!gameState.artistCorrect) {
      artistInputRef.current?.focus();
      return;
    }
    await showAnswerPanel();
  }

  const currentTrack = tracks[gameState.currentTrackIndex] || null;

  useEffect(() => {
    if (currentTrack && currentTrack.preview) {
      console.log('Playing current track:', currentTrack.title);
      playTrack(currentTrack.preview);
      resetTimer();
    }
  }, [currentTrack]);

  return (
    <BlindTestGameContext.Provider
      value={{
        gameState,
        config,
        timeLeft,
        trackResults,
        tracks,
        isLoading,
        error,
        isPlaying,
        currentTrack,
        artistInputRef,
        titleInputRef,
        setGameState,
        handleMenuPress,
        skipTrack,
        nextTrack,
        submitArtistGuess,
        submitTitleGuess,
        restartGame,
        updateTrackResult,
      }}>
      {children}
    </BlindTestGameContext.Provider>
  );
}
