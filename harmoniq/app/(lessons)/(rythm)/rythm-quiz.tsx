import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Button, Text, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';

import TapPad from '@/components/rhythm/tap-pad';
import RhythmDisplay from '@/components/rhythm/rhythm-display';
import Feedback from '@/components/rhythm/feedback';
import ActivityBase from '@/components/activity-base';

import { compareRhythm } from '@/components/rhythm/rhythm-comparer';
import rhythms from '@/constants/rhythms.json'; // Import rhythm patterns

export default function RhythmQuiz() {
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [canTap, setCanTap] = useState<boolean>(false);
  const [targetRhythm, setTargetRhythm] = useState<string[]>([]); // State for the target rhythm

  const timestampsRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const tickSoundRef = useRef<Audio.Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const selectRandomRhythm = () => {
    const randomIndex = Math.floor(Math.random() * rhythms.length);
    return rhythms[randomIndex];
  };

  useEffect(() => {
    // Set a random rhythm when the component mounts
    setTargetRhythm(selectRandomRhythm());

    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/metronome.wav')
        );
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
    };
  }, []);

  const handleTap = () => {
    if (!canTap) {
      return;
    }
    timestampsRef.current.push(Date.now());
  };

  const handleSubmit = () => {
    const match = compareRhythm(timestampsRef.current, targetRhythm, startTimeRef.current);
    console.log('Timestamps:', timestampsRef.current);
    console.log('StartTime:', startTimeRef.current);
    console.log('Match:', match);
    setIsCorrect(match);
    setShowFeedback(true);
  };

  const handleReset = () => {
    timestampsRef.current = [];
    startTimeRef.current = null;
    setShowFeedback(false);
    setTargetRhythm(selectRandomRhythm()); // Set a new random rhythm
  };

  const startCountdown = () => {
    timestampsRef.current = [];
    setShowFeedback(false);
    setCanTap(false);

    let count = 8; // Total ticks: 4 for countdown + 4 for tapping
    setCountdown(4); // Display only the first 4 counts as the countdown

    const tick = async () => {
      if (count === 0) {
        // Stop the metronome after all ticks
        setCountdown(null);
        setCanTap(false); // Disable tapping after the metronome ends
        handleSubmit(); // Auto-submit the rhythm
        return;
      }

      if (tickSoundRef.current) {
        try {
          triggerFlash(); // Trigger the pulse animation
          await tickSoundRef.current.replayAsync(); // Play the tick sound
        } catch (e) {
          console.warn('Tick sound error:', e);
        }
      }

      count -= 1;

      // Update the countdown display for the first 4 ticks
      if (count > 4) {
        setCountdown(count - 4);
      } else if (count === 4) {
        setCanTap(true);
        setCountdown(count - 4);
      } else if (count === 3) {
        const now = Date.now();
        startTimeRef.current = now;
        console.log('Start time:', now);
      }

      // Schedule the next tick
      setTimeout(tick, 600);
    };

    setTimeout(tick, 600); // Start the countdown/metronome
  };

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

  return (
    <ActivityBase description="Tap the Rhythm using either Button">
      <RhythmDisplay rhythm={targetRhythm} />
      <View className="flex justify-evenly items-center h-[20%] w-[100%] bg-transparent">
        {countdown !== null && (
          <>
            <Animated.View
              style={[
                {
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: 'purple',
                  opacity: 0.8,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Text className="text-5xl text-white">
              {countdown === 4 ? 'Ready!' : countdown === 0 ? 'Go!' : countdown}
            </Text>
          </>
        )}
      </View>
      <Button title="Start Rhythm" onPress={startCountdown} disabled={countdown !== null} />
      <View className="flex-row w-[90%] h-[20%] bg-transparent items-center justify-between">
        <TapPad onTap={handleTap} />
        <TapPad onTap={handleTap} />
      </View>
      <Feedback visible={showFeedback} isCorrect={isCorrect} />
      <Button title={isCorrect ? 'Next' : 'Reset'} onPress={handleReset} />
    </ActivityBase>
  );
}
