import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { GameHistory } from '../utils/storage';

const HISTORY_KEY = '@blindtest_history';

export const useGameHistory = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading game history:', error);
    }
  };

  const saveGameToHistory = async (game: GameHistory) => {
    try {
      const newHistory = [game, ...history];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Error clearing game history:', error);
    }
  };

  return {
    history,
    saveGameToHistory,
    clearHistory,
  };
};
