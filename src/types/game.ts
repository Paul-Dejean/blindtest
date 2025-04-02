import { ITUNES_GENRES } from '../utils/itunesGenres';

export enum GameMode {
  SINGLE_PLAYER = 'SINGLE_PLAYER',
  MULTI_PLAYER = 'MULTI_PLAYER',
}

export enum GameDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum GameType {
  CUSTOM = 'CUSTOM',
  AUTO = 'AUTO',
}

export interface GameParams {
  difficulty: GameDifficulty;
  genre: Genre;
  songsCount: number;
}

export type Genre = keyof typeof ITUNES_GENRES | 'all';

export interface GameConfig {
  mode: GameMode;
  type: GameType;
  difficulty: GameDifficulty;
  genre: Genre;
  songsCount: number;
  songDuration: number;
}
