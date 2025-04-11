import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Feedback from '@/components/activities/feedback';
import { useIntervalTraining, LevelData } from '@/hooks/useIntervalTraining';
import intervalLevels from '@/data/interval-levels.json';
import type { Interval } from '@/hooks/useIntervalTraining';
import { ActivityComponentProps } from '@/constants/types';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-button';
import SimpleNotes from '@/components/activities/buttons/simple-notes'; // Import SimpleNotes component
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
    // console.log('isChecking:', isChecking, 'selectedInterval:', selectedInterval, 'currentInterval:', currentInterval);

    if (isChecking) {
      const isCorrectAnswer = selectedInterval === currentInterval;
      // console.log('isCorrect:', isCorrectAnswer);
      checkAnswer();
      setVisibleFeedbackState(true);
      setIsAnswerCorrect(isCorrectAnswer); // Track if the answer is correct
    } else {
      if (isAnswerCorrect) {
        // console.log('onSuccess called');
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

      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleIntervals
          intervals={intervalOptions}
          selectedInterval={selectedInterval}
          onIntervalPress={(interval) => handleIntervalPress(interval)} // Handle interval press
          disabled={!isChecking}
        />

        <Feedback isCorrect={isCorrect} visible={visibleFeedbackState} />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <AnimatedCheckButton
            isChecking={isChecking}
            isCorrect={isAnswerCorrect}
            onPress={handleMainButton}
          />
        </View>
      </View>
    </>
  );
};

export default IntervalGame;
