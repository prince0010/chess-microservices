/*
  Puzzle Level 4 => Level 1
  Puzzle Level 5 => Level 2
  Puzzle Level 6 => Level 3
  ... so on
*/

import { LessonStoryName } from 'src/enum';
import { LessonParent } from '../entities/lesson-parent.entity';

export const getLevelNumber = (lessonParent: LessonParent): string => {
  if (lessonParent.story === LessonStoryName.EDUCATION) {
    return lessonParent.level;
  }

  const levelParts = lessonParent.level.split(' ');
  const numberLevel = Number(levelParts[1]);

  return `${levelParts[0]} ${numberLevel - differenceFactor(lessonParent)}`;
};

const differenceFactor = (lessonParent: LessonParent): number => {
  if (lessonParent.story === LessonStoryName.PUZZLE) {
    return 3; // puzzle start with 4
  }

  if (lessonParent.story === LessonStoryName.ENDGAME) {
    return 12; // endgames start with 13
  }

  return 0; // education
};
