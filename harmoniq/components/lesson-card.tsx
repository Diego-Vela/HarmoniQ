import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { useStatsStore } from '@/stores/useStatsStore';

interface LessonCardProps {
  chapter: string;
  level: number | string;
}

const shadowClass = Platform.OS === 'ios' ? 'shadow-sm' : 'shadow-sm';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const LessonCard: React.FC<LessonCardProps> = ({ chapter, level }) => {
  const lessonKey = `${chapter}-${level}`;
  const lastCompletedLesson = useStatsStore((s) => s.lastCompletedLesson);
  const hasCompletedBefore = lastCompletedLesson && lessonKey <= lastCompletedLesson;
  const shadowColor = hasCompletedBefore ? 'shadow-amber-400' : 'shadow-white';
  const border = hasCompletedBefore ? 'border border-amber-400' : '';
  const completedColor = hasCompletedBefore ? 'text-amber-400' : 'text-gray-400';

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
        className={`
          self-center py-6 mb-10 rounded-2xl justify-center bg-primary ${border} ${shadowClass} ${shadowColor}
          items-center
        `}
        style={{
          width: width * 0.5, // 40% of the screen width
          height: height * 0.25, // 20% of the screen height
        }}
        activeOpacity={0.3}
      >
        <Image
          source={hasCompletedBefore ? icons.completedLesson : icons.lesson}
          tintColor={hasCompletedBefore ? '#fbbf24' : '#4B5563'}
          style={{
            width: '50%',
            height: '50%',
            marginBottom: 12,
          }}
          resizeMode="contain"
        />
        <Text className="text-white font-bold text-xl mb-1" adjustsFontSizeToFit numberOfLines={1}>Lesson {level}</Text>
        <Text className={`${completedColor} italic text-lg` } adjustsFontSizeToFit numberOfLines={1}>
          {hasCompletedBefore ? 'Completed' : 'Not Completed'}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default LessonCard;
