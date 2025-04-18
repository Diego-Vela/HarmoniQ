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
import { useXpStore } from '@/stores/useXpStore';
import { useStatsStore } from "@/stores/useStatsStore";

const Topbar = () => {
  const { level, currentXP, xpToNextLevel, levelCap } = useXpStore();
  const { dailyStreak } = useStatsStore();

  const progressPercent = Math.min(currentXP / xpToNextLevel, 1);
  const progressDisplay = `${currentXP}/${xpToNextLevel}`;

  const animatedWidth = useRef(new Animated.Value(progressPercent)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const glowAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-row items-center w-[98%] h-[100%] bg-transparent mr-4">
      {/* Logo */}
      <View className="flex-row items-center justify-start w-[40%] h-[100%] bg-transparent">
        <Image
          source={icons.logo}
          className="w-[100%] h-[100%] mb-2 mt-2"
          resizeMode="contain"
        />
      </View>

      {/* 🔥 Streak */}
      <View className="flex-row items-center justify-center h-12 w-1/5 mt-4">
        <Text className="text-xl mb-[2px]">🔥</Text>
        <Text
          style={{ fontSize: RFValue(14), color: '#f6ad55'}}
          className="font-bold px-1 mb-[2px] text-white">{ dailyStreak }</Text>
      </View>

      {/* Level + XP Progress */}
      <View className="flex-row items-center justify-evenly w-[40%] h-[80%] bg-transparent mt-3">
        <Text
          style={{ fontSize: RFValue(12) }}
          className="text-white font-semibold w-[40%] text-center"
        >
          Lv: {level}
        </Text>

        <View className="relative w-[60%] h-[50%] bg-gray-500 rounded-xl justify-center z-0">
          <Animated.View
            style={[
              {
                position: 'absolute',
                height: '100%',
                borderRadius: 10,
                marginTop: 1,
                backgroundColor: glowAnim.interpolate({
                  inputRange: [0.8, 1],
                  outputRange: ['#4dc3ff', '#36b2d0'], // Soft blue to lighter blue
                }),
                shadowColor: '#276d87',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.8, 1],
                  outputRange: [6, 12],
                }),
              },
              { width: barWidth }, // Interpolated width
            ]}
          />
          <Text
            style={{ fontSize: RFValue(10), position: 'absolute'}}
            className="w-full font-semibold text-center text-blue-900 italic z-50"
          >
            {levelCap > level? progressDisplay: 'Max'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Topbar;