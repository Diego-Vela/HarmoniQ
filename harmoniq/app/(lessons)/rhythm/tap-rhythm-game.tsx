import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import TapPad from '@/components/activities/rhythm/tap-pad';
import RhythmDisplay from '@/components/activities/rhythm/rhythm-display';
import Feedback from '@/components/activities/feedback';
import MetronomeCountdown from '@/components/activities/rhythm/metronome-countdown';
import { useTapRhythm } from '@/hooks/useTapRhythm';
import { ActivityComponentProps } from '@/constants/types';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-button';

const TapRhythmGame: React.FC<ActivityComponentProps> = ({ level, onSuccess }) => {
  const router = useRouter();
  const category = "tap";
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [canTap, setCanTap] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [buttonKey, setButtonKey] = useState(0); // 👈 key for forcing button reset

  const {
    handleTap,
    handleSubmit,
    handleReset,
    isCorrect,
    showFeedback,
    targetRhythm,
    beatCount,
    setShowFeedback,
    startTimeRef,
    timestampsRef,
  } = useTapRhythm(category, level.toString());

  const tapSoundARef = useRef<Audio.Sound | null>(null);
  const tapSoundBRef = useRef<Audio.Sound | null>(null);
  const isUsingARef = useRef(true);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: soundA } = await Audio.Sound.createAsync(sounds.tap);
        const { sound: soundB } = await Audio.Sound.createAsync(sounds.tap);
        tapSoundARef.current = soundA;
        tapSoundBRef.current = soundB;
      } catch (error) {
        console.error('Error loading tap sounds:', error);
      }
    };
    loadSounds();

    return () => {
      tapSoundARef.current?.unloadAsync();
      tapSoundBRef.current?.unloadAsync();
    };
  }, []);

  const handleContinue = () => {
    if (isCorrect) {
      onSuccess();
    } else {
      handleReset();
    }
    setButtonKey((prev) => prev + 1); // 👈 Reset the button visually
  };

  const previewRhythm = async () => {
    if (isPreviewing || !tapSoundARef.current || !tapSoundBRef.current) return;

    setIsPreviewing(true);

    const tempo = 100;
    const quarter = 60000 / tempo;
    const noteToDelay = (note: string): number => {
      switch (note) {
        case 'q': return quarter;
        case '8': return quarter / 2;
        case 'h': return quarter * 2;
        default: return quarter;
      }
    };

    let cumulativeTime = 0;
    const previewStart = performance.now();

    for (let i = 0; i < targetRhythm.length; i++) {
      const duration = noteToDelay(targetRhythm[i]);
      const scheduledTime = previewStart + cumulativeTime;
      const now = performance.now();
      const wait = Math.max(0, scheduledTime - now);

      await new Promise((resolve) => setTimeout(resolve, wait));

      const actualTime = performance.now();
      const delta = Math.round(actualTime - scheduledTime);
      console.log(`Note ${i + 1}: '${targetRhythm[i]}' | Expected: ${Math.round(scheduledTime)} | Actual: ${Math.round(actualTime)} | Δ = ${delta}ms`);

      const soundToUse = isUsingARef.current ? tapSoundARef.current : tapSoundBRef.current;
      isUsingARef.current = !isUsingARef.current;

      try {
        await soundToUse.stopAsync();
        await soundToUse.setPositionAsync(0);
        await soundToUse.playAsync();
      } catch (error) {
        console.warn('Tap sound error during preview:', error);
      }

      cumulativeTime += duration;
    }

    setIsPreviewing(false);
  };

  return (
    <>
      <TouchableOpacity
        className="absolute top-5 right-5 p-2 bg-blue-500 rounded"
        onPress={() => router.push('/screens/rhythm-calibration')}
      >
        <Text className="text-white font-bold">Calibrate</Text>
      </TouchableOpacity>

      <RhythmDisplay rhythm={targetRhythm} />

      <MetronomeCountdown
        start={startCountdown}
        beats={beatCount}
        pulseAnim={pulseAnim}
        onTapWindowStart={() => setCanTap(true)}
        onStart={(startTime) => (startTimeRef.current = startTime)}
        onComplete={() => {
          setCanTap(false);
          setStartCountdown(false);
          handleSubmit();
        }}
      />

      <View className="flex-row w-full justify-evenly items-center">
        <TouchableOpacity
          className={`p-2 rounded ${isPreviewing || startCountdown ? 'bg-gray-300' : 'bg-blue-500'}`}
          onPress={previewRhythm}
          disabled={isPreviewing || startCountdown}
        >
          <Text className="text-white font-bold">Preview Rhythm</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row w-[45%] h-[20%] bg-transparent items-center justify-center">
        <TapPad onTap={() => canTap && handleTap()} />
      </View>

      <Feedback visible={showFeedback} isCorrect={isCorrect} />

      <View className="mt-5 w-full h-[10%] items-center">
        <AnimatedCheckButton
          key={buttonKey} // 👈 remounts button when incremented
          isChecking={startCountdown}
          isCorrect={showFeedback ? isCorrect : null}
          onPress={() => {
            if (!startCountdown && !showFeedback) {
              timestampsRef.current = [];
              setShowFeedback(false);
              setCanTap(false);
              setJustCompleted(false);
              setStartCountdown(true);
            } else if (showFeedback) {
              handleContinue();
            }
          }}
          label={
            startCountdown && !showFeedback
              ? 'Listening...'
              : showFeedback
              ? 'Continue'
              : 'Start Rhythm'
          }
        />
      </View>
    </>
  );
};

export default TapRhythmGame;