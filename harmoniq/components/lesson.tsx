import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { icons } from '@/constants/icons';
import { useStatsStore } from '@/stores/useStatsStore';

interface LessonProps {
  chapter: string;
  level: number | string;
}

const Lesson: React.FC<LessonProps> = ({ chapter, level }) => {
  const lessonKey = `${chapter}-${level}`;
  const lastCompletedLesson = useStatsStore((s) => s.lastCompletedLesson);
  const hasCompletedBefore = lastCompletedLesson && lessonKey <= lastCompletedLesson;

  return (
    <Link
      href={{
        pathname: '/entry-point',
        params: {
          category: 'lesson',
          subcategory: chapter,
          level: String(level),
        },
      }}
      asChild
    >
      <TouchableOpacity className="w-[40%] mt-10">
        <Image
          source={icons.lesson}
          tintColor={hasCompletedBefore ? 'yellow' : '#fbbf24'} 
          className="w-full h-32 rounded-lg"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Link>
  );
};

export default Lesson;

const styles = StyleSheet.create({});
