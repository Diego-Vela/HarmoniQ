import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { CompletionScreenProps } from '@/constants/types';
import React, { useEffect, useRef } from 'react';
import Background from '@/components/common/background';

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  mode,
  xpAwarded,
  onNext,
  onReplay,
  hasClaimed,
  onClaim,
}) => {
  const title = mode === 'training' ? '🎯 Training Complete!' : '📘 Lesson Complete!';
  const subtitle =
    mode === 'lesson' && xpAwarded === 0
      ? 'Already completed — no XP awarded.'
      : `You earned ${xpAwarded} XP!`;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (hasClaimed && xpAwarded > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 1500);
      });
    }
  }, [hasClaimed]);

  return (
    <Background>
      <View className="flex-1 justify-center items-center px-6">
      <Text className="text-yellow-400 text-4xl font-extrabold animate-pulse mb-4">{title}</Text>
        <Text className="text-white text-xl mb-10">{subtitle}</Text>

        {hasClaimed && xpAwarded > 0 && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="mb-6"
          >
            <Text className="text-yellow-400 text-3xl font-bold animate-pulse">
              +{xpAwarded} XP!
            </Text>
          </Animated.View>
        )}

        {!hasClaimed ? (
          <TouchableOpacity
            className="bg-green-600 w-[90%] py-5 rounded-2xl mt-4"
            onPress={onClaim}
          >
            <Text className="text-white text-center font-semibold text-xl">
              Claim XP
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {mode === 'training' && onReplay && (
              <TouchableOpacity
                className="bg-primary w-[90%] py-5 rounded-2xl mb-5 mt-4"
                onPress={onReplay}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Replay Training
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-accent w-[90%] py-5 rounded-2xl"
              onPress={onNext}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {mode === 'training' ? 'Back to Training Select' : 'Back to Home'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Background>
  );
};

export default CompletionScreen;
