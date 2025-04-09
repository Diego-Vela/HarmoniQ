import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ActivitySequenceManager from '@/components/activity-sequence-manager';
import { ActivityDefinition } from '@/constants/types';

const LessonsEntryPoint = () => {
  const { category, subcategory, level } = useLocalSearchParams<{
    category: string;
    subcategory: string;
    level: string;
  }>();

  const parsedLevel = parseInt(level || '1');

  if (!category || !subcategory || isNaN(parsedLevel)) {
    return <Text className="text-white">Missing or invalid training parameters.</Text>;
  }

  const sequence: ActivityDefinition[] =
    category === 'training'
      ? Array.from({ length: 10 }, () => ({
          type: subcategory === 'treble' || subcategory === 'bass'
            ? 'note-reading'
            : (subcategory as any),
          clef: subcategory === 'treble' ? 'Treble' : subcategory === 'bass' ? 'Bass' : undefined,
          level: parsedLevel,
        } as any))
      : [
          { type: 'note-reading', clef: 'Treble', level: parsedLevel },
          { type: 'note-reading', clef: 'Treble', level: parsedLevel },
          { type: 'interval', level: parsedLevel },
          { type: 'key-signature', level: parsedLevel },
          { type: 'tap-rhythm', level: parsedLevel },
        ];

  console.log('Generated sequence:', sequence);

  return (
    <ActivitySequenceManager
      mode={category === 'lesson' ? 'lesson' : 'training'}
      sequence={sequence}
      onComplete={() => {
        console.log('Lesson/Training Complete');
        // maybe route back or update mission XP here
      }}
    />
  );
};

export default LessonsEntryPoint;
