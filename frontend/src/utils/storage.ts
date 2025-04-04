import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameHistory {
  timestamp: number;
  score: number;
  totalSongs: number;
  maxScore: number;
  trackResults: {
    title: string;
    artist: string;
    artistAnswerTime: number | null;
    titleAnswerTime: number | null;
  }[];
}

const HISTORY_KEY = '@blindtest_history';

export const saveGameToHistory = async (game: GameHistory) => {
  try {
    const existingHistory = await getGameHistory();
    const updatedHistory = [game, ...existingHistory];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error saving game to history:', error);
    return false;
  }
};

export const getGameHistory = async (): Promise<GameHistory[]> => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting game history:', error);
    return [];
  }
};
