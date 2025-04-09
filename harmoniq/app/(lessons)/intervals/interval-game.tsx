import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ActivityBase from '@/components/activities/activity-base';
import Feedback from '@/components/activities/feedback';
import { useIntervalTraining, LevelData } from '@/hooks/useIntervalTraining';
import intervalLevels from '@/data/interval-levels.json';
import type { Interval } from '@/hooks/useIntervalTraining';
import { ActivityComponentProps } from '@/constants/types';

const IntervalGame: React.FC<ActivityComponentProps> = ({ level, onSuccess }) => {
  const levelData = intervalLevels.levels.find((lvl) => Number(lvl.level) === level) as LevelData;

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
  } = useIntervalTraining(level.toString(), levelData);

  const intervalOptions = levelData.intervals;

  const [correctCount, setCorrectCount] = useState(0);
  const targetCorrect = 10;

  useEffect(() => {
    if (isChecking === false && isCorrect) {
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      if (newCount >= targetCorrect) {
        setTimeout(onSuccess, 600); // short delay to show feedback
      }
    }
  }, [isChecking]);

  const handleIntervalPress = (interval: string) => {
    if (!isChecking) return;
    const typedInterval = interval as Interval;
    setSelectedInterval(typedInterval);
    previewInterval(typedInterval);
  };

  const handleMainButton = () => {
    if (isChecking) {
      checkAnswer();
    } else {
      generateNext();
    }
  };

  return (
    <>

      {/* Play Interval */}
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
    </>
  );
};

export default IntervalGame;
