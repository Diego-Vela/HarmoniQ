import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ActivitySequenceManager from '@/components/activity-sequence-manager';
import { ActivityDefinition } from '@/constants/types';
import lessonData from '@/data/lessons-data.json';
import { LessonsData } from '@/constants/types';
import {
  Categories,
  resolveActivityType,
  generateTrainingSequence
} from '@/utils/entry-point-utils';

const LessonsEntryPoint = () => {
  const router = useRouter();

  const { category, subcategory, level } = useLocalSearchParams<{
    category: string;
    subcategory: string;
    level: string;
  }>();

  const parsedLessonData = lessonData as LessonsData;
  const parsedLevel = parseInt(level || '1');

  const lessonSequence = parsedLessonData?.[subcategory]?.[parsedLevel.toString()];

  if (!category || !subcategory || isNaN(parsedLevel) || parsedLevel < 1 || parsedLevel > 10) {
    return <Text className="text-white">Missing or invalid training parameters.</Text>;
  }

  const isLesson = category === Categories.Lesson;
  const isTrainingMode = !isLesson;

  const activityType = resolveActivityType(category, subcategory);

  if (isTrainingMode && !activityType) {
    return (
      <Text className="text-white">
        Unsupported category or subcategory: {category}/{subcategory}
      </Text>
    );
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
      mode="training"
      sequence={sequence}
      onComplete={() => {
        router.push({
          pathname: '/completion',
          params: {
            mode: 'training',
            category,
            subcategory,
            level: parsedLevel.toString(),
          },
        });
      }}
    />
  );
};

export default LessonsEntryPoint;
