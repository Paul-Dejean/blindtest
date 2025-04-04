import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { EqualizerAnimation } from '../EqualizerAnimation';

interface HomeScreenProps {
  onCreateNewGame: () => void;
  onViewHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateNewGame, onViewHistory }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="musical-notes" size={56} color="#1DB954" />
          </View>
          <Text style={styles.title}>Welcome to Blind Test</Text>
          <Text style={styles.subtitle}>Test your music knowledge and challenge yourself</Text>
        </View>

        {/* Equalizer */}
        <View style={styles.equalizerContainer}>
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={onCreateNewGame} style={styles.playButton}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="play" size={32} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Start Playing</Text>
                <Text style={styles.buttonSubtitle}>Choose your game mode</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onViewHistory} style={styles.historyButton}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="time" size={32} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>View History</Text>
                <Text style={styles.buttonSubtitle}>Check past performances</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with <Ionicons name="heart" size={16} color="#1DB954" /> by Music Lovers
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  content: {
    padding: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 56,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.2)',
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(209, 213, 219, 1)',
  },
  equalizerContainer: {
    marginBottom: 32,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
  },
  optionsContainer: {
    gap: 16,
  },
  playButton: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#1DB954',
  },
  historyButton: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#4B5563',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  buttonIcon: {
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 12,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(156, 163, 175, 1)',
  },
});
