import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import NoteReadingGame from '@/app/(lessons)/note-reading/note-reading-game';
import IntervalGame from '@/app/(lessons)/intervals/interval-game';
import KeySignatureGame from '@/app/(lessons)/notation/key-signature-id-game';
import TapRhythmGame from '@/app/(lessons)/rhythm/tap-rhythm-game';
import ActivityBase from '@/components/activities/activity-base';
import { ActivityDefinition } from '@/constants/types';

type Props = {
  mode: 'training' | 'lesson';
  sequence: ActivityDefinition[];
  onComplete: () => void;
};

const ActivitySequenceManager: React.FC<Props> = ({ mode, sequence, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [activityDescription, setActivityDescription] = useState(''); // Use state for description

  const current = sequence[currentIndex];

  const handleActivitySuccess = () => {
    const next = currentIndex + 1;
    setCompletedCount((prev) => prev + 1);

    if (next < sequence.length) {
      setCurrentIndex(next);
    } else {
      onComplete();
    }
  };

  // Update activity description whenever the current activity changes
  useEffect(() => {
    if (!current) return;

    switch (current.type) {
      case 'note-reading':
        setActivityDescription('Identify the note on the staff');
        break;
      case 'interval':
        setActivityDescription('Identify the interval');
        break;
      case 'key-signature-id':
        setActivityDescription('Identify the key signature');
        break;
      case 'tap-rhythm':
        setActivityDescription('Tap the given rhythm');
        break;
      default:
        setActivityDescription('Null Activity Description');
    }
  }, [current]); // Dependency array ensures this runs when `current` changes

  const renderActivity = () => {
    const activityKey = `activity-${currentIndex}`;

    switch (current.type) {
      case 'note-reading':
        return (
          <NoteReadingGame
            key={activityKey}
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
        return <Text>Unsupported activity type</Text>;
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
    <ActivityBase description={activityDescription}>
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
