import React, { useState, useRef } from 'react';
import { View, Button, Animated } from 'react-native';

import TapPad from '@/components/rhythm/tap-pad';
import RhythmDisplay from '@/components/rhythm/rhythm-display';
import Feedback from '@/components/rhythm/feedback';
import ActivityBase from '@/components/activity-base';

import MetronomeCountdown from '@/components/rhythm/metronome-countdown';
import { useRhythmSession } from '@/hooks/useRhythmSession';

export default function RhythmQuiz() {
  const level = "level1";
  const category = "tap";

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [canTap, setCanTap] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);

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
  } = useRhythmSession(category, level);

  return (
    <ActivityBase description="Tap the Rhythm using either Button">
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

      <Button title="Start Rhythm" onPress={() => {
        timestampsRef.current = [];
        setShowFeedback(false);
        setCanTap(false);
        setStartCountdown(true);
      }} 
      />

      <View className="flex-row w-[90%] h-[20%] bg-transparent items-center justify-between">
        <TapPad onTap={() => canTap && handleTap()} />
        <TapPad onTap={() => canTap && handleTap()} />
      </View>

      <Feedback visible={showFeedback} isCorrect={isCorrect} />
      <Button title={isCorrect ? 'Next' : 'Reset'} onPress={handleReset} />
    </ActivityBase>
  );
}
