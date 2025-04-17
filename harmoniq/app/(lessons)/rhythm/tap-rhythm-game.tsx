import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import TapPad from '@/components/activities/rhythm/tap-pad';
import RhythmDisplay from '@/components/activities/rhythm/rhythm-display';
import Feedback from '@/components/activities/feedback';
import MetronomeCountdown from '@/components/activities/rhythm/metronome-countdown';
import { useTapRhythm } from '@/hooks/useTapRhythm';
import { ActivityComponentProps } from '@/constants/types';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-auto';

const TapRhythmGame: React.FC<ActivityComponentProps> = ({ level, onSuccess }) => {
  const router = useRouter();
  const category = "tap";
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [canTap, setCanTap] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const {
    handleTap,
    handleSubmit,
    handleReset,
    previewRhythm,
    loadPreviewSounds,
    cleanupPreviewSounds,
    isCorrect,
    showFeedback,
    targetRhythm,
    beatCount,
    setShowFeedback,
    startTimeRef,
    timestampsRef,
  } = useTapRhythm(category, level.toString());

  useEffect(() => {
    loadPreviewSounds();
    return () => cleanupPreviewSounds();
  }, []);

  const handleContinue = () => {
    if (isCorrect) {
      onSuccess();
    } else {
      handleReset();
    }
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
          onPress={async () => {
            setIsPreviewing(true);
            await previewRhythm();
            setIsPreviewing(false);
          }}
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
          isChecking={startCountdown}
          isCorrect={showFeedback ? isCorrect : null}
          onPress={() => {
            if (!startCountdown && !showFeedback) {
              timestampsRef.current = [];
              setShowFeedback(false);
              setCanTap(false);
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
