import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

import { LessonParent } from '../entities/lesson-parent.entity';

import { LessonNameAsGame } from 'src/enum';

export const getLessonsCompletedAsGame = async (
  client: ClientProxy,
  lessonParent: LessonParent,
  userUid: number,
): Promise<number> => {
  let lessonsCompleted = 0;

  switch (lessonParent.name) {
    case LessonNameAsGame.TETRIS_GAME:
      const { bestScore: bestScoreTetris } = await firstValueFrom(
        client.send('tetris.find.scoreByUser', userUid),
      );

      if (bestScoreTetris === 0) {
        lessonsCompleted = 0;
      } else if (bestScoreTetris < 30) {
        lessonsCompleted = 1;
      } else if (bestScoreTetris < 70) {
        lessonsCompleted = 2;
      } else {
        lessonsCompleted = 3;
      }

      break;
    case LessonNameAsGame.GUESS_SQUARE_GAME:
      const { bestScore: bestScoreGuess } = await firstValueFrom(
        client.send('guessPosition.find.scoreByUser', userUid),
      );

      if (bestScoreGuess === 0) {
        lessonsCompleted = 0;
      } else if (bestScoreGuess < 10) {
        lessonsCompleted = 1;
      } else if (bestScoreGuess < 30) {
        lessonsCompleted = 2;
      } else {
        lessonsCompleted = 3;
      }

      break;
    case LessonNameAsGame.RIGHT_PIECE_ON_RIGHT_SQUARE_GAME:
      const counterLevelsCompleted = await firstValueFrom(
        client.send('pieceSquare.counter.completedLevels', userUid),
      );

      if (counterLevelsCompleted < 3) {
        lessonsCompleted = counterLevelsCompleted;
      } else {
        lessonsCompleted = 3;
      }

      break;
    case LessonNameAsGame.MEMORY_TESTER_GAME:
      const counterWorldChessLevelsCompleted = await firstValueFrom(
        client.send('worldChessChampion.counter.completedLevels', userUid),
      );

      if (counterWorldChessLevelsCompleted < 3) {
        lessonsCompleted = counterWorldChessLevelsCompleted;
      } else {
        lessonsCompleted = 3;
      }

      break;

    default:
      break;
  }

  return lessonsCompleted;
};
