import React, { useRef, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

type TapPadProps = {
  onTap: () => void;
};

export default function TapPad({ onTap }: TapPadProps) {
  const tapSoundRef = useRef<Audio.Sound | null>(null);

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
    <Pressable
      className="w-[45%] h-full bg-blue-500 rounded justify-center items-center shadow-lg shadow-red-500 active:bg-blue-600"
      onPressIn={handlePressIn} // Trigger on press down
    >
      <Text className="text-white text-2xl font-bold">TAP</Text>
    </Pressable>
  );
}
