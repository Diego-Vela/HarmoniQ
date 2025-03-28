import React, { useRef, useEffect } from 'react';
import { Pressable, Text, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

interface TapPadProps {
  onTap: () => void;
  beatFlash?: boolean; // new prop
}

export default function TapPad({ onTap, beatFlash }: TapPadProps) {
  const tapSoundRef = useRef<Audio.Sound | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (beatFlash) {
      scaleAnim.setValue(1.2);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [beatFlash]);

  const playTapSound = async () => {
    try {
      if (!tapSoundRef.current) {
        const { sound } = await Audio.Sound.createAsync(sounds.tap);
        tapSoundRef.current = sound;
      }
      await tapSoundRef.current.replayAsync();
    } catch (error) {
      console.error('Error playing tap sound:', error);
    }
  };

  const handlePressIn = () => {
    playTapSound();
    onTap();
  };

  useEffect(() => {
    return () => {
      if (tapSoundRef.current) {
        tapSoundRef.current.unloadAsync(); // Unload the sound when the component unmounts
      }
    };
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable onPress={onTap}>
        {/* Your pad visuals here */}
      </Pressable>
    </Animated.View>
  );
}
