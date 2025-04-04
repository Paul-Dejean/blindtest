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
      return 25;
    case GameDifficulty.MEDIUM:
      return 15;
    case GameDifficulty.HARD:
      return 10;
    default:
      return 25;
  }
};
