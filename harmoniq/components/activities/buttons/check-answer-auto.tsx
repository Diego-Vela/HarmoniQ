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
  const bgColorValue = useSharedValue('rgb(255, 121, 0)'); 

  const hasChecked = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: shakeX.value },
        { scale: scaleValue.value },
      ],
      backgroundColor: bgColorValue.value,
    };
  });

  useEffect(() => {
    if (!isChecking && isCorrect !== null) {
      if (hasChecked.current) {
        if (isCorrect) {
          bgColorValue.value = withTiming('rgb(22, 163, 74)', { duration: 200 }); // green
          scaleValue.value = withSequence(withSpring(1.2), withSpring(1));
        } else {
          bgColorValue.value = withTiming('rgb(255, 121, 0)', { duration: 200 }); // reset to orange
          shakeX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-6, { duration: 50 }),
            withTiming(6, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
        }
      }
      hasChecked.current = true;
    } else if (isChecking) {
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
