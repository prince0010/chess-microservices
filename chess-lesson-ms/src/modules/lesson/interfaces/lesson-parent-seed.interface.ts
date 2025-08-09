export interface ILessonParentSeed {
  timer: number;
  name: string;
  pgnFilename: string | null;
  lessonFactor: number;
  story: string;
  level: string;
  quantityToUnlockNext: number;
  levelFrontend: string;
  showHint: boolean;
  pointsPerLesson: number;
  isTest: boolean;
  isGame: boolean;
  isPreview: boolean;
  isBot: boolean;
  messageModal: string | null;
  canBeSkipped: boolean;
}
