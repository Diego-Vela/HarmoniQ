import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

  const [visibleFeedbackState, setVisibleFeedbackState] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // Track if the answer is correct

  const handleIntervalPress = (interval: string) => {
    if (!isChecking) return;
    const typedInterval = interval as Interval;
    setSelectedInterval(typedInterval);
    previewInterval(typedInterval);
  };

  const handleMainButton = () => {
    console.log('isChecking:', isChecking, 'selectedInterval:', selectedInterval, 'currentInterval:', currentInterval);

    if (isChecking) {
      const isCorrectAnswer = selectedInterval === currentInterval;
      console.log('isCorrect:', isCorrectAnswer);
      checkAnswer();
      setVisibleFeedbackState(true);
      setIsAnswerCorrect(isCorrectAnswer); // Track if the answer is correct
    } else {
      if (isAnswerCorrect) {
        console.log('onSuccess called');
        onSuccess(); // Call onSuccess only when the answer was correct
      } else {
        generateNext(); // Generate the next interval if the answer was incorrect
      }
      setVisibleFeedbackState(false);
      setIsAnswerCorrect(false); // Reset the correct answer state
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
      <Feedback isCorrect={isCorrect} visible={visibleFeedbackState} />

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
