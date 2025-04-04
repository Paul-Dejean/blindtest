import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameHistory {
  timestamp: number;
  score: number;
  totalSongs: number;
  maxScore: number;
  trackResults: {
    title: string;
    artist: string;
    artistCorrect: boolean;
    titleCorrect: boolean;
  }[];
  isMultiplayer: boolean;
}

const HISTORY_KEY = '@blindtest_history';
const MAX_HISTORY_ITEMS = 20; // Maximum number of history items to keep

export async function saveGameToHistory(gameHistory: GameHistory) {
  try {
    // Get existing history
    const existingHistory = await getGameHistory();

    // Add new game to the beginning of history
    const updatedHistory = [gameHistory, ...existingHistory];

    // Trim history to prevent storage quota issues
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    // Save the trimmed history
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error('Error saving game history:', error);

    // If quota exceeded, try removing older entries
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      try {
        const existingHistory = await getGameHistory();

        // Remove half of the older entries
        const reducedHistory = existingHistory.slice(0, Math.floor(existingHistory.length / 2));

        // Add new game to the reduced history
        const updatedHistory = [gameHistory, ...reducedHistory];

        // Save the reduced history
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return true;
      } catch (retryError) {
        console.error('Failed to save even with reduced history:', retryError);
        return false;
      }
    }

    return false;
  }
}

export async function getGameHistory() {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting game history:', error);
    return [];
  }
}

export async function clearGameHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game history:', error);
    return false;
  }
}
