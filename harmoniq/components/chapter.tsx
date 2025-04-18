import { Text, View, Platform } from 'react-native';
import React from 'react';

const currentChapter = 'Chapter 1';
const currentTopic = 'Introduction to Notation';
const shadowClass = Platform.OS === 'ios' ? 'shadow-sm' : 'shadow-md';

const Chapter = () => {
  return (
    <View className={`w-[90%] h-[10%] mt-6 rounded-2xl bg-primary px-4 self-center flex-row items-center justify-between border-l-4 border-r-4 border-accent absolute z-10 ${shadowClass} shadow-gray-600`}>
      {/* Chapter */}
      <View className="w-[40%] items-center justify-center">
        <Text className="text-white text-2xl font-bold text-center" adjustsFontSizeToFit numberOfLines={1}>{currentChapter}</Text>
      </View>

      {/* Divider */}
      <View className="h-[65%] w-[1px] bg-gray-600 rounded-sm" />

      {/* Topic */}
      <View className="w-[55%] items-center justify-center pl-2">
        <Text className="text-white text-lg text-center" adjustsFontSizeToFit numberOfLines={2}>{currentTopic}</Text>
      </View>
    </View>
  );
};

export default Chapter;
