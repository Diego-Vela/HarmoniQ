import React, { useRef, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

interface TapPadProps {
  onTap: () => void;
}

export default function TapPad({ onTap }: TapPadProps) {
  const soundPool = useRef<Audio.Sound[]>([]); // Pool of preloaded sounds
  const poolIndex = useRef(0); // Tracks the current sound instance to use

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
    poolIndex.current = (poolIndex.current + 1) % soundPool.current.length; // Alternate sound instance

    if (!sound) return;

    try {
      await sound.stopAsync(); // Stop the sound if it’s already playing
      await sound.setPositionAsync(0); // Reset the sound position
      await sound.playAsync(); // Play the sound
    } catch (error) {
      console.error('Error playing tap sound from pool:', error);
    }
  };

  const handlePressIn = () => {
    playTapSound();
    onTap();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      activeOpacity={0.7}
      className="w-[85%] h-full bg-green-600 rounded-2xl justify-center items-center shadow-md shadow-accent"
    >
      <Text className="text-white text-2xl font-bold shadow-2xl shadow-primary">TAP</Text>
    </TouchableOpacity>
  );
}
