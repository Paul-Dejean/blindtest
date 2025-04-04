import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { GameHistory, getGameHistory } from '../utils/storage';

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const loadedHistory = await getGameHistory();
      setHistory(loadedHistory);
      setLoading(false);
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {history.map((game, index) => (
          <View key={index} style={styles.gameCard}>
            <Text style={styles.date}>{new Date(game.timestamp).toLocaleDateString()}</Text>
            <Text style={styles.score}>
              Score: {game.score}/{game.maxScore}
            </Text>
            <Text style={styles.mode}>Mode: {game.totalSongs} songs</Text>
            <View style={styles.tracksContainer}>
              {game.trackResults.map((track, trackIndex) => (
                <View key={trackIndex} style={styles.trackItem}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackArtist}>{track.artist}</Text>
                  {track.artistAnswerTime && (
                    <Text style={styles.answerTime}>Artist: {track.artistAnswerTime}ms</Text>
                  )}
                  {track.titleAnswerTime && (
                    <Text style={styles.answerTime}>Title: {track.titleAnswerTime}ms</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  gameCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  date: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  score: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mode: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  tracksContainer: {
    marginTop: 10,
  },
  trackItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  answerTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  backButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
