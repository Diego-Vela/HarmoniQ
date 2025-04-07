import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  Image,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { icons } from '@/constants/icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useXP } from '@/hooks/useXp';

const Topbar = () => {
  const { level, currentXP, xpToNextLevel } = useXP();

  const progressPercent = Math.min(currentXP / xpToNextLevel, 1);
  const progressDisplay = `${currentXP}/${xpToNextLevel}`;

  const animatedWidth = useRef(new Animated.Value(progressPercent)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercent,
      duration: 600,
      useNativeDriver: false, // width animation can't use native driver
    }).start();
  }, [progressPercent]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-row items-center w-[98%] mt-0 h-[100%] bg-transparent mr-4">
      {/* Logo */}
      <View className="flex-row items-center justify-start w-[40%] h-[100%] bg-transparent">
        <Image
          source={icons.logo}
          className="w-[100%] h-[100%] mb-2 mt-2"
          resizeMode="contain"
        />
      </View>

      {/* Streak */}
      <View className="flex-row items-center justify-center bg-transparent h-12 w-1/5 mt-4">
        <Image
          source={icons.streak}
          className="w-[30%] h-[100%] mt-0 mb-2"
          resizeMode="contain"
        />
        <Text
          style={{ fontSize: RFValue(12) }}
          className="text-secondary font-bold px-1 mb-1"
        >
          7
        </Text>
      </View>

      {/* Level and XP */}
      <View className="flex-row items-center justify-evenly w-[40%] h-[80%] bg-transparent mt-3">
        <Text
          style={{ fontSize: RFValue(12) }}
          className="text-blue-300 font-semibold w-[40%] text-center"
        >
          Lv: {level}
        </Text>

        <View className="relative w-[60%] h-[50%] bg-gray-500 rounded-xl justify-center z-0">
          <Animated.View
            className="absolute h-[100%] bg-blue-300 rounded-xl mt-1"
            style={{ width: barWidth } as unknown as StyleProp<ViewStyle>}
          />
          <Text
            style={{ fontSize: RFValue(10), position: 'absolute' }}
            className="w-full text-primary font-semibold text-center"
          >
            {progressDisplay}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Topbar;
