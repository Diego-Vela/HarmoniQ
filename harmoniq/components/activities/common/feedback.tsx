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
      if (visible) {
        try {
          sound = new Audio.Sound();
          const soundFile = isCorrect ? sounds.correct : sounds.wrong;
          await sound.loadAsync(soundFile); // Load the appropriate sound
          await sound.playAsync(); // Play the sound

          // Automatically unload the sound when it finishes playing
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              sound?.unloadAsync();
            }
          });
        } catch (error) {
          console.error('Error playing sound:', error);
        }
      }
    };

    playSound();

    // Cleanup: Unload the sound when the component unmounts or props change
    return () => {
      if (sound) {
        sound.unloadAsync().catch((error) => {
          console.error('Error unloading sound:', error);
        });
      }
    };
  }, [isCorrect, visible]); // Re-run when `isCorrect` or `visible` changes

  if (!visible) return null;

  return (
    <View className="flex">
      <Text
        className="text-5xl"
        style={[{ color: isCorrect ? 'green' : 'red' }]}
      >
        {isCorrect ? '✔ Excellent!' : '✘ Oops!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  text: { fontSize: 24, fontWeight: 'bold' },
});
