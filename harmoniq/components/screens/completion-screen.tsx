import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CompletionScreenProps } from '@/constants/types';
import { Animated } from 'react-native'; // add a slide in animtion for the future

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  mode,
  xpAwarded,
  onNext,
  onReplay,
}) => {
  const title = mode === 'training' ? 'Training Complete!' : 'Lesson Complete!';
  const subtitle =
    mode === 'lesson' && xpAwarded === 0
      ? 'Already completed — no XP awarded.'
      : `You earned ${xpAwarded} XP!`;

  return (
    <View className="flex-1 justify-center items-center bg-dark-300 px-6">
      <Text className="text-white text-3xl font-bold mb-2">{title}</Text>
      <Text className="text-white text-lg mb-8">{subtitle}</Text>

      {mode === 'training' && onReplay && (
        <TouchableOpacity
          className="bg-accent w-[80%] py-3 rounded-xl mb-4"
          onPress={onReplay}
        >
          <Text className="text-white text-center font-semibold">Replay Training</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="bg-primary w-[80%] py-3 rounded-xl"
        onPress={onNext}
      >
        <Text className="text-white text-center font-semibold">
          {mode === 'training' ? 'Back to Training Select' : 'Back to Home'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompletionScreen;
