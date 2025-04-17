import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import TapPad from '@/components/activities/rhythm/tap-pad';
import RhythmDisplay from '@/components/activities/rhythm/rhythm-display';
import Feedback from '@/components/activities/feedback';
import MetronomeCountdown from '@/components/activities/rhythm/metronome-countdown';
import { useTapRhythm } from '@/hooks/useTapRhythm';
import { ActivityComponentProps } from '@/constants/types';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-button';

const TapRhythmGame: React.FC<ActivityComponentProps> = ({ level, onSuccess }) => {
  const router = useRouter();
  const category = "tap";
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [canTap, setCanTap] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [buttonKey, setButtonKey] = useState(0); // 👈 key for forcing button reset

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
    isPreviewing, // Use isPreviewing from the hook
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
    setButtonKey((prev) => prev + 1); // 👈 Reset the button visually
  };

  return (
    <>
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
        {!startCountdown && ( // Conditionally render buttons when pulse animation is not active
          <>
            <TouchableOpacity
              className={`p-2 rounded ${isPreviewing ? 'bg-gray-300' : 'bg-primary'} w-[40%] shadow-sm shadow-accent`}
              onPress={previewRhythm}
              disabled={isPreviewing}
            >
              <Text className="text-white font-bold text-center text-lg">Preview Rhythm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-2 rounded bg-primary w-[40%] shadow-sm shadow-accent`}
              onPress={() => router.push('/screens/rhythm-calibration')}
            >
              <Text className="text-white font-bold text-center text-lg">Calibrate</Text>
            </TouchableOpacity>
          </>
        )}
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