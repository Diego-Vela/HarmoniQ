import React, { useState } from 'react';
import { View, Text } from 'react-native';
import NoteReadingGame from '@/components/activities/note-reading/note-reading-game';
import IntervalGame from '@/app/(lessons)/intervals/interval-game';
import KeySignatureGame from '@/app/(lessons)/notation/key-signature-id-game';
import TapRhythmGame from '@/app/(lessons)/rhythm/tap-rhythm-game';
import ActivityBase from '@/components/activities/activity-base';

// You can customize this type depending on how you're loading your data
type ActivityDefinition =
  | { type: 'note-reading', clef: 'Treble' | 'Bass', level: number }
  | { type: 'interval', level: number }
  | { type: 'key-signature', level: number }
  | { type: 'tap-rhythm', level: number };

type Props = {
  mode: 'training' | 'lesson';
  sequence: ActivityDefinition[];
  onComplete: () => void;
};

const ActivitySequenceManager: React.FC<Props> = ({ mode, sequence, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const handleActivitySuccess = () => {
    const next = currentIndex + 1;
    setCompletedCount(prev => prev + 1);

    if (next < sequence.length) {
      setCurrentIndex(next);
    } else {
      onComplete();
    }
  };

  const current = sequence[currentIndex];

  const renderActivity = () => {
    console.log('Current activity:', current);
    console.log('completed:', completedCount, 'current index:', currentIndex, 'sequence length:', sequence.length);
    switch (current.type) {
      case 'note-reading':
        return (
          <NoteReadingGame
            clefName={current.clef}
            notes={getNoteSet(current.clef, current.level)}
            noteImages={getNoteImages(current.clef)}
            level={current.level}
            onSuccess={handleActivitySuccess}
          />
        );
      case 'interval':
        return (
          <IntervalGame
            level={current.level}
            onSuccess={handleActivitySuccess}
          />
        );
      case 'key-signature':
        return (
          <KeySignatureGame
            level={current.level}
            onSuccess={handleActivitySuccess}
          />
        );
      case 'tap-rhythm':
        return (
          <TapRhythmGame
            level={current.level}
            onSuccess={handleActivitySuccess}
          />
        );
      default:
        return <Text>Unsupported activity type.</Text>;
    }
  };

  const getNoteSet = (clef: 'Treble' | 'Bass', level: number): string[] => {
    const data = require('@/data/note-identification.json');
    return data.levels[clef.toLowerCase()][level] || [];
  };

  const getNoteImages = (clef: 'Treble' | 'Bass') => {
    return clef === 'Treble'
      ? require('@/constants/music-notes-treble').trebleClefNotes
      : require('@/constants/music-notes-bass').bassClefNotes;
  };

  return (
    <ActivityBase description={mode === 'lesson' ? 'Lesson' : 'Training'}>
      <View className="w-[60%] h-[3%] bg-gray-400 rounded-full overflow-hidden mt-6">
        <View
          style={{
            width: sequence.length > 0 ? `${(completedCount / sequence.length) * 100}%` : '0%',
          }}
          className="h-full bg-green-500"
        />
      </View>
      {renderActivity()}
    </ActivityBase>
  );
};

export default ActivitySequenceManager;
