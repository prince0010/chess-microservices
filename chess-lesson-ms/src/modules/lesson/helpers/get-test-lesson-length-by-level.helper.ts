import { LessonLevel, LessonTestLength } from 'src/enum';

export const getTestLessonLengthByLevel = (level: LessonLevel): number => {
  let result = 0;

  switch (level) {
    case LessonLevel.LEVEL_1:
      result = LessonTestLength.LEVEL_ONE;
      break;
    case LessonLevel.LEVEL_2:
      result = LessonTestLength.LEVEL_TWO;
      break;
    case LessonLevel.LEVEL_3:
      result = LessonTestLength.LEVEL_THREE;
      break;

    default:
      break;
  }

  return result;
};
