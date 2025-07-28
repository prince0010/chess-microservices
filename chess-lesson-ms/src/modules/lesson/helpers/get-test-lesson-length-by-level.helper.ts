import { LessonLevel, LessonTestLength } from 'src/enum';

// to know hoe many child lessons select randomly for the test array of lessons
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
    case LessonLevel.LEVEL_4:
      result = LessonTestLength.LEVEL_FOUR;
      break;
    case LessonLevel.LEVEL_5:
      result = LessonTestLength.LEVEL_FIVE;
      break;
    case LessonLevel.LEVEL_6:
      result = LessonTestLength.LEVEL_SIX;
      break;
    case LessonLevel.LEVEL_7:
      result = LessonTestLength.LEVEL_SEVEN;
      break;
    case LessonLevel.LEVEL_8:
      result = LessonTestLength.LEVEL_EIGHT;
      break;
    case LessonLevel.LEVEL_9:
      result = LessonTestLength.LEVEL_NINE;
      break;
    case LessonLevel.LEVEL_10:
      result = LessonTestLength.LEVEL_TEN;
      break;
    case LessonLevel.LEVEL_11:
      result = LessonTestLength.LEVEL_ELEVEN;
      break;
    case LessonLevel.LEVEL_12:
      result = LessonTestLength.LEVEL_TWELVE;
      break;

    default:
      break;
  }

  return result;
};
