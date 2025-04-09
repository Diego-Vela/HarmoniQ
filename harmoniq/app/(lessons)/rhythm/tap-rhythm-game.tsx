import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Animated } from 'react-native';
import TapPad from '@/components/activities/rhythm/tap-pad';
import RhythmDisplay from '@/components/activities/rhythm/rhythm-display';
import Feedback from '@/components/activities/feedback';
import ActivityBase from '@/components/activities/activity-base';
import MetronomeCountdown from '@/components/activities/rhythm/metronome-countdown';
import { useRhythmSession } from '@/hooks/useRhythmSession';
import { ActivityComponentProps } from '@/constants/types';

const TapRhythmGame: React.FC<ActivityComponentProps> = ({ level, onSuccess }) => {
  const category = "tap"; // optionally allow this to be dynamic too
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [canTap, setCanTap] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false); // prevent multiple triggers

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
  } = useRhythmSession(category, level.toString());

  // When correct and feedback is shown, trigger success once
  useEffect(() => {
    if (isCorrect && showFeedback && !justCompleted) {
      setJustCompleted(true);
      setTimeout(() => {
        onSuccess(); // Trigger next activity
      }, 800); // delay briefly so feedback appears first
    }
  }, [isCorrect, showFeedback]);

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

      <Button
        title="Start Rhythm"
        onPress={() => {
          timestampsRef.current = [];
          setShowFeedback(false);
          setCanTap(false);
          setJustCompleted(false); // reset for next round
          setStartCountdown(true);
        }}
      />

      <View className="flex-row w-[50%] h-[20%] bg-transparent items-center justify-center">
        <TapPad onTap={() => canTap && handleTap()} />
      </View>

      <Feedback visible={showFeedback} isCorrect={isCorrect} />

      <Button title={isCorrect ? 'Next' : 'Reset'} onPress={handleReset} />
    </>
  );
};

export default TapRhythmGame;
