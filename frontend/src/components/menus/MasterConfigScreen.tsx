import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameMode, GameParams, GameDifficulty, Genre } from '../../types/game';

interface MasterConfigScreenProps {
  gameMode: GameMode;
  gameParams: GameParams;
  onBack: () => void;
  onParamsChange: (
    key: 'genre' | 'songsCount' | 'difficulty',
    value: Genre | number | GameDifficulty
  ) => void;
  onStartGame: () => void;
}

// Define available genres
const AVAILABLE_GENRES = [
  { value: 'all', label: 'All Genres', icon: 'albums' },
  { value: 'Pop', label: 'Pop', icon: 'musical-note' },
  { value: 'Rock', label: 'Rock', icon: 'flame' },
  { value: 'Hip-Hop/Rap', label: 'Hip-Hop/Rap', icon: 'mic' },
  { value: 'Electronic/EDM', label: 'Electronic/EDM', icon: 'pulse' },
  { value: 'Jazz', label: 'Jazz', icon: 'musical-notes' },
  { value: 'Classical', label: 'Classical', icon: 'musical-note' },
  { value: 'R&B/Soul', label: 'R&B/Soul', icon: 'musical-notes' },
  { value: 'Country', label: 'Country', icon: 'musical-note' },
  { value: 'Reggae', label: 'Reggae', icon: 'musical-note' },
  { value: 'Latin', label: 'Latin', icon: 'musical-note' },
];

export const MasterConfigScreen: React.FC<MasterConfigScreenProps> = ({
  gameMode,
  gameParams,
  onBack,
  onParamsChange,
  onStartGame,
}) => {
  const songCountOptions = [5, 10, 15, 20];
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const difficultyOptions = [
    { value: GameDifficulty.EASY, label: 'Easy', icon: 'sunny' },
    { value: GameDifficulty.MEDIUM, label: 'Medium', icon: 'partly-sunny' },
    { value: GameDifficulty.HARD, label: 'Hard', icon: 'flash' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Configure Master Mode</Text>
            <Text style={styles.subtitle}>
              {gameMode === GameMode.SINGLE_PLAYER ? 'Single Player' : 'Multiplayer'} - Customize
              your challenge
            </Text>
          </View>

          {/* Genre Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Musical Genre</Text>
            <TouchableOpacity
              onPress={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              style={styles.genreButton}>
              <View style={styles.genreButtonContent}>
                <View style={styles.genreIconContainer}>
                  <Ionicons
                    name={AVAILABLE_GENRES.find((g) => g.value === gameParams.genre)?.icon as any}
                    size={20}
                    color="white"
                  />
                </View>
                <Text style={styles.genreButtonText}>
                  {AVAILABLE_GENRES.find((g) => g.value === gameParams.genre)?.label ||
                    'All Genres'}
                </Text>
              </View>
              <Ionicons
                name={isGenreDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            {isGenreDropdownOpen && (
              <>
                <TouchableOpacity
                  activeOpacity={0.1}
                  style={styles.dropdownOverlay}
                  onPress={() => setIsGenreDropdownOpen(false)}
                />
                <View style={styles.dropdown}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {AVAILABLE_GENRES.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                          onParamsChange('genre', option.value as Genre);
                          setIsGenreDropdownOpen(false);
                        }}
                        style={[
                          styles.dropdownItem,
                          gameParams.genre === option.value && styles.dropdownItemSelected,
                        ]}>
                        <View style={styles.dropdownIconContainer}>
                          <Ionicons name={option.icon as any} size={20} color="white" />
                        </View>
                        <Text style={styles.dropdownItemText}>{option.label}</Text>
                        {gameParams.genre === option.value && (
                          <Ionicons name="checkmark-circle" size={24} color="white" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </View>

          {/* Number of Songs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Number of Songs</Text>
            <View style={styles.songCountContainer}>
              {songCountOptions.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => onParamsChange('songsCount', count)}
                  style={[
                    styles.songCountButton,
                    gameParams.songsCount === count && styles.songCountButtonSelected,
                  ]}>
                  <Text style={styles.songCountButtonText}>{count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {difficultyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => onParamsChange('difficulty', option.value)}
                  style={[
                    styles.difficultyButton,
                    gameParams.difficulty === option.value && styles.difficultyButtonSelected,
                    gameParams.difficulty === option.value &&
                      option.value === GameDifficulty.EASY &&
                      styles.difficultyButtonEasy,
                    gameParams.difficulty === option.value &&
                      option.value === GameDifficulty.MEDIUM &&
                      styles.difficultyButtonMedium,
                    gameParams.difficulty === option.value &&
                      option.value === GameDifficulty.HARD &&
                      styles.difficultyButtonHard,
                  ]}>
                  <Ionicons name={option.icon as any} size={24} color="white" />
                  <Text style={styles.difficultyButtonText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity onPress={onStartGame} style={styles.startButton}>
            <View style={styles.startButtonContent}>
              <Ionicons name="play-circle" size={28} color="white" />
              <Text style={styles.startButtonText}>Start Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#d1d5db',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  genreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 12,
  },
  genreButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genreIconContainer: {
    marginRight: 12,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
  },
  genreButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  dropdown: {
    zIndex: 10,
    marginTop: 8,
    maxHeight: 240,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.2)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.4)',
  },
  dropdownIconContainer: {
    marginRight: 12,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  songCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  songCountButton: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
  },
  songCountButtonSelected: {
    borderColor: 'rgba(96, 165, 250, 0.2)',
    backgroundColor: 'rgba(37, 99, 235, 0.6)',
  },
  songCountButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
  },
  difficultyButtonSelected: {
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  difficultyButtonEasy: {
    backgroundColor: 'rgba(5, 150, 105, 0.6)',
  },
  difficultyButtonMedium: {
    backgroundColor: 'rgba(249, 115, 22, 0.6)',
  },
  difficultyButtonHard: {
    backgroundColor: 'rgba(220, 38, 38, 0.6)',
  },
  difficultyButtonText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  startButton: {
    marginTop: 24,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    backgroundColor: 'rgba(37, 99, 235, 0.6)',
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  startButtonText: {
    marginLeft: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
