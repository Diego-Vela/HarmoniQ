import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type SimpleIntervalsProps = {
  intervals: string[]; // Interval abbreviations like "M2", "P5", etc.
  selectedInterval: string | null;
  onIntervalPress: (interval: string) => void; // Function to handle interval press
  disabled: boolean; // Prop to disable buttons
};

// Map interval abbreviations to their full names
const intervalNames: Record<string, string> = {
  M2: 'Major 2nd',
  m3: 'Minor 3rd',
  M3: 'Major 3rd',
  P4: 'Perfect 4th',
  P5: 'Perfect 5th',
  M6: 'Major 6th',
  m7: 'Minor 7th',
  M7: 'Major 7th',
  Octave: 'Octave',
};

const SimpleIntervals: React.FC<SimpleIntervalsProps> = ({
  intervals,
  selectedInterval,
  onIntervalPress,
  disabled,
}) => {
  return (
    <View className="flex-wrap flex-row w-[100%] h-[70%] bg-transparent items-center justify-evenly">
      {intervals.map((interval) => {
        const isSelected = selectedInterval === interval;

        // Get the full name of the interval
        const displayInterval = intervalNames[interval] || interval;

        return (
          <TouchableOpacity
            key={interval}
            className={`w-[45%] h-[45%] rounded-3xl items-center justify-center mt-[1%] mb-[1%] ${
              disabled
                ? 'bg-gray-500' // Darker gray when disabled
                : isSelected
                ? 'bg-blue-500' // Highlighted when selected
                : 'bg-gray-300' // Default background color
            }`}
            onPress={() => onIntervalPress(interval)}
            disabled={disabled} // Disable button when `disabled` is true
          >
            <Text
              className={`text-center text-3xl font-bold ${
                disabled ? 'text-gray-400' : 'text-black'
              }`} // Change text color when disabled
            >
              {displayInterval}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SimpleIntervals;

const styles = StyleSheet.create({});