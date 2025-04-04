import React from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GameSummary } from '../src/components/GameSummary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrackResult } from '../src/types/track';

export default function GameSummaryScreen() {
  const { tracks, score, isMultiplayer } = useLocalSearchParams<{
    tracks: string;
    score: string;
    isMultiplayer: string;
  }>();

  // Parse the data from URL parameters
  const rawTracks = tracks ? JSON.parse(tracks) : [];
  const parsedScore = score ? parseInt(score, 10) : 0;
  const isMultiplayerMode = isMultiplayer === 'true';

  // Transform the track data to the format expected by GameSummary if needed
  const formattedTracks = rawTracks.map((track: any) => ({
    title: track.track?.title || track.title,
    artist: track.track?.artist?.name || track.artist,
    artistCorrect: track.artistCorrect,
    titleCorrect: track.titleCorrect,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <GameSummary tracks={formattedTracks} score={parsedScore} isMultiplayer={isMultiplayerMode} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1B47',
  },
});
