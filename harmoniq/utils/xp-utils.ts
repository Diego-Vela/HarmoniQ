import { finalLessonKeys } from '@/constants/lesson-keys';

export function getXPForLevel(level: number): number {
  return Math.round(15 + (level - 1) * 5);
}

export function getTrainingXP(level: number): number {
  return 1 + level * 2;
}

const levelCapKeys = new Set<string>([
  'Chapter 1-1',
  'Chapter 1-3',
  'Chapter 1-6',
  'Chapter 3-5',
  'Chapter 4-5'
]);

export function getLessonXP(chapter: number, lessonKey: string): number {
  if (finalLessonKeys.has(lessonKey)) {
    return getLessonCompletionBonus(lessonKey, chapter);
  } else return 3 + (chapter) * 2;
}

export function getIncreaseLevelCap(lessonKey: string): boolean {
  if (levelCapKeys.has(lessonKey)) {
    return true;
  }
  return false;
}


export function getLessonCompletionBonus(lessonKey: string, chapter: number): number {
  return finalLessonKeys.has(lessonKey) ? 5 + (chapter*2) : 0;
}

