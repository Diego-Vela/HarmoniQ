import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { selectRandomRhythm, compareRhythm } from '@/utils/rhythm-utils';
import { useRhythmStore } from '@/stores/useRhythmStore';
import { sounds } from '@/constants/sounds';

interface RhythmPattern {
  pattern: string[];
  beats: number;
}

export const useTapRhythm = (category: string, level: string) => {
  const initial = selectRandomRhythm(category, level);
  const { calibrationOffset } = useRhythmStore.getState();

  if (!initial) {
    throw new Error(`No rhythm found for ${category} ${level}`);
  }

  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [targetRhythm, setTargetRhythm] = useState<string[]>(initial.pattern);
  const [beatCount, setBeatCount] = useState<number>(initial.beats);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const timestampsRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const tapSoundARef = useRef<Audio.Sound | null>(null);
  const tapSoundBRef = useRef<Audio.Sound | null>(null);
  const isUsingARef = useRef(true);

  const loadPreviewSounds = useCallback(async () => {
    try {
      const { sound: soundA } = await Audio.Sound.createAsync(sounds.tap);
      const { sound: soundB } = await Audio.Sound.createAsync(sounds.tap);
      tapSoundARef.current = soundA;
      tapSoundBRef.current = soundB;
    } catch (error) {
      console.error('Error loading tap sounds:', error);
    }
  }, []);

  const cleanupPreviewSounds = useCallback(async () => {
    try {
      if (tapSoundARef.current) {
        await tapSoundARef.current.unloadAsync();
        tapSoundARef.current = null;
      }
      if (tapSoundBRef.current) {
        await tapSoundBRef.current.unloadAsync();
        tapSoundBRef.current = null;
      }
    } catch (error) {
      console.error('Error unloading tap sounds:', error);
    }
  }, []);

  const previewRhythm = useCallback(async () => {
    if (isPreviewing || !tapSoundARef.current || !tapSoundBRef.current) return;

    setIsPreviewing(true);

    const tempo = 100;
    const quarter = 60000 / tempo;
    const noteToDelay = (note: string): number => {
      switch (note) {
        case 'q':
          return quarter;
        case '8':
          return quarter / 2;
        case 'h':
          return quarter * 2;
        default:
          return quarter;
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

      const soundToUse = isUsingARef.current ? tapSoundARef.current : tapSoundBRef.current;
      isUsingARef.current = !isUsingARef.current;

      try {
        await soundToUse?.playFromPositionAsync(0); // Optimized playback
      } catch (error) {
        console.warn('Tap sound error during preview:', error);
      }

      cumulativeTime += duration;
    }

    setIsPreviewing(false);
  }, [isPreviewing, targetRhythm]);

  const handleTap = useCallback(() => {
    timestampsRef.current.push(Date.now());
  }, []);

  const handleSubmit = useCallback(() => {
    setTimeout(() => {
      const match = compareRhythm(
        timestampsRef.current,
        targetRhythm,
        startTimeRef.current,
        100,
        215,
        calibrationOffset
      );
      setIsCorrect(match);
      setShowFeedback(true);
    }, 300);
  }, [targetRhythm, calibrationOffset]);

  const handleReset = useCallback(() => {
    timestampsRef.current = [];
    startTimeRef.current = null;
    setShowFeedback(false);
    const newRhythm = selectRandomRhythm(category, level) as RhythmPattern;
    setTargetRhythm(newRhythm.pattern);
    setBeatCount(newRhythm.beats);
  }, [category, level]);

  // Automatically load and clean up sounds
  useEffect(() => {
    loadPreviewSounds();
    return () => {
      cleanupPreviewSounds();
    };
  }, [loadPreviewSounds, cleanupPreviewSounds]);

  return {
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
    setTargetRhythm,
    setBeatCount,
    startTimeRef,
    timestampsRef,
    setShowFeedback,
    isPreviewing,
  };
};