import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

const TICK_INTERVAL = 600;

interface MetronomeCountdownProps {
  start: boolean;
  beats: number; // Number of beats from the JSON file
  onStart: (startTime: number) => void;
  onTapWindowStart: () => void;
  onComplete: () => void;
  pulseAnim: Animated.Value;
}

const MetronomeCountdown: React.FC<MetronomeCountdownProps> = ({
  start,
  beats,
  onStart,
  onTapWindowStart,
  onComplete,
  pulseAnim,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const tickSoundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timer ID

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(sounds.metronome);
        tickSoundRef.current = sound;
      } catch (error) {
        console.error('Error loading tick sound:', error);
      }
    };

    loadSound();

    return () => {
      if (tickSoundRef.current) {
        tickSoundRef.current.unloadAsync();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Clear any active timers
      }
    };
  }, []);

  useEffect(() => {
    if (!start) {
      setCountdown(null); // Reset countdown when start is false
      return;
    }

    setCountdown(4 + beats); // Initialize countdown to 4 (countdown) + beats (tapping)
  }, [start, beats]);

  useEffect(() => {
    if (countdown === null) return;

    const tick = async () => {
      if (countdown === 0) {
        setCountdown(null); // Reset countdown
        onComplete(); // Trigger the onComplete callback
        return;
      }

      if (tickSoundRef.current) {
        try {
          triggerFlash();
          await tickSoundRef.current.stopAsync();
          await tickSoundRef.current.setPositionAsync(0);
          await tickSoundRef.current.playAsync();
        } catch (e) {
          console.warn('Tick sound error:', e);
        }
      }
      console.log(countdown);
      if (countdown === 4) {
        onTapWindowStart(); // Trigger tap window start
      } 

      if (countdown === beats) {
        const now = Date.now();
        onStart(now); // Trigger the onStart callback with the current time
        // console.log('Start time:', now);
      }

      setCountdown((prev) => (prev !== null ? prev - 1 : null)); // Decrement the countdown
    };

    // Schedule the next tick
    timerRef.current = setTimeout(tick, TICK_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Clear the timer when countdown changes
      }
    };
  }, [countdown]);

  const triggerFlash = () => {
    pulseAnim.setValue(1);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
    ]).start();
  };

  return countdown !== null ? (
    <View className="flex justify-evenly items-center h-[20%] w-[100%] bg-transparent">
      <Animated.View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'purple',
          opacity: 0.8,
          transform: [{ scale: pulseAnim }],
        }}
      />
      <Text className="text-5xl text-white">
        {countdown === 4 + beats ? 'Ready!' : countdown > beats ? countdown - beats : countdown === beats ? 'Go!' : "Tap!"}
      </Text>
    </View>
  ) : null;
};

export default MetronomeCountdown;
