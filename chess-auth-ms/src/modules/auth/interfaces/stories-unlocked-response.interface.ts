import { LessonStoryName } from 'src/enum/story-unlocked.enum';

export interface StoriesUnlockedResponse {
  stories: StoryUnlocked[];
}

export interface StoryUnlocked {
  story: LessonStoryName;
  disabled: boolean;
}
