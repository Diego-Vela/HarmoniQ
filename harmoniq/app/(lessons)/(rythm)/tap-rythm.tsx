import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Metronome from '@/components/metronome'; // Import the Metronome component
import ActivityBase from '@/components/activity-base'; // Import the reusable ActivityBase component

const TapRythm = () => {
  const bpm = 90; // Define the BPM here or dynamically set it

  return (
    <ActivityBase>
      <View className="flex bg-white w-full h-[40%] items-center justify-center">
        {/* Metronome Component */}
        <Metronome bpm={bpm} />
      </View>
      
      
    </ActivityBase>
  );
};

export default TapRythm;