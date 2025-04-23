// entry-point-utils.ts
import { ActivityDefinition } from '@/constants/types';
import { ActivityType } from '@/constants/types';

export const Categories = {
  Notation: 'notation',
  NoteReading: 'note-reading',
  Intervals: 'intervals',
  Rhythm: 'rhythm',
  Lesson: 'lesson',
} as const;

export const Subcategories = {
  TrebleClef: 'treble-clef', SilentTreble: 'silent-treble',
  BassClef: 'bass-clef', SilentBass: 'silent-bass',
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
  if (category === Categories.NoteReading) {
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
  'lesson': 0,
};

export const getTrainingLength = (type: ActivityType): number =>
  trainingLengths[type] ?? 5;

const resolveNoteReadingSubtype = (subcategory: string): 'Treble' | 'Bass' | 'SilentTreble' | 'SilentBass' => {
  switch (subcategory) {
    case Subcategories.TrebleClef:
      return 'Treble';
    case Subcategories.BassClef:
      return 'Bass';
    case Subcategories.SilentTreble:
      return 'SilentTreble';
    case Subcategories.SilentBass:
      return 'SilentBass';
    default:
      throw new Error(`Unsupported subcategory: ${subcategory}`);
  }
} 

export const generateTrainingSequence = (
  type: ActivityType,
  subcategory: string,
  level: number
): ActivityDefinition[] => {
  const length = getTrainingLength(type);
  // console.log(`Generating training sequence for type: ${type}, subcategory: ${subcategory}, level: ${level}`);

  switch (type) {
    case 'note-reading': {
      const subtype = resolveNoteReadingSubtype(subcategory);
      return Array.from({ length }, () => ({
        type: 'note-reading',
        subtype,
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