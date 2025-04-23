import React from 'react';
import { Text } from 'react-native';
import NoteReadingGame from '@/app/(lessons)/note-reading/note-reading-game';
import NoteReadingTimed from '@/app/(lessons)/note-reading/note-reading-timed';
import IntervalGame from '@/app/(lessons)/intervals/interval-game';
import KeySignatureGame from '@/app/(lessons)/notation/key-signature-id-game';
import TapRhythmGame from '@/app/(lessons)/rhythm/tap-rhythm-game';
import SilentNoteReading from '@/app/(lessons)/note-reading/silent-note-reading';
import { ActivityDefinition } from '@/constants/types';
import { getBaseClef, getNoteSet, getNoteImages } from './activity-sequence-utils';

export const resolveActivityComponent = (
  current: ActivityDefinition,
  handleActivitySuccess: () => void,
  currentIndex: number
) => {
  const activityKey = `activity-${currentIndex}`;

  switch (current.type) {
    case 'note-reading': {
      const baseClef = getBaseClef(current.subtype);

      if (current.subtype === 'TrebleTimed' || current.subtype === 'BassTimed') {
        return (
          <NoteReadingTimed
            key={activityKey}
            subtype={baseClef as 'Treble' | 'Bass'}
            notes={getNoteSet(current.subtype, current.level)}
            noteImages={getNoteImages(baseClef)}
            level={current.level}
            onComplete={handleActivitySuccess}
            onSuccess={() => {}}
          />
        );
      } else if (current.subtype === 'SilentTreble' || current.subtype === 'SilentBass') {
        return (
          <SilentNoteReading
            key={activityKey}
            clefName={baseClef}
            notes={getNoteSet(current.subtype, current.level)}
            noteImages={getNoteImages(current.subtype)}
            level={current.level}
            onSuccess={handleActivitySuccess}
          />
        );
      }

      return (
        <NoteReadingGame
          key={activityKey}
          clefName={baseClef}
          notes={getNoteSet(current.subtype, current.level)}
          noteImages={getNoteImages(current.subtype)}
          level={current.level}
          onSuccess={handleActivitySuccess}
        />
      );
    }

    case 'interval':
      return (
        <IntervalGame
          key={activityKey}
          level={current.level}
          onSuccess={handleActivitySuccess}
        />
      );

    case 'key-signature-id':
      return (
        <KeySignatureGame
          key={activityKey}
          level={current.level}
          onSuccess={handleActivitySuccess}
        />
      );

    case 'tap-rhythm':
      return (
        <TapRhythmGame
          key={activityKey}
          level={current.level}
          onSuccess={handleActivitySuccess}
        />
      );

    default:
      return <Text key={activityKey}>Unsupported activity type</Text>;
  }
};
