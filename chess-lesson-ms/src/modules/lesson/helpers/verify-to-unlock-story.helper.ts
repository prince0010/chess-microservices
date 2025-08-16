import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { LessonParent } from '../entities/lesson-parent.entity';
import { LessonStoryName } from 'src/enum';

export const verifyToUnlockNextStory = async (
  client: ClientProxy,
  userUid: number,
  lessonParent: LessonParent,
): Promise<void> => {
  if (
    lessonParent.isTest &&
    lessonParent.story === LessonStoryName.EDUCATION &&
    lessonParent.level === 'Level 10'
  ) {
    const payloadToUnlockPuzzleStory = {
      story: LessonStoryName.PUZZLE,
      userUid,
    };

    const payloadToUnlockEndgameStory = {
      story: LessonStoryName.ENDGAME,
      userUid,
    };

    // unlock story Puzzle and Endgame
    await firstValueFrom(
      client.emit('auth.unlock.story', payloadToUnlockPuzzleStory),
    );
    await firstValueFrom(
      client.emit('auth.unlock.story', payloadToUnlockEndgameStory),
    );
  }

  // changeMe! add here second validation to unlock Botgame in future
};
