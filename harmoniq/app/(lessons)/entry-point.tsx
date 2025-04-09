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

  const validSubcategories = ['treble', 'bass', 'interval', 'key-signature', 'tap-rhythm'];

  if (!validSubcategories.includes(subcategory)) {
    return <Text className="text-white">Invalid subcategory: {subcategory}</Text>;
  }

  const sequence: ActivityDefinition[] =
    category === 'training'
      ? Array.from({ length: 10 }, () => {
          if (subcategory === 'treble' || subcategory === 'bass') {
            return {
              type: 'note-reading',
              clef: subcategory === 'treble' ? 'Treble' : 'Bass',
              level: parsedLevel,
            };
          } else {
            return {
              type: subcategory as 'interval' | 'key-signature' | 'tap-rhythm',
              level: parsedLevel,
            };
          }
        })
      : [
          { type: 'note-reading', clef: 'Treble', level: parsedLevel },
          { type: 'note-reading', clef: 'Treble', level: parsedLevel },
          { type: 'interval', level: parsedLevel },
          { type: 'key-signature', level: parsedLevel },
          { type: 'tap-rhythm', level: parsedLevel },
        ];

  return (
    <ActivitySequenceManager
      mode={category === 'lesson' ? 'lesson' : 'training'}
      sequence={sequence}
      onComplete={() => {
        console.log('Lesson/Training Complete');
      }}
    />
  );
};

export default LessonsEntryPoint;
