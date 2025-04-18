import { Text, View, Platform, Dimensions } from 'react-native';
import React from 'react';

const currentChapter = 'Chapter 1';
const currentTopic = 'Introduction to Notation';
const shadowClass = Platform.OS === 'ios' ? 'shadow-sm' : 'shadow-md';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const Chapter = () => {
  return (
    <View
      style={{
        width: width * 0.9, // 90% of screen width
        height: height * 0.1, // 10% of screen height
      }}
      className={`mt-6 rounded-2xl bg-primary px-4 self-center flex-row items-center justify-between border-l-4 border-r-4 border-accent absolute z-10 ${shadowClass} shadow-gray-600`}
    >
      {/* Chapter */}
      <View className="w-[40%] items-center justify-center">
        <Text
          className="text-white text-2xl font-bold text-center"
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {currentChapter}
        </Text>
      </View>

      {/* Divider */}
      <View className="h-[65%] w-[1px] bg-gray-600 rounded-sm" />

      {/* Topic */}
      <View className="w-[55%] items-center justify-center pl-2">
        <Text
          className="text-white text-lg text-center"
          adjustsFontSizeToFit
          numberOfLines={2}
        >
          {currentTopic}
        </Text>
      </View>
    </View>
  );
};

export default Chapter;
