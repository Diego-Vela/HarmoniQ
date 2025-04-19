export function getXPForLevel(level: number): number {
  return Math.round(15 + (level - 1) * 5);
}

export function getTrainingXP(level: number): number {
  return 1 + level * 2;
}

const finalLessonKeys = new Set<string>([
  'Chapter 1-5',
  'Chapter 2-5',
  'Chapter 3-5',
  'Chapter 4-5',
  'Chapter 5-1'
]);

const levelCapKeys = new Set<string>([
  'Chapter 1-1',
  'Chapter 1-5',
  'Chapter 2-5',
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

