import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

type AnimatedCheckButtonProps = {
  isChecking: boolean;
  isCorrect: boolean;
  onPress: () => void;
  label?: string;
};

const AnimatedCheckButton: React.FC<AnimatedCheckButtonProps> = ({
  isChecking,
  isCorrect,
  onPress,
  label,
}) => {
  const bgColorValue = useSharedValue('rgb(255, 121, 0)'); // orange
  const scaleValue = useSharedValue(1);
  const shakeX = useSharedValue(0);

  // Animate color & effects when correctness changes
  useEffect(() => {
    if (!isChecking) {
      if (isCorrect) {
        bgColorValue.value = withTiming('rgb(22, 163, 74)', { duration: 300 }); // green
        scaleValue.value = withSequence(withSpring(1.2), withSpring(1));
      } else {
        bgColorValue.value = withTiming('rgb(255, 121, 0)', { duration: 300 }); // reset to orange
        shakeX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-6, { duration: 50 }),
          withTiming(6, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      }
    } else {
      bgColorValue.value = withTiming('rgb(255, 121, 0)', { duration: 300 }); // always reset in checking mode
    }
  }, [isChecking, isCorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColorValue.value,
    transform: [
      { scale: scaleValue.value },
      { translateX: shakeX.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: '90%',
          height: '80%',
          borderRadius: 16,
        },
        animatedStyle,
      ]}
      className="justify-center shadow-md border"
    >
      <TouchableOpacity onPress={onPress}>
        <Text className="text-white font-bold text-center">
          {label ?? (isChecking ? 'Check Answer' : 'Continue')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedCheckButton;
