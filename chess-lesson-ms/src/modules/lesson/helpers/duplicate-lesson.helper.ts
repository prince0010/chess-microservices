export const someLessonDuplicates = (array: any[]): boolean => {
  return new Set(array).size !== array.length;
};
