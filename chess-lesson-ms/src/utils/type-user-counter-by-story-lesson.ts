import { LessonStoryName, TypeUserCounter } from 'src/enum';

export const typeUserCounterByStoryLesson = (
  story: LessonStoryName,
): TypeUserCounter => {
  let typeUserCounter = TypeUserCounter.EDUCATION_LESSON_COUNTER;

  switch (story) {
    case LessonStoryName.EDUCATION:
      typeUserCounter = TypeUserCounter.EDUCATION_LESSON_COUNTER;
      break;
    case LessonStoryName.PUZZLE:
      typeUserCounter = TypeUserCounter.PUZZLE_LESSON_COUNTER;
      break;
    case LessonStoryName.ENDGAME:
      typeUserCounter = TypeUserCounter.ENDGAMES_LESSON_COUNTER;
      break;

    default:
      break;
  }

  return typeUserCounter;
};
