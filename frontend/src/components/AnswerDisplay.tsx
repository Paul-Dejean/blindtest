import { Text, View, StyleSheet } from 'react-native';
import { Track } from '../types/track';
import React from 'react';

interface AnswerDisplayProps {
  track: Track;
  artistCorrect: boolean;
  titleCorrect: boolean;
}

export const AnswerDisplay = ({ track, artistCorrect, titleCorrect }: AnswerDisplayProps) => {
  return (
    <View style={styles.container}>
      {artistCorrect && titleCorrect && (
        <View style={styles.resultContainer}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.perfectText}>Perfect!</Text>
        </View>
      )}
      {(artistCorrect || titleCorrect) && !(artistCorrect && titleCorrect) && (
        <View style={styles.resultContainer}>
          <Text style={styles.emoji}>😐</Text>
          <Text style={styles.partialText}>Mah!</Text>
        </View>
      )}
      {!artistCorrect && !titleCorrect && (
        <View style={styles.resultContainer}>
          <Text style={styles.emoji}>👎</Text>
          <Text style={styles.failText}>Boo!</Text>
        </View>
      )}
      <Text style={styles.title}>{track.title}</Text>
      <Text style={styles.artist}>by {track.artist.name}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.resultRow}>
          <Text style={styles.label}>Artist:</Text>
          <Text
            style={[styles.resultValue, artistCorrect ? styles.correctText : styles.incorrectText]}>
            {artistCorrect ? 'Correct ✓' : 'Missed ✗'}
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.label}>Title:</Text>
          <Text
            style={[styles.resultValue, titleCorrect ? styles.correctText : styles.incorrectText]}>
            {titleCorrect ? 'Correct ✓' : 'Missed ✗'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 32,
    alignItems: 'center',
    borderRadius: 12,
    padding: 24,
    width: 400,
    maxWidth: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.95)', // This matches the main app background #111827 with high opacity
  },
  resultContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  emoji: {
    marginBottom: 8,
    fontSize: 48,
  },
  perfectText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ade80', // text-green-400
  },
  partialText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#facc15', // text-yellow-400
  },
  failText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f87171', // text-red-400
  },
  title: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  artist: {
    fontSize: 20,
    color: '#ffffff',
  },
  detailsContainer: {
    marginTop: 20,
    width: '100%',
    gap: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: 'rgba(31, 41, 55, 0.7)', // bg-gray-800/70
    padding: 12,
  },
  label: {
    fontSize: 18,
    color: '#d1d5db', // text-gray-300
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#4ade80', // text-green-400
  },
  incorrectText: {
    color: '#f87171', // text-red-400
  },
});
