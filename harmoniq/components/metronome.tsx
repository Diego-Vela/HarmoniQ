import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

interface MetronomeProps {
  bpm: number; // Accept bpm as a prop
}

const Metronome: React.FC<MetronomeProps> = ({ bpm }) => {
  const [isPlaying, setIsPlaying] = useState(false); // Track if the metronome is playing
  const [displayText, setDisplayText] = useState<string>('Tap Rhythm'); // Text to display
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference to the interval
  const [sound, setSound] = useState<Audio.Sound | null>(null); // Sound object for the metronome tick
  const beat = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: beat.value % 2 === 0 ? 1 : 0.5,
  }));

  // Load the metronome sound
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/metronome.wav'));
      setSound(sound);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  // Play the metronome tick
  const playTick = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  // Start the metronome
  const startMetronome = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      let beatCount = 0; // Local variable to track the beat count
      setDisplayText('1'); // Start with the first beat
      intervalRef.current = setInterval(() => {
        beatCount += 1;
        playTick(); // Play the tick sound
        // Update the display text for the first 4 beats
        if (beatCount <= 4) {
          setDisplayText(beatCount === 4 ? 'Start' : beatCount.toString());
        } else if (beatCount === 5) {
          setDisplayText('Tap Rhythm'); // Start with the first beat
        } else if (beatCount === 8) {
          // After 8 beats, reset the text to "Tap Rhythm" and stop the metronome
          stopMetronome();
        }
        beat.value = withTiming(1, { duration: 500 }, () => {
          beat.value = 0; // Reset for the next beat
        });
      }, (60 / bpm) * 1000); // Interval in milliseconds
    }
  };

  // Stop the metronome
  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false); // Update state after clearing the interval
  };

  // Toggle the metronome
  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  // Cleanup the sound when the component unmounts
  React.useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <View className="flex items-center justify-center">
      <Text className="text-white text-2xl font-bold mb-4">{displayText}</Text>
      <TouchableOpacity
        className="bg-secondary rounded-xl px-4 py-2"
        onPress={toggleMetronome}
      >
        <Text className="text-white font-bold">{isPlaying ? 'End the Beat Yo' : 'Start the Beat Yo'}</Text>
      </TouchableOpacity>
      <Animated.View style={[animatedStyle, { width: 100, height: 100, backgroundColor: 'red' }]} />
    </View>
  );
};

export default Metronome;