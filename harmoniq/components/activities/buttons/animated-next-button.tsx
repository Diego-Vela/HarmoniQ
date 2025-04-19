import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type AnimatedNextButtonProps = {
  isCorrect: boolean | null;
  onPress: () => void;
  label?: string;
};

const AnimatedNextButton: React.FC<AnimatedNextButtonProps> = ({
  isCorrect,
  onPress,
  label = 'Next',
}) => {
  const bgColor = useSharedValue('rgb(255, 121, 0)'); 

  useEffect(() => {
    if (isCorrect === null) return;

    const targetColor = isCorrect
      ? 'rgb(34, 197, 94)' 
      : 'rgb(239, 68, 68)'; 

    bgColor.value = withTiming(targetColor, { duration: 100 }, () => {
      bgColor.value = withTiming('rgb(255, 121, 0)', { duration: 100 });
    });
  }, [isCorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          height: '100%',
          borderRadius: 16,
        },
        animatedStyle,
      ]}
      className="justify-center shadow-md border"
    >
      <TouchableOpacity
        onPress={onPress} 
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text className="text-white font-bold text-xl text-center">
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedNextButton;
