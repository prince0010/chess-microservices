import { LessonLevel } from 'src/enum';
import { LessonParent } from '../entities/lesson-parent.entity';

export const pointsPerLesson = (lessonParent: LessonParent): number => {
  if (lessonParent.level === LessonLevel.LEVEL_1) return 1;

  if (
    lessonParent.level === LessonLevel.LEVEL_2 ||
    lessonParent.level === LessonLevel.LEVEL_3
  )
    return 2;

  if (lessonParent.level === LessonLevel.LEVEL_4) return 1;
  if (lessonParent.level === LessonLevel.LEVEL_5) return 2;
  if (lessonParent.level === LessonLevel.LEVEL_6) return 3;
  if (lessonParent.level === LessonLevel.LEVEL_7) return 4;
  if (lessonParent.level === LessonLevel.LEVEL_8) return 5;
  if (lessonParent.level === LessonLevel.LEVEL_9) return 6;
  if (lessonParent.level === LessonLevel.LEVEL_10) return 7;
  if (lessonParent.level === LessonLevel.LEVEL_11) return 8;
  if (lessonParent.level === LessonLevel.LEVEL_12) return 9;

  // changeMe! when Level 13 or 14 ... appears or some high levels
  return 9;
};
