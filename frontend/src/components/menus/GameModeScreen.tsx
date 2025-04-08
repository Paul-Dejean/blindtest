import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { GameMode } from '../../types/game';
import { EqualizerAnimation } from '../EqualizerAnimation';

interface GameModeScreenProps {
  onSelectGameMode: (mode: GameMode) => void;
  onBack: () => void;
}

export const GameModeScreen: React.FC<GameModeScreenProps> = ({ onSelectGameMode, onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Select Game Mode</Text>
          <Text style={styles.subtitle}>Choose how you want to play</Text>
        </View>

        {/* Equalizer */}
        <View style={styles.equalizerContainer}>
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        {/* Game Mode Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.singlePlayerButton}
            onPress={() => onSelectGameMode(GameMode.SINGLE_PLAYER)}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="person" size={32} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Single Player</Text>
                <Text style={styles.buttonSubtitle}>Play alone and challenge yourself</Text>
                <Text style={styles.buttonDescription}>Test your music knowledge</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.multiPlayerButton}
            onPress={() => onSelectGameMode(GameMode.MULTI_PLAYER)}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="people" size={32} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Multiplayer</Text>
                <Text style={styles.buttonSubtitle}>Play with friends and compete</Text>
                <Text style={styles.buttonDescription}>Who knows music better?</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
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
    marginTop: 40,
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: -36,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
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
  singlePlayerButton: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#1DB954',
  },
  multiPlayerButton: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#6366F1',
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
  buttonDescription: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
