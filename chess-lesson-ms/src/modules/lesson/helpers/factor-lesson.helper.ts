import { LessonLevel } from 'src/enum';
import { LessonParent } from '../entities/lesson-parent.entity';

// helper to know how many lessons needs a player to complete to unlock the next test lesson
export const getFactorLesson = (lessonParent: LessonParent): number => {
  if (lessonParent.isTest) return 0.7; // 7/10

  if (lessonParent.level === LessonLevel.LEVEL_1) return 0.5; // 10/20

  if (
    lessonParent.level === LessonLevel.LEVEL_2 ||
    lessonParent.level === LessonLevel.LEVEL_3
  )
    return 0.2; // 50/250

  // changeMe! when new Level 13 or 44 or ... appears with different proportionality
  return 0.08; // 20/250
};
