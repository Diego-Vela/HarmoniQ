import React from 'react';
import { Text } from 'react-native';
import Section from '@/components/profile/section';

const LessonProgress = ({ progress, completed }: { progress: string; completed: number }) => (
  <Section title="Lesson Progress">
    <Text className="text-white text-base mb-2">
      Last Progress: <Text className="font-semibold">{progress || 'None'}</Text>
    </Text>
    <Text className="text-white text-base">Completed Lessons: {completed}</Text>
  </Section>
);

export default LessonProgress;