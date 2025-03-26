import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Metronome, { MetronomeRef } from '@/components/metronome'; 
import ActivityBase from '@/components/activity-base'; 
import { rythmNotes } from '@/constants/music-notes';
import { Audio } from 'expo-av';

const TapRythm = ({ requiredCorrectPresses = 4 }: { requiredCorrectPresses: number }) => {
  const bpm = 120; 
  const scale = useSharedValue(1);
  const metronomeRef = useRef<MetronomeRef>(null);

  // Track the number of beats
  const [beatCount, setBeatCount] = useState(0);
  const [correctPressCount, setCorrectPressCount] = useState(0); // Track correct presses
  const [isProblemCorrect, setIsProblemCorrect] = useState(false); // Track if the problem is correct

  // Animated style for the button
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Increment the beat count on each metronome tick
  const handleMetronomeTick = () => {
    setBeatCount((prevCount) => prevCount + 1);
  };

  // Handle press-in and press-out events
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 150 }); // Shrink slightly

    // Ignore the first four beats
    if (beatCount <= 4) {
      console.log('Ignoring beat during countdown...');
      return;
    }

    // Check if the button press is on beat
    const now = Date.now();
    const tolerance = 200; // ±200ms tolerance
    const beatTimestamps = metronomeRef.current?.beatTimestamps || [];
    const closestBeat = beatTimestamps.find(
      (timestamp) => Math.abs(now - timestamp) <= tolerance
    );

    if (closestBeat) {
      console.log('On beat!');
      setCorrectPressCount((prevCount) => prevCount + 1); // Increment correct presses
    } else {
      console.log('Off beat!');
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 }); // Return to original size
  };

  // Check if the problem is correct
  useEffect(() => {
    if (correctPressCount >= requiredCorrectPresses) {
      setIsProblemCorrect(true);
      console.log('Problem completed successfully!');
    }
  }, [correctPressCount, requiredCorrectPresses]);

  return (
    <ActivityBase description="Tap the rhythm to match the image">
      <View className="flex bg-transparent w-[80%] h-[35%] items-center justify-center">
        <View className="flex items-center bg-transparent w-[90%] h-[50%]">
          <Image
            source={rythmNotes.base}
            className="w-full h-full z-0"
            resizeMode="contain"
          />
        </View>
        {/* Metronome Component */}
        <Metronome ref={metronomeRef} bpm={bpm} onTick={handleMetronomeTick} />
      </View>

      {/* Button with animation */}
      <View className="flex bg-blue-300 w-[80%] h-[50%] items-center justify-center">
        <TouchableOpacity
          onPressIn={handlePressIn} // Register action on touch
          onPressOut={handlePressOut} // Handle animation reset on release
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                backgroundColor: '#4CAF50',
                borderRadius: 50,
                height: 100,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              },
            ]}
          >
            <Text className="text-white font-bold text-3xl">Tap Rhythm</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Display Result */}
      {isProblemCorrect && (
        <View className="absolute bottom-10">
          <Text className="text-green-500 font-bold text-xl">You got it correct!</Text>
        </View>
      )}
    </ActivityBase>
  );
};

export default TapRythm;