import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ActivityBase from '@/components/activity-base';
import Feedback from '@/components/feedback';
import { useIntervalTraining, LevelData } from '@/hooks/useIntervalTraining';
import intervalLevels from '@/data/interval-levels.json';
import type { Interval } from '@/hooks/useIntervalTraining';
import { useLocalSearchParams } from 'expo-router';

export default function IntervalActivity() {
  // Find the correct level data from the JSON file and cast it as LevelData
  const { level } = useLocalSearchParams();
  if (Array.isArray(level)) {
    throw new Error('dummy error');
  }
  const levelData = intervalLevels.levels.find((lvl) => lvl.level === level) as LevelData;

  if (!levelData) {
    throw new Error(`Level ${level} not found in interval-levels.json`);
  }

  const {
    currentInterval,
    selectedInterval,
    setSelectedInterval,
    isChecking,
    isCorrect,
    visibleFeedback,
    playInterval,
    checkAnswer,
    previewInterval,
    generateNext,
  } = useIntervalTraining(level, levelData); // Pass levelData as a prop

  const intervalOptions = levelData.intervals; // Access intervals for the selected level

  const handleIntervalPress = (interval: string) => {
    if (!isChecking) return;
    const typedInterval = interval as Interval;
    setSelectedInterval(typedInterval);
    previewInterval(typedInterval); // 🔊 Play preview
  };
  

  const handleMainButton = () => {
    if (isChecking) {
      checkAnswer();
    } else {
      generateNext();
    }
  };

  return (
    <ActivityBase description="Identify the interval starting from the root note">
      {/* Play Button */}
      <TouchableOpacity
        className="w-[24%] h-[12%] bg-secondary rounded-full justify-center items-center"
        onPress={playInterval}
      >
        <Text className="text-white font-bold text-3xl">🔊</Text>
      </TouchableOpacity>

      {/* Interval Choices */}
      <View className="flex-row flex-wrap justify-evenly w-[90%]">
        {intervalOptions.map((interval) => (
          <TouchableOpacity
            key={interval}
            className={`w-[40%] h-[50] rounded-xl items-center justify-center m-2 ${
              selectedInterval === interval ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={() => handleIntervalPress(interval)}
            disabled={!isChecking}
          >
            <Text className="text-xl font-bold text-black">{interval}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback */}
      <Feedback isCorrect={isCorrect} visible={visibleFeedback} />

      {/* Main Button */}
      <TouchableOpacity
        className="w-[80%] h-[10%] bg-secondary rounded-xl justify-center mt-5"
        onPress={handleMainButton}
      >
        <Text className="text-white font-bold text-center text-xl">
          {isChecking ? 'Check Answer' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </ActivityBase>
  );
}
