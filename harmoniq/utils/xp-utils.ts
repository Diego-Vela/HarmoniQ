export function getXPForLevel(level: number): number {
  return Math.round(10 + (level - 1) * 5);
}

export function getTrainingXP(level: number): number {
  return 1 + level * 2;
}

const finalLessonKeys = new Set<string>([
  'Chapter 1-5',
  'Chapter 2-6',
  'Chapter 3-6',
  'Chapter 4-6',
  'Chapter 5-1'
]);

export function getLessonXP(chapter: number, lessonKey: string): number {
  if (finalLessonKeys.has(lessonKey)) {
    return getLessonCompletionBonus(lessonKey, chapter);
  } else return 1 + (chapter) * 2;
}



export function getLessonCompletionBonus(lessonKey: string, chapter: number): number {
  return finalLessonKeys.has(lessonKey) ? 5 * chapter : 0;
}

