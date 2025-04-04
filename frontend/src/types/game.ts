export type Genre =
  | 'all'
  | 'Pop'
  | 'Rock'
  | 'Hip-Hop/Rap'
  | 'Electronic/EDM'
  | 'Jazz'
  | 'Classical'
  | 'R&B/Soul'
  | 'Country'
  | 'Reggae'
  | 'Latin';

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

export interface GameConfig {
  mode: GameMode;
  type: GameType;
  difficulty: GameDifficulty;
  genre: Genre;
  songsCount: number;
  songDuration: number;
}
