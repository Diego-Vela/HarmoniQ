// level-select.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Background from '@/components/common/background';
import ReturnHome from '@/components/common/return-home';

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
      <Background>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Missing training information.</Text>
        </View>
      </Background>
    );
  }

  const isLevelUnlocked = (level: number) => {
    return level === universallyUnlockedLevel; // Replace with real unlock logic
  };

  const handleLevelPress = (level: number) => {
    console.log(`/category=${category} subcategory=${subcategory} level=${level}`);
    router.push(`/entry-point?category=${category}&subcategory=${subcategory}&level=${level}`);
  };

  return (
    <Background>
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-white text-2xl font-bold mb-6 text-center">Select Level</Text>
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
      </View>
    </Background>
  );
};

export default LevelSelect;