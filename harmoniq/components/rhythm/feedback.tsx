import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

type FeedbackProps = {
  isCorrect: boolean;
  visible: boolean;
};

export default function Feedback({ isCorrect, visible }: FeedbackProps) {
  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const playSound = async () => {
      if (isCorrect && visible) {
        try {
          sound = new Audio.Sound();
          await sound.loadAsync(sounds.correct); // Load the correct sound
          await sound.playAsync(); // Play the sound
        } catch (error) {
          console.error('Error playing sound:', error);
        }
      }
    };

    playSound();

    // Cleanup: Unload the sound when the component unmounts or props change
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isCorrect, visible]); // Re-run when `isCorrect` or `visible` changes

  if (!visible) return null;

  return (
    <View className='flex '>
      <Text className= 'text-5xl'style={[{ color: isCorrect ? 'green' : 'red' }]}>
        {isCorrect ? '✔ Excellent!' : '✘ Oops!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  text: { fontSize: 24, fontWeight: 'bold' },
});
