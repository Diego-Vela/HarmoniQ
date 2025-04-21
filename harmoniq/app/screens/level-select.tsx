// level-select.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Background from '@/components/common/background';
import ReturnHome from '@/components/common/return-home';
import unlockData from '@/data/unlock-data.json';
import { useXpStore } from '@/stores/useXpStore';

const LevelSelect = () => {
  const router = useRouter();
  const { category, subcategory } = useLocalSearchParams<{
    category: keyof typeof unlockData.trainings;
    subcategory: keyof typeof unlockData.trainings[keyof typeof unlockData.trainings];
  }>();

  const userLevel = useXpStore((state) => state.level);

  if (!category || !subcategory) {
    return (
      <Background>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Missing training information.</Text>
        </View>
      </Background>
    );
  }

  // Dynamically calculate the total number of levels
  const trainingLevels = (unlockData.trainings?.[category]?.[subcategory] ?? []) as Array<{ unlocked: number; required: number }>;
  const totalLevels = trainingLevels.length;

  const getRequiredLevel = (level: number) => {
    const match = trainingLevels.find((entry) => entry.unlocked >= level);
    return match?.required ?? Infinity; // default to never unlocked
  };

  const isLevelUnlocked = (level: number) => {
    return userLevel >= getRequiredLevel(level);
  };

  const handleLevelPress = (level: number) => {
    router.push(`/screens/entry-point?category=${category}&subcategory=${subcategory}&level=${level}`);
  };

  return (
    <Background>
      <ReturnHome />
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-white text-2xl font-bold mb-6 text-center">Select Level</Text>

        {[...Array(totalLevels)].map((_, i) => {
          const level = i + 1;
          const unlocked = isLevelUnlocked(level);

          return (
            <TouchableOpacity
              key={level}
              onPress={() => handleLevelPress(level)}
              disabled={!unlocked}
              className={`flex items-center justify-center w-[80%] h-[10%] py-4 mb-4 rounded-xl ${unlocked ? 'bg-accent' : 'bg-gray-600'}`}
            >
              <Text className="text-white text-center text-lg" adjustsFontSizeToFit numberOfLines={1}>
                Level {level}
              </Text>
              {!unlocked && (
                <Text className="text-white text-sm text-center mt-1 opacity-70" adjustsFontSizeToFit numberOfLines={1}>
                  Requires Level {getRequiredLevel(level)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Background>
  );
};

export default LevelSelect;
