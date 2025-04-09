import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type AllAccidentalsProps = {
  accidentals: string[];
  selectedAccidental: string | null;
  setSelectedAccidental: (accidental: string | null) => void;
};

const AllAccidentals: React.FC<AllAccidentalsProps> = ({ accidentals, selectedAccidental, setSelectedAccidental }) => {
  return (
    <View className="flex-wrap flex-row w-[90%] h-[20%] bg-orange-300 items-start justify-evenly">
      {accidentals.map(accidental => (
        <TouchableOpacity
          key={accidental}
          className={`w-[30%] h-[45%] rounded-xl items-center justify-center mt-[1%] mb-[1%] ${
            selectedAccidental === accidental ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={() => setSelectedAccidental(selectedAccidental === accidental ? null : accidental)}
        >
          <Text className="text-center text-3xl">{accidental}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AllAccidentals;

const styles = StyleSheet.create({});