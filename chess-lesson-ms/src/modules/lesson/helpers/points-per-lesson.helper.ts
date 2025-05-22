import { LessonLevel } from 'src/enum';
import { LessonParent } from '../entities/lesson-parent.entity';

export const pointsPerLesson = (lessonParent: LessonParent): number => {
  if (lessonParent.level === LessonLevel.LEVEL_1) return 1;

  // changeMe! when Level 3 appears or some high levels
  return 2;
};
