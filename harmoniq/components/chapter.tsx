import { Text, View } from 'react-native';
import React from 'react';

const currentChapter = 'Chapter 1';
const currentTopic = 'Introduction to Notation';

const Chapter = () => {
  return (
    <View className="w-[90%] h-[10%] mt-6 rounded-2xl bg-primary px-4 self-center shadow-md border border-orange-300 flex-row items-center justify-between">
      {/* Chapter */}
      <View className="w-[40%] items-center justify-center">
        <Text className="text-white text-xl font-bold text-sm text-center">{currentChapter}</Text>
      </View>

      {/* Divider */}
      <View className="h-[65%] w-[1px] bg-gray-600 rounded-sm" />

      {/* Topic */}
      <View className="w-[55%] items-center justify-center pl-2">
        <Text className="text-white text-lg text-center">{currentTopic}</Text>
      </View>
    </View>
  );
};

export default Chapter;
