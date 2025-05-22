import { LessonLevel } from 'src/enum';
import { LessonParent } from '../entities/lesson-parent.entity';

export const getFactorLesson = (lessonParent: LessonParent): number => {
  if (lessonParent.isTest) return 0.7;

  if (lessonParent.level === LessonLevel.LEVEL_1) return 0.5;

  // changeMe! when new Level 3 or 4 or ... appears with different proportionality
  return 0.2;
};
