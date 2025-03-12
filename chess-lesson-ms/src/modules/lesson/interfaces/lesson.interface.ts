import { Lesson } from '../entities/lesson.entity';

export interface ICountAndListLessons {
  currentPage: number;
  total: number;
  lessons: Lesson[];
}
