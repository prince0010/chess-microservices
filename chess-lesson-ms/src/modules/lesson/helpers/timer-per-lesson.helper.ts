import { LessonLevel, LessonTimer } from 'src/enum';
import { LessonParent } from '../entities/lesson-parent.entity';

export const timerPerLesson = (level: string): number => {
  const storyEducationLevelsArray = [
    LessonLevel.LEVEL_1,
    LessonLevel.LEVEL_2,
    LessonLevel.LEVEL_3,
  ];

  if (storyEducationLevelsArray.includes(level as LessonLevel)) {
    return LessonTimer.STORY_EDUCATION; // 30 seconds
  }

  let timer: number = 30;
  switch (level) {
    case LessonLevel.LEVEL_4:
      timer = LessonTimer.STORY_PUZZLE_WINNING_COMBINATION;
      break;
    case LessonLevel.LEVEL_5:
      timer = LessonTimer.STORY_PUZZLE_GREAT_MOVES;
      break;
    case LessonLevel.LEVEL_6:
      timer = LessonTimer.STORY_PUZZLE_MASTER_OF_THE_MOTIVES;
      break;
    case LessonLevel.LEVEL_7:
      timer = LessonTimer.STORY_PUZZLE_THE_WIZARD;
      break;
    case LessonLevel.LEVEL_8:
      timer = LessonTimer.STORY_PUZZLE_BIG_BRAIN;
      break;
    case LessonLevel.LEVEL_9:
      timer = LessonTimer.STORY_PUZZLE_MASTER_MIND_SOLVER;
      break;
    case LessonLevel.LEVEL_10:
      timer = LessonTimer.STORY_PUZZLE_ASAP;
      break;
    case LessonLevel.LEVEL_11:
      timer = LessonTimer.STORY_PUZZLE_THE_MASTER_OF_STUDIES;
      break;
    case LessonLevel.LEVEL_12:
      timer = LessonTimer.STORY_PUZZLE_THE_BOSS;
      break;

    default:
      break;
  }

  return timer;
};
