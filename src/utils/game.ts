import { GameDifficulty, GameType } from '~/types/game';

export const getTimeForDifficulty = ({
  difficulty,
  type,
}: {
  difficulty: GameDifficulty;
  type: GameType;
}) => {
  if (type === GameType.AUTO) return 30;

  switch (difficulty) {
    case GameDifficulty.EASY:
      return 30;
    case GameDifficulty.MEDIUM:
      return 20;
    case GameDifficulty.HARD:
      return 10;
    default:
      return 30;
  }
};
