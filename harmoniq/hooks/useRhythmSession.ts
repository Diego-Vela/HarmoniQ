import { useState, useRef, useCallback } from 'react';
import { compareRhythm } from '@/components/activities/rhythm/rhythm-comparer';
import { selectRandomRhythm } from '@/utils/rhythm-utils';

interface RhythmPattern {
  pattern: string[];
  beats: number;
}

export const useRhythmSession = (category: string, level: string) => {
  const initial = selectRandomRhythm(category, level);

  if (!initial) {
    throw new Error(`No rhythm found for ${category} ${level}`);
  }

  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [targetRhythm, setTargetRhythm] = useState<string[]>(initial.pattern);
  const [beatCount, setBeatCount] = useState<number>(initial.beats);

  const timestampsRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const handleTap = useCallback(() => {
    timestampsRef.current.push(Date.now());
  }, []);

  const handleSubmit = useCallback(() => {
    setTimeout(() => {
      const match = compareRhythm(timestampsRef.current, targetRhythm, startTimeRef.current);
      setIsCorrect(match);
      setShowFeedback(true);
    }, 300); // Add a 300ms delay (adjust as needed)
  }, [targetRhythm]);

  const handleReset = useCallback(() => {
    timestampsRef.current = [];
    startTimeRef.current = null;
    setShowFeedback(false);
    const newRhythm = selectRandomRhythm(category, level) as RhythmPattern;
    setTargetRhythm(newRhythm.pattern);
    setBeatCount(newRhythm.beats);
  }, [category, level]);

  return {
    handleTap,
    handleSubmit,
    handleReset,
    isCorrect,
    showFeedback,
    targetRhythm,
    beatCount,
    setTargetRhythm,
    setBeatCount,
    startTimeRef,
    timestampsRef,
    setShowFeedback,
  };
};
