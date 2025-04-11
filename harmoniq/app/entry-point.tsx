import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ActivitySequenceManager from '@/components/activity-sequence-manager';
import { ActivityDefinition } from '@/constants/types';

type ActivityType = 'note-reading' | 'interval' | 'key-signature-id' | 'tap-rhythm';

const LessonsEntryPoint = () => {
  const { category, subcategory, level } = useLocalSearchParams<{
    category: string;
    subcategory: string;
    level: string;
  }>();

  const parsedLevel = parseInt(level || '1');

  // Validate parameters
  if (!category || !subcategory || isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 10) {
    return <Text className="text-white">Missing or invalid training parameters.</Text>;
  }

  const getTrainingLength = (type: ActivityType): number => {
    switch (type) {
      case 'note-reading':
        return 10;
      case 'interval':
      case 'key-signature-id':
        return 7;
      case 'tap-rhythm':
        return 5;
      default:
        return 5;
    }
  };

  // Map category and subcategory to ActivityType
  const mapToActivityType = (category: string, subcategory: string): ActivityType | null => {
    if (category === 'notation' && subcategory === 'key-signature-id') {
      return 'key-signature-id';
    }
    if (category === 'note-reading' && (subcategory === 'treble-clef' || subcategory === 'bass-clef')) {
      return 'note-reading';
    }
    if (category === 'intervals' && subcategory === 'interval') {
      return 'interval';
    }
    if (category === 'rhythm' && subcategory === 'tap-rhythm') {
      return 'tap-rhythm';
    }
    console.error(`Unsupported category/subcategory combination: ${category}/${subcategory}`);
    return null;
  };

  const activityType = mapToActivityType(category, subcategory);

  if (!activityType) {
    return <Text className="text-white">Unsupported category or subcategory.</Text>;
  }

  const generateTrainingSequence = (
    type: ActivityType,
    subcategory: string,
    level: number
  ): ActivityDefinition[] => {
    const length = getTrainingLength(type);
    console.log(`Generating training sequence for type: ${type}, subcategory: ${subcategory}, level: ${level}`);
    switch (type) {
      case 'note-reading':
        const clef = subcategory === 'treble-clef' ? 'Treble' : 'Bass';
        return Array.from({ length }, () => ({
          type: 'note-reading',
          clef,
          level,
        }));
      case 'interval':
        return Array.from({ length }, () => ({
          type: 'interval',
          level,
        }));
      case 'key-signature-id':
        return Array.from({ length }, () => ({
          type: 'key-signature-id',
          level,
        }));
      case 'tap-rhythm':
        return Array.from({ length }, () => ({
          type: 'tap-rhythm',
          level,
        }));
      default:
        console.error(`Unsupported activity type: ${type}`);
        return [];
    }
  };

  const isLesson = category === 'lesson';
  const isTrainingMode = !isLesson;

  const sequence: ActivityDefinition[] = isTrainingMode
    ? generateTrainingSequence(activityType, subcategory || '', parsedLevel)
    : [
        { type: 'note-reading', clef: 'Treble', level: parsedLevel },
        { type: 'note-reading', clef: 'Treble', level: parsedLevel },
        { type: 'interval', level: parsedLevel },
        { type: 'key-signature-id', level: parsedLevel },
        { type: 'tap-rhythm', level: parsedLevel },
      ];

  // Fallback for empty sequences
  if (sequence.length === 0) {
    return <Text className="text-white">No activities available for the selected parameters.</Text>;
  }

  return (
    <ActivitySequenceManager
      mode={isTrainingMode ? 'training' : 'lesson'}
      sequence={sequence}
      onComplete={() => {
        console.log('Lesson/Training Complete');
      }}
    />
  );
};

export default LessonsEntryPoint;
