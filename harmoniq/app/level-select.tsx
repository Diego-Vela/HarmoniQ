// level-select.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnHome from '@/components/return-home';

const MAX_LEVEL = 5;
const universallyUnlockedLevel = 1;



const LevelSelect = () => {
  const router = useRouter();
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();

  if (!category || !subcategory) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-dark-200">
        <Text className="text-white text-lg">Missing training information.</Text>
      </SafeAreaView>
    );
  }

  const isLevelUnlocked = (level: number) => {
    return level === universallyUnlockedLevel; // Replace with real unlock logic
  };

  const handleLevelPress = (level: number) => {
    router.push(`/(lessons)/${category}/${subcategory}?level=${level}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-200 items-center justify-start pt-12">
      <ReturnHome />
      <Text className="text-white text-2xl font-bold mb-6">Select Level</Text>
      {[...Array(MAX_LEVEL)].map((_, i) => {
        const level = i + 1;
        const unlocked = isLevelUnlocked(level);

        return (
          <TouchableOpacity
            key={level}
            onPress={() => handleLevelPress(level)}
            disabled={!unlocked}
            className={`w-[80%] py-4 mb-4 rounded-xl ${unlocked ? 'bg-accent' : 'bg-gray-600'}`}
          >
            <Text className="text-white text-center text-lg">Level {level}</Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

export default LevelSelect;