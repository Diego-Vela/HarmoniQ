import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

interface Props {
  isChecking: boolean;
  isCorrect: boolean | null;
  onPress: () => void;
  label?: string;
}

const AnimatedCheckButton: React.FC<Props> = ({ isChecking, isCorrect, onPress, label }) => {
  const shakeX = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const bgColorValue = useSharedValue('rgb(255, 121, 0)'); // orange

  const hasChecked = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: shakeX.value },
        { scale: scaleValue.value },
      ] as Animated.AnimatedTransform,
      backgroundColor: bgColorValue.value,
    };
  });

  useEffect(() => {
    if (!isChecking) {
      if (isCorrect) {
        bgColorValue.value = withTiming('rgb(22, 163, 74)', { duration: 200 }); // green
        scaleValue.value = withSequence(withSpring(1.2), withSpring(1));
      } else if (isCorrect === false) {
        bgColorValue.value = withTiming('rgb(239, 68, 68)', { duration: 200 }); // red
        shakeX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-6, { duration: 50 }),
          withTiming(6, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      }
    } else {
      // Reset to orange when checking starts
      bgColorValue.value = withTiming('rgb(255, 121, 0)', { duration: 300 });
    }
  }, [isChecking, isCorrect]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: '80%', // Set width to 80%
          height: '80%', // Set height to 80%
          borderRadius: 12,
          paddingHorizontal: 24,
          paddingVertical: 12,
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
        },
      ]}
    >
      <TouchableOpacity onPress={onPress}>
        <Text className="text-white font-bold text-xl text-center">
          {label ?? (isChecking ? 'Check Answer' : 'Continue')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedCheckButton;
