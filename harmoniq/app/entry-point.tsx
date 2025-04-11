// entry-point.tsx
import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ActivitySequenceManager from '@/components/activity-sequence-manager';
import { ActivityDefinition } from '@/constants/types';
import lessonData from '@/data/lessons-data.json';
import {
  ActivityType,
  Categories,
  Subcategories,
  resolveActivityType,
  generateTrainingSequence
} from '@/utils/entry-point-utils';

const LessonsEntryPoint = () => {
  const { category, subcategory, level } = useLocalSearchParams<{
    category: string;
    subcategory: string;
    level: string;
  }>();

  const parsedLevel = parseInt(level || '1');
  const lessonSequence = lessonData?.[subcategory]?.[parsedLevel.toString()];

  // Validate parameters
  if (!category || !subcategory || isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 10) {
    return <Text className="text-white">Missing or invalid training parameters.</Text>;
  }

  const isLesson = category === Categories.Lesson;
  const isTrainingMode = !isLesson;

  const activityType = resolveActivityType(category, subcategory);

  if (isTrainingMode && !activityType) {
    return <Text className="text-white">Unsupported category or subcategory: {category}/{subcategory}</Text>;
  }

  const sequence: ActivityDefinition[] = isTrainingMode
    ? generateTrainingSequence(activityType!, subcategory || '', parsedLevel)
    : lessonSequence || [];

  if (sequence.length === 0) {
    return (
      <Text className="text-white">
        No activities available for the selected parameters: {category}/{subcategory}.
      </Text>
    );
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