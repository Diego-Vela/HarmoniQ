// entry-point-utils.ts
import { ActivityDefinition } from '@/constants/types';

export type ActivityType = 'note-reading' | 'interval' | 'key-signature-id' | 'tap-rhythm';

export const Categories = {
  Notation: 'notation',
  NoteReading: 'note-reading',
  Intervals: 'intervals',
  Rhythm: 'rhythm',
  Lesson: 'lesson',
} as const;

export const Subcategories = {
  TrebleClef: 'treble-clef',
  BassClef: 'bass-clef',
  KeySignatureId: 'key-signature-id',
  TapRhythm: 'tap-rhythm',
  Interval: 'interval',
} as const;

export const resolveActivityType = (
  category: string,
  subcategory: string
): ActivityType | null => {
  if (category === Categories.Notation && subcategory === Subcategories.KeySignatureId) {
    return 'key-signature-id';
  }
  if (category === Categories.NoteReading &&
      (subcategory === Subcategories.TrebleClef || subcategory === Subcategories.BassClef)) {
    return 'note-reading';
  }
  if (category === Categories.Intervals && subcategory === Subcategories.Interval) {
    return 'interval';
  }
  if (category === Categories.Rhythm && subcategory === Subcategories.TapRhythm) {
    return 'tap-rhythm';
  }
  if (category === Categories.Lesson ) {
    return 'lesson';
  }
  console.error(`Unsupported category/subcategory combination: ${category}/${subcategory}`);
  return null;
};

const trainingLengths: Record<ActivityType, number> = {
  'note-reading': 10,
  'interval': 7,
  'key-signature-id': 7,
  'tap-rhythm': 5,
};

export const getTrainingLength = (type: ActivityType): number =>
  trainingLengths[type] ?? 5;

export const generateTrainingSequence = (
  type: ActivityType,
  subcategory: string,
  level: number
): ActivityDefinition[] => {
  const length = getTrainingLength(type);
  // console.log(`Generating training sequence for type: ${type}, subcategory: ${subcategory}, level: ${level}`);

  switch (type) {
    case 'note-reading': {
      const clef = subcategory === Subcategories.TrebleClef ? 'Treble' : 'Bass';
      return Array.from({ length }, () => ({
        type: 'note-reading',
        clef,
        level,
      }));
    }
    case 'interval':
      return Array.from({ length }, () => ({ type: 'interval', level }));
    case 'key-signature-id':
      return Array.from({ length }, () => ({ type: 'key-signature-id', level }));
    case 'tap-rhythm':
      return Array.from({ length }, () => ({ type: 'tap-rhythm', level }));
    default:
      console.error(`Unsupported activity type: ${type}`);
      return [];
  }
};