import React from 'react';
import { Text } from 'react-native';
import NoteReadingGame from '@/app/(lessons)/note-reading/note-reading-game';
import NoteReadingTimed from '@/app/(lessons)/note-reading/note-reading-timed';
import IntervalGame from '@/app/(lessons)/intervals/interval-game';
import KeySignatureGame from '@/app/(lessons)/notation/key-signature-id-game';
import TapRhythmGame from '@/app/(lessons)/rhythm/tap-rhythm-game';
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
      const isTimed = current.clef === 'TrebleTimed' || current.clef === 'BassTimed';
      const baseClef = getBaseClef(current.clef);

      if (isTimed) {
        return (
          <NoteReadingTimed
            key={activityKey}
            clef={baseClef as 'Treble' | 'Bass'}
            notes={getNoteSet(current.clef, current.level)}
            noteImages={getNoteImages(baseClef)}
            level={current.level}
            onComplete={handleActivitySuccess}
            onSuccess={() => {}}
          />
        );
      }

      return (
        <NoteReadingGame
          key={activityKey}
          clefName={baseClef}
          notes={getNoteSet(current.clef, current.level)}
          noteImages={getNoteImages(current.clef)}
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
