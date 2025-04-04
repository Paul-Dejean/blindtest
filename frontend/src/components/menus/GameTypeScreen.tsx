import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { EqualizerAnimation } from '../EqualizerAnimation';

import { GameMode, GameType } from '../../types/game';

interface GameTypeScreenProps {
  gameMode: GameMode;
  onBack: () => void;
  onSelectGameType: (type: GameType) => void;
}

export const GameTypeScreen: React.FC<GameTypeScreenProps> = ({
  gameMode,
  onBack,
  onSelectGameType,
}) => {
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
          <Text style={styles.title}>Game Type</Text>
          <Text style={styles.subtitle}>
            {gameMode === GameMode.SINGLE_PLAYER ? 'Single Player' : 'Multiplayer'} - Choose game
            mode
          </Text>
        </View>

        {/* Equalizer */}
        <View style={styles.equalizerContainer}>
          <View style={{ width: '100%', height: 120 }}>
            <EqualizerAnimation isPlaying={true} height={120} />
          </View>
        </View>

        {/* Game Type Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => onSelectGameType(GameType.AUTO)}
            style={styles.autoButton}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="flash" size={32} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Automatic Mode</Text>
                <Text style={styles.buttonSubtitle}>Quick play - 5 songs</Text>
                <Text style={styles.buttonDescription}>Start playing immediately</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSelectGameType(GameType.CUSTOM)}
            style={styles.customButton}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Ionicons name="settings" size={32} color="white" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>Master Mode</Text>
                <Text style={styles.buttonSubtitle}>Customizable challenge</Text>
                <Text style={styles.buttonDescription}>Configure your game</Text>
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
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 4,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 20,
    padding: 10,
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
  autoButton: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#1DB954',
  },
  customButton: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#2563EB',
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
