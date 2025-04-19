import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Feedback from '@/components/activities/common/feedback';

import { useIntervalTraining, LevelData } from '@/hooks/useIntervalTraining';
import intervalLevels from '@/data/activities/interval-levels.json';
import type { Interval } from '@/hooks/useIntervalTraining';

import { ActivityComponentProps } from '@/constants/types';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-button';
import SimpleIntervals from '@/components/activities/buttons/simple-intervals';

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
    generateNext,
    previewInterval,
    options, // Use options from the hook
  } = useIntervalTraining(level.toString(), levelData);

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
      if (isCorrect) {
        onSuccess();
      } else {
        generateNext();
      }
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

      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleIntervals
          intervals={options} // Use options from the hook
          selectedInterval={selectedInterval}
          onIntervalPress={(interval) => handleIntervalPress(interval)}
          disabled={!isChecking}
        />

        <Feedback isCorrect={isCorrect} visible={visibleFeedback} />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <AnimatedCheckButton
            isChecking={isChecking}
            isCorrect={isCorrect}
            onPress={handleMainButton}
          />
        </View>
      </View>
    </>
  );
};

export default IntervalGame;
