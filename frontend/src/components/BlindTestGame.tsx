import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBlindTestGameContext } from '../context/BlindTestGameContext';
import { AnimatedVinyl } from './animations/AnimatedVinyl';
import { AnswerDisplay } from './AnswerDisplay';

export const BlindTestGame = () => {
  const {
    gameState,
    gameTracks,
    isLoading,
    isPlaying,
    currentTrack,
    timeLeft,
    skipTrack,
    submitArtistGuess,
    submitTitleGuess,
    setGameState,
    artistInputRef,
    titleInputRef,
    handleMenuPress,
  } = useBlindTestGameContext();

  if (isLoading || !gameTracks || gameTracks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              console.log('Menu button pressed in component');
              handleMenuPress();
            }}
            style={styles.menuButton}
            activeOpacity={0.7}>
            <Text style={styles.menuButtonText}>← Menu</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Score: {gameState.score}</Text>
          <Text style={styles.headerText}>
            Track {gameState.currentTrackIndex + 1}/{gameTracks.length}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.vinylContainer}>
          <AnimatedVinyl isPlaying={isPlaying} />
          <View style={styles.timerContainer}>
            {!gameState.showAnswer && (
              <Text style={[styles.timerText, timeLeft <= 3 && styles.timerTextRed]}>
                {timeLeft}s
              </Text>
            )}
            {gameState.showAnswer && currentTrack && (
              <AnswerDisplay
                track={currentTrack}
                artistCorrect={gameState.artistCorrect}
                titleCorrect={gameState.titleCorrect}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputRow}>
            <TextInput
              ref={artistInputRef}
              style={[
                styles.input,
                gameState.artistError && styles.inputError,
                gameState.artistCorrect && styles.inputCorrect,
                gameState.artistError && styles.inputError,
              ]}
              placeholder="Artist"
              placeholderTextColor="#666"
              value={gameState.artistGuess}
              onChangeText={(text) => setGameState((prev) => ({ ...prev, artistGuess: text }))}
              onSubmitEditing={submitArtistGuess}
              returnKeyType="send"
              editable={!gameState.artistCorrect}
            />
            <TouchableOpacity
              onPress={submitArtistGuess}
              style={[styles.submitButton, gameState.artistCorrect && styles.submitButtonCorrect]}>
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>Submit</Text>
                <Text style={styles.submitButtonVisibleText}>
                  {gameState.artistCorrect ? '✓' : 'Submit'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              ref={titleInputRef}
              style={[
                styles.input,
                gameState.titleError && styles.inputError,
                gameState.titleCorrect && styles.inputCorrect,
                gameState.titleError && styles.inputError,
              ]}
              placeholder="Title"
              placeholderTextColor="#666"
              value={gameState.titleGuess}
              onChangeText={(text) => setGameState((prev) => ({ ...prev, titleGuess: text }))}
              onSubmitEditing={submitTitleGuess}
              returnKeyType="send"
              editable={!gameState.titleCorrect}
            />
            <TouchableOpacity
              onPress={submitTitleGuess}
              style={[styles.submitButton, gameState.titleCorrect && styles.submitButtonCorrect]}>
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>Submit</Text>
                <Text style={styles.submitButtonVisibleText}>
                  {gameState.titleCorrect ? '✓' : 'Submit'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={skipTrack}
            disabled={gameState.showAnswer}
            style={[styles.skipButton, gameState.showAnswer && styles.skipButtonDisabled]}>
            <Text
              style={[
                styles.skipButtonText,
                gameState.showAnswer && styles.skipButtonTextDisabled,
              ]}>
              Skip Track →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1B47',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 16,
    backgroundColor: '#000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  menuButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 9999,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylContainer: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  timerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerTextRed: {
    color: '#ef4444',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: '#000',
  },
  inputWrapper: {
    width: '90%',
    minWidth: 300,
    marginHorizontal: 'auto',
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#1f2937',
  },
  inputError: {
    fontWeight: 'bold',
    color: '#fca5a5',
    backgroundColor: '#dc2626',
  },
  inputCorrect: {
    backgroundColor: '#059669',
  },
  submitButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
  },
  submitButtonCorrect: {
    backgroundColor: '#059669',
  },
  submitButtonContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    opacity: 0,
  },
  submitButtonVisibleText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  skipButton: {
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButtonDisabled: {
    backgroundColor: '#1f2937',
    opacity: 0.5,
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  skipButtonTextDisabled: {
    color: '#6b7280',
  },
});
