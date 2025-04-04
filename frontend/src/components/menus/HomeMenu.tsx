import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

import { GameTypeScreen } from './GameTypeScreen';
import { HomeScreen } from './HomeScreen';
import { MasterConfigScreen } from './MasterConfigScreen';
import { useMenuContext } from './MenuContext';
import { PlayerModeScreen } from './PlayerModeScreen';

export const HomeMenu: React.FC = () => {
  const {
    currentScreen,
    gameMode,
    gameParams,
    handleBack,
    handleParamsChange,
    handleCreateNewGame,
    handleViewHistory,
    handleSelectGameMode,
    handleSelectGameType,
    startGame,
  } = useMenuContext();

  return (
    <LinearGradient
      colors={['#1e003c', '#4a0072', '#7b1fa2']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <View className="flex-1 items-center justify-center px-4 py-8">
        <View className="w-full max-w-xl">
          {currentScreen === 'home' && (
            <HomeScreen onCreateNewGame={handleCreateNewGame} onViewHistory={handleViewHistory} />
          )}

          {currentScreen === 'gameMode' && (
            <PlayerModeScreen onBack={handleBack} onSelectGameMode={handleSelectGameMode} />
          )}

          {currentScreen === 'gameType' && (
            <GameTypeScreen
              gameMode={gameMode!}
              onBack={handleBack}
              onSelectGameType={handleSelectGameType}
            />
          )}

          {currentScreen === 'masterConfig' && (
            <MasterConfigScreen
              gameMode={gameMode!}
              gameParams={gameParams}
              onBack={handleBack}
              onParamsChange={handleParamsChange}
              onStartGame={startGame}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
};
