import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { TrackResult } from '../types/track';

export default function GameSummary() {
  const router = useRouter();
  const { tracks, score, isMultiplayer } = useLocalSearchParams<{
    tracks: string;
    score: string;
    isMultiplayer: string;
  }>();

  const trackResults: TrackResult[] = JSON.parse(tracks || '[]');
  const finalScore = parseInt(score || '0', 10);
  const isMultiplayerMode = isMultiplayer === 'true';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Summary</Text>
      <Text style={styles.score}>Final Score: {finalScore}</Text>
      <Text style={styles.mode}>Mode: {isMultiplayerMode ? 'Multiplayer' : 'Single Player'}</Text>
      <View style={styles.tracksContainer}>
        {trackResults.map((result, index) => (
          <View key={index} style={styles.trackItem}>
            <Text style={styles.trackTitle}>{result.track.title}</Text>
            <Text style={styles.trackArtist}>{result.track.artist.name}</Text>
            <View style={styles.resultContainer}>
              <Text
                style={[
                  styles.resultText,
                  result.artistCorrect ? styles.correct : styles.incorrect,
                ]}>
                Artist: {result.artistCorrect ? 'Correct' : 'Incorrect'}
              </Text>
              <Text
                style={[
                  styles.resultText,
                  result.titleCorrect ? styles.correct : styles.incorrect,
                ]}>
                Title: {result.titleCorrect ? 'Correct' : 'Incorrect'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  score: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  mode: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  tracksContainer: {
    flex: 1,
    marginBottom: 20,
  },
  trackItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trackArtist: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  correct: {
    color: '#4CAF50',
  },
  incorrect: {
    color: '#F44336',
  },
  backButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
