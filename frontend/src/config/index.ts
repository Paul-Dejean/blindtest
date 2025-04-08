import { GameConfig, GameDifficulty, GameMode, GameType } from '~/types/game';

export const DEFAULT_GAME_CONFIG: GameConfig = {
  mode: GameMode.SINGLE_PLAYER,
  type: GameType.CUSTOM,
  difficulty: GameDifficulty.EASY,
  genre: 'all',
  songsCount: 5,
  songDuration: 30,
};
