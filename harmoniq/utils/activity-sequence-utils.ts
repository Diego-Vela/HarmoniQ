import noteDataRaw from '@/data/activities/note-identification.json';
import { ActivityDefinition } from '@/constants/types';

export interface NoteLevels {
  [clef: string]: {
    [level: number]: string[];
  };
}

export const getBaseClef = (clef: string): 'Treble' | 'Bass' => {
  return clef.toLowerCase().includes('treble') ? 'Treble' : 'Bass';
};

export const getNoteSet = (clef: string, level: number): string[] => {
  const noteData = noteDataRaw as { levels: NoteLevels };
  return noteData.levels[clef.toLowerCase()]?.[level] || [];
};

export const getNoteImages = (clef: string) => {
  return clef.toLowerCase().includes('treble')
    ? require('@/constants/music-notes-treble').trebleClefNotes
    : require('@/constants/music-notes-bass').bassClefNotes;
};

export const getActivityDescription = (type: string, subtype: string | null): string => {
  switch (type) {
    case 'note-reading':
      if (subtype === 'TrebleTimed' || subtype === 'BassTimed') {
        return 'Identify as many notes as possible in 1 minute';
      } else if (subtype === 'Treble' || subtype === 'SilentTreble') {
        return 'Identify the note on the treble staff';
      } else if (subtype === 'Bass' || subtype === 'SilentBass') {
        return 'Identify the note on the bass staff';
      }
      return 'Identify the note on the staff';
    case 'interval':
      return 'Identify the interval';
    case 'key-signature-id':
      return 'Identify the key signature';
    case 'tap-rhythm':
      return 'Tap the given rhythm';
    default:
      return 'Unknown activity';
  }
};

export const isTimedActivity = (activity: ActivityDefinition): boolean => {
  return (
    activity.type === 'note-reading' &&
    (activity.subtype === 'TrebleTimed' || activity.subtype === 'BassTimed')
  );
};