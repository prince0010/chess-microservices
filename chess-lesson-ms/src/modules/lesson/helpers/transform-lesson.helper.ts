import { Lesson } from '../entities/lesson.entity';
import { ILessonList } from '../interfaces';

export const transformSingleLessons = (lessons: Lesson[]): ILessonList[] => {
  return lessons.map((lesson) => ({
    ...lesson,
    moves: lesson.moves.split(' '),
  }));
};
