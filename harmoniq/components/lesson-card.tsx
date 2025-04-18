import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { useStatsStore } from '@/stores/useStatsStore';

interface LessonCardProps {
  chapter: string;
  level: number | string;
  isNext?: boolean; // New prop to indicate if this is the next lesson
}

const shadowClass = Platform.OS === 'ios' ? 'shadow-sm' : 'shadow-sm';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const LessonCard: React.FC<LessonCardProps> = ({ chapter, level, isNext = false }) => {
  const lessonKey = `${chapter}-${level}`;
  const lastCompletedLesson = useStatsStore((s) => s.lastCompletedLesson);
  const hasCompletedBefore = lastCompletedLesson && lessonKey <= lastCompletedLesson;

  // Determine styles based on the lesson state
  const shadowColor = hasCompletedBefore
    ? 'shadow-amber-400'
    : isNext
    ? 'shadow-blue-600'
    : 'shadow-white';

  const border = hasCompletedBefore
    ? 'border border-amber-400'
    : isNext
    ? 'border border-blue-600'
    : '';

  const completedColor = hasCompletedBefore
    ? 'text-amber-400'
    : isNext
    ? 'text-blue-600'
    : 'text-gray-400';

  const imageTintColor = hasCompletedBefore
    ? '#fbbf24' // Amber for completed
    : isNext
    ? '#2563eb' // Blue-600 for next lesson
    : '#4B5563'; // Gray for not completed

  return (
    <Link
      href={{
        pathname: '/screens/entry-point',
        params: {
          category: 'lesson',
          subcategory: chapter,
          level: String(level),
        },
      }}
      asChild
    >
      <TouchableOpacity
        className={`self-center py-6 mb-10 rounded-2xl justify-center bg-primary ${border} ${shadowClass} ${shadowColor} items-center`}
        style={{
          width: width * 0.5, // 50% of the screen width
          height: height * 0.25, // 25% of the screen height
        }}
        activeOpacity={0.3}
      >
        <Image
          source={hasCompletedBefore ? icons.completedLesson : icons.lesson}
          tintColor={imageTintColor}
          style={{
            width: '50%',
            height: '50%',
            marginBottom: 12,
          }}
          resizeMode="contain"
        />
        <Text
          className="text-white font-bold text-xl mb-1"
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          Lesson {level}
        </Text>
        <Text
          className={`${completedColor} italic text-lg`}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {hasCompletedBefore
            ? 'Completed'
            : isNext
            ? 'Next Lesson'
            : 'Not Completed'}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default LessonCard;
