import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useRef, useState, useEffect } from 'react';
import { TextInput } from 'react-native';

import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTracks } from '../hooks/useTracks';

import { GameConfig, GameMode } from '../types/game';
import { Track, TrackResult } from '../types/track';
import { saveGameToHistory } from '../utils/storage';
import { isCorrectGuess } from '../utils/stringComparison';
import { useTimer } from '~/hooks/useTimer';

interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
}

// Convert iTunes track to our Track format
const convertToTrack = (iTunesTrack: iTunesTrack): Track => ({
  id: iTunesTrack.trackId.toString(),
  title: iTunesTrack.trackName,
  artist: {
    name: iTunesTrack.artistName,
  },
  album: {
    title: iTunesTrack.collectionName,
    cover_medium: iTunesTrack.artworkUrl100,
  },
  duration: iTunesTrack.trackTimeMillis,
  preview: iTunesTrack.previewUrl,
});

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

export function BlindTestGameProvider({ children, config }: BlindTestGameProviderProps) {
  const router = useRouter();

  const isMultiplayer = config.mode === GameMode.MULTI_PLAYER;

  // Get genre from config or default to 'all'
  const genre = config.genre || 'all';

  // Hooks
  const {
    tracks: iTunesTracks,
    isLoading,
    error: tracksError,
  } = useTracks({ genre, numberOfTracks: config.songsCount });

  const { isPlaying, error: audioError, playTrack, stopTrack } = useAudioPlayer();

  // Combine errors from different sources
  const error = (audioError || tracksError)?.toString() || null;

  // Refs
  const artistInputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);

  // State
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

  const { timeLeft, resetTimer } = useTimer({
    duration: config.songDuration,
    isRunning: true,
    onTimerEnd: () => {
      // Show the answer first
      setGameState((prev) => ({
        ...prev,
        showAnswer: true,
      }));

      // Then skip to next track after a delay
      setTimeout(() => {
        skipTrack();
      }, 3000);
    },
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
    if (!iTunesTracks) return [];

    const filteredTracks = iTunesTracks.map(convertToTrack);

    // Determine number of songs based on config
    const songsCount = config.songsCount || 10;
    return filteredTracks.slice(0, songsCount);
  }, [iTunesTracks, config]);

  // Function to move to next track
  async function nextTrack() {
    const isLastTrack = gameState.currentTrackIndex === gameTracks.length - 1;

    // Get current track
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    // Ensure the current track is saved in results (especially important for the last track)
    if (!trackResults[gameState.currentTrackIndex]) {
      updateTrackResult(currentTrack, {});
    }

    if (isLastTrack) {
      // Calculate final score
      const finalScore = gameState.score;

      // Ensure we have results for all tracks
      let finalTrackResults = [...trackResults];

      // If we're missing the last track result, add it now
      if (!finalTrackResults[gameState.currentTrackIndex]) {
        finalTrackResults[gameState.currentTrackIndex] = {
          track: currentTrack,
          artistCorrect: gameState.artistCorrect,
          titleCorrect: gameState.titleCorrect,
          artistAnswerTime: null,
          titleAnswerTime: null,
        };
      }

      // Record game history
      const gameHistory = {
        timestamp: Date.now(),
        score: finalScore,
        totalSongs: gameTracks.length,
        maxScore: gameTracks.length * 3,
        trackResults: finalTrackResults.map((result) => ({
          title: result.track.title,
          artist: result.track.artist.name,
          artistAnswerTime: result.artistAnswerTime,
          titleAnswerTime: result.titleAnswerTime,
        })),
        isMultiplayer,
      };

      // Save and navigate to summary
      await saveGameToHistory(gameHistory);
      router.push({
        pathname: '/game-summary',
        params: {
          tracks: JSON.stringify(finalTrackResults),
          score: finalScore.toString(),
          isMultiplayer: isMultiplayer.toString(),
        },
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
      }));
    }
  }

  // Function to handle menu press
  async function handleMenuPress() {
    try {
      console.log('Menu button pressed, stopping playback');
      await stopTrack();
      console.log('Navigation to menu');
      router.push('/');
    } catch (error) {
      console.error('Error navigating to menu:', error);
      // Fallback navigation
      router.push('/');
    }
  }

  // Function to handle back to menu
  function handleBackToMenu() {
    try {
      console.log('Back to menu requested');
      stopTrack(); // Stop any playing audio
      router.push('/');
    } catch (error) {
      console.error('Error navigating back to menu:', error);
      // Fallback navigation
      router.push('/');
    }
  }

  // Function to restart game
  function restartGame() {
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
    setTrackResults([]);
    router.push('/play');
  }

  // Function to skip current track
  async function skipTrack() {
    // First show the answer
    setGameState((prev) => ({
      ...prev,
      showAnswer: true,
    }));

    // Wait 3 seconds before moving to next track
    setTimeout(async () => {
      await stopTrack();
      await nextTrack();
      resetTimer();
    }, 3000);
  }

  // Function to submit artist guess
  function submitArtistGuess() {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    const isCorrect = isCorrectGuess(gameState.artistGuess, currentTrack.artist.name);
    const answerTime = Date.now() - gameState.startTime;

    setGameState((prev) => ({
      ...prev,
      artistCorrect: isCorrect,
      artistError: isCorrect ? null : 'Incorrect artist',
    }));

    updateTrackResult(currentTrack, {
      artistCorrect: isCorrect,
      artistAnswerTime: isCorrect ? answerTime : null,
    });

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 1,
        showAnswer: true, // Show answer when correct
      }));

      // If both artist and title are correct, move to next track after delay
      if (gameState.titleCorrect) {
        setTimeout(async () => {
          await nextTrack();
          resetTimer();
        }, 3000);
      }
    }
  }

  // Function to submit title guess
  function submitTitleGuess() {
    const currentTrack = gameTracks[gameState.currentTrackIndex];
    if (!currentTrack) return;

    const isCorrect = isCorrectGuess(gameState.titleGuess, currentTrack.title);
    const answerTime = Date.now() - gameState.startTime;

    setGameState((prev) => ({
      ...prev,
      titleCorrect: isCorrect,
      titleError: isCorrect ? null : 'Incorrect title',
    }));

    updateTrackResult(currentTrack, {
      titleCorrect: isCorrect,
      titleAnswerTime: isCorrect ? answerTime : null,
    });

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 1,
        showAnswer: true, // Show answer when correct
      }));

      // If both artist and title are correct, move to next track after delay
      if (gameState.artistCorrect) {
        setTimeout(async () => {
          await nextTrack();
          resetTimer();
        }, 3000);
      }
    }
  }

  // Get current track
  const currentTrack = gameTracks[gameState.currentTrackIndex] || null;

  // Add this useEffect to play the track when currentTrack changes
  useEffect(() => {
    if (currentTrack && currentTrack.preview && !isPlaying) {
      console.log('Playing current track:', currentTrack.title);
      playTrack(currentTrack.preview);
    }
  }, [currentTrack, isPlaying]);

  return (
    <BlindTestGameContext.Provider
      value={{
        gameState,
        config,
        timeLeft,
        trackResults,
        gameTracks,
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
        handleBackToMenu,
        updateTrackResult,
      }}>
      {children}
    </BlindTestGameContext.Provider>
  );
}
