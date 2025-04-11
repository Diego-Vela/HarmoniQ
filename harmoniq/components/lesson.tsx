import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { icons } from '@/constants/icons';

interface LessonProps {
  chapter: string;
  level: number | string;
}

const Lesson: React.FC<LessonProps> = ({ chapter, level }) => {
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
          tintColor="gray"
          className="w-full h-32 rounded-lg"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Link>
  );
};

export default Lesson;

const styles = StyleSheet.create({});
