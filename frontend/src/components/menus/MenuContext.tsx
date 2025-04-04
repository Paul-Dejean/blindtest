import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';

import { GameConfig, GameDifficulty, GameMode, GameParams, GameType } from '../../types/game';

import { getTimeForDifficulty } from '../../utils/game';

type Screen = 'home' | 'gameMode' | 'gameType' | 'masterConfig';

interface MenuContextType {
  // Current screen state
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;

  gameMode: GameMode | null;
  gameType: GameType | null;
  gameParams: GameParams;
  setGameType: (type: GameType) => void;
  setGameMode: (mode: GameMode) => void;
  setGameParams: (params: GameParams) => void;

  // Actions
  handleBack: () => void;
  handleParamsChange: (key: 'genre' | 'songsCount' | 'difficulty', value: any) => void;
  handleCreateNewGame: () => void;
  handleViewHistory: () => void;
  handleSelectGameMode: (mode: GameMode) => void;
  handleSelectGameType: (type: GameType) => void;
  startGame: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
}

interface MenuProviderProps {
  children: ReactNode;
}

const initialGameParams: GameParams = {
  songsCount: 5,
  difficulty: GameDifficulty.EASY,
  genre: 'all',
};

export function MenuProvider({ children }: MenuProviderProps) {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.SINGLE_PLAYER);
  const [gameType, setGameType] = useState<GameType>(GameType.AUTO);

  const [gameParams, setGameParams] = useState<GameParams>(initialGameParams);

  const handleBack = () => {
    switch (currentScreen) {
      case 'gameMode':
        setCurrentScreen('home');
        break;
      case 'gameType':
        setCurrentScreen('gameMode');
        break;
      case 'masterConfig':
        setCurrentScreen('gameType');
        break;
    }
  };

  const handleParamsChange = (key: 'genre' | 'songsCount' | 'difficulty', value: any) => {
    setGameParams((prev) => ({ ...prev, [key]: value }));
  };

  const startGame = () => {
    const config: GameConfig = {
      mode: gameMode,
      type: gameType,
      ...gameParams,
      songDuration: getTimeForDifficulty({ difficulty: gameParams.difficulty, type: gameType }),
    };

    console.log({ config });

    router.push({
      pathname: '/play',
      params: {
        config: JSON.stringify(config),
      },
    });
  };

  const handleCreateNewGame = () => {
    setCurrentScreen('gameMode');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentScreen('gameType');
  };

  const handleSelectGameType = (type: GameType) => {
    setGameType(type);
    if (type === GameType.AUTO) {
      startGame();
    } else {
      setCurrentScreen('masterConfig');
    }
  };

  const value = {
    currentScreen,
    setCurrentScreen,
    gameMode,
    gameType,
    gameParams,
    setGameType,
    setGameMode,
    setGameParams,
    handleBack,
    handleParamsChange,
    handleCreateNewGame,
    handleViewHistory,
    handleSelectGameMode,
    handleSelectGameType,
    startGame,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}
