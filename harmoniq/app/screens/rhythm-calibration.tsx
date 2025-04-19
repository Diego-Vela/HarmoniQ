import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { useRhythmStore } from '@/stores/useRhythmStore';
import { useNavigation } from 'expo-router';
import { sounds } from '@/constants/sounds';
import ActivityBase from '@/components/activities/activity-base';

const REQUIRED_TAPS = 8;
const BEAT_INTERVAL = 1000; // ms
const TAP_LEEWAY = 100; // final delay window
const PULSE_WINDOW = 50; // visual green tap leeway window
const ADJUSTED_OFFSET = 125; // ms

const RhythmCalibrationScreen = () => {
  const [beatCount, setBeatCount] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  const [isWithinWindow, setIsWithinWindow] = useState(false);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const navigation = useNavigation();

  const ringAnim = useRef(new Animated.Value(1)).current;

  const { setCalibrationOffset } = useRhythmStore();

  // Sound pool for tap sounds
  const soundPool = useRef<Audio.Sound[]>([]);
  const poolIndex = useRef(0);

  // Preload tap sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const pool: Audio.Sound[] = [];
        for (let i = 0; i < 4; i++) {
          const { sound } = await Audio.Sound.createAsync(sounds.tap, { shouldPlay: false });
          pool.push(sound);
        }
        soundPool.current = pool;
      } catch (error) {
        console.error('Error preloading tap sounds:', error);
      }
    };

    loadSounds();

    return () => {
      // Cleanup: Unload all sound instances in the pool
      soundPool.current.forEach((sound) => {
        sound.unloadAsync().catch((error) => {
          console.error('Error unloading tap sound:', error);
        });
      });
    };
  }, []);

  const playTapSound = async () => {
    const sound = soundPool.current[poolIndex.current];
    poolIndex.current = (poolIndex.current + 1) % soundPool.current.length;

    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing tap sound from pool:', error);
    }
  };

  const startRingPulse = () => {
    ringAnim.setValue(1);
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 0,
        duration: BEAT_INTERVAL,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRingPulse = () => {
    ringAnim.stopAnimation();
    ringAnim.setValue(1);
  };

  const startCalibration = () => {
    setBeatCount(0);
    setTapTimes([]);
    setIsPlaying(true);
    setCalibrationComplete(false);

    startRingPulse();

    setTimeout(() => {
      startTimeRef.current = performance.now();

      const loop = () => {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        const currentBeat = Math.floor(elapsed / BEAT_INTERVAL);

        if (currentBeat >= REQUIRED_TAPS && now - startTimeRef.current > REQUIRED_TAPS * BEAT_INTERVAL + TAP_LEEWAY) {
          setIsPlaying(false);
          stopRingPulse();
          return;
        }

        if (beatCount !== currentBeat && currentBeat < REQUIRED_TAPS) {
          setBeatCount(currentBeat);
        }

        frameRef.current = requestAnimationFrame(loop);
      };

      frameRef.current = requestAnimationFrame(loop);
    }, BEAT_INTERVAL);
  };

  const handleTap = () => {
    if (!isPlaying || calibrationComplete) return;

    playTapSound(); // Play the tap sound

    const now = performance.now();
    const expectedTime = startTimeRef.current + beatCount * BEAT_INTERVAL;

    console.log(`Expected Tap: ${expectedTime - startTimeRef.current}ms`);
    console.log(`Actual Tap: ${now - startTimeRef.current}ms`);

    setTapTimes((prev) => {
      const updatedTapTimes = [...prev, now];

      if (updatedTapTimes.length === REQUIRED_TAPS) {
        setIsPlaying(false);
        setCalibrationComplete(true);
        calculateAverageOffset(updatedTapTimes);
      }

      return updatedTapTimes;
    });
  };

  const calculateAverageOffset = (tapTimes: number[]) => {
    const offsets = tapTimes.map((tap, i) => {
      const expected = startTimeRef.current + i * BEAT_INTERVAL;
      return tap - expected;
    });

    const avgOffset = Math.round(
      offsets.reduce((a, b) => a + b, 0) / offsets.length
    );

    setCalibrationOffset(avgOffset - ADJUSTED_OFFSET); // Adjusted offset for calibration

    Alert.alert(
      'Calibration Complete',
      `Your average offset is ${avgOffset - ADJUSTED_OFFSET}ms. We'll adjust timing accordingly.`,
      [
        {
          text: 'OK',
          onPress: () => {
            Alert.alert('Offset Recorded', `Saved calibration offset: ${avgOffset - ADJUSTED_OFFSET}ms`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const resetToDefault = () => {
    setCalibrationOffset(0); // Reset calibration offset to 0
    Alert.alert('Reset Complete', 'Calibration offset has been reset to default (0ms).');
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <ActivityBase>
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-xl mb-4">Tap in rhythm with the beat</Text>

        {!isPlaying ? (
          <TouchableOpacity
            className="mb-6 px-6 py-3 bg-secondary rounded-xl"
            onPress={startCalibration}
          >
            <Text className="text-white text-lg">Start Calibration</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-white text-lg mb-6">Taps: {tapTimes.length} / {REQUIRED_TAPS}</Text>
        )}

        {isPlaying && (
          <View className="justify-center items-center">
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: [
                  {
                    scale: ringAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2.5],
                    }),
                  },
                ],
              }}
            />
            <TouchableOpacity
              className="w-40 h-40 rounded-full justify-center items-center"
              onPress={handleTap}
              disabled={!isPlaying}
              style={{
                backgroundColor: isWithinWindow ? 'green' : 'yellow', // Dynamically change color
              }}
            >
              <Text className="text-black font-bold text-2xl">TAP</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reset to Default Button */}
        <TouchableOpacity
          className="mt-6 px-6 py-3 bg-red-600 rounded-xl"
          onPress={resetToDefault}
        >
          <Text className="text-white text-lg">Reset to Default</Text>
        </TouchableOpacity>
      </View>
    </ActivityBase>
  );
};

export default RhythmCalibrationScreen;