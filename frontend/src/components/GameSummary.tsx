import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface TrackResult {
  title: string;
  artist: string;
  artistCorrect: boolean;
  titleCorrect: boolean;
  artistAnswerTime: number | null;
  titleAnswerTime: number | null;
}

interface GameSummaryProps {
  tracks: TrackResult[];
  score: number;
  isMultiplayer?: boolean;
}

// Helper to format milliseconds to seconds
const formatTime = (ms: number | null): string => {
  if (ms === null) return '-';
  return (ms / 1000).toFixed(1) + 's';
};

export const GameSummary = ({ tracks, score, isMultiplayer = false }: GameSummaryProps) => {
  const router = useRouter();

  const handlePlayAgain = () => {
    router.push('/');
  };

  const maxScore = tracks.length * 2; // 1 for artist, 1 for title
  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Summary</Text>
      <Text style={styles.scoreText}>
        Score: {score} / {maxScore} ({accuracy}%)
      </Text>

      <ScrollView style={styles.trackList}>
        {tracks.map((track, index) => (
          <View key={index} style={styles.trackItem}>
            <Text style={styles.trackNumber}>#{index + 1}</Text>
            <View style={styles.trackDetails}>
              <View style={styles.trackResultRow}>
                <Text style={styles.trackTitle}>{track.title} </Text>
                {track.titleCorrect ? (
                  <Text style={styles.correct}>✓ {formatTime(track.titleAnswerTime)}</Text>
                ) : (
                  <Text style={styles.incorrect}>✗</Text>
                )}
              </View>
              <View style={styles.trackResultRow}>
                <Text style={styles.trackArtist}>{track.artist} </Text>
                {track.artistCorrect ? (
                  <Text style={styles.correct}>✓ {formatTime(track.artistAnswerTime)}</Text>
                ) : (
                  <Text style={styles.incorrect}>✗</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2C1B47',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  trackList: {
    flex: 1,
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  trackNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 15,
    width: 30,
  },
  trackDetails: {
    flex: 1,
  },
  trackResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  trackArtist: {
    fontSize: 16,
    color: '#ddd',
  },
  correct: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  incorrect: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8b5cf6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
