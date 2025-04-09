import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type AllQualityProps = {
  quality: string[];
  selectedQuality: string | null;
  setSelectedQuality: (quality: string | null) => void;
};

const AllQuality: React.FC<AllQualityProps> = ({ quality, selectedQuality, setSelectedQuality }) => {
  return (
    <View className="flex-wrap flex-row w-[90%] h-[20%] bg-green-300 items-start justify-evenly">
      {quality.map(q => (
        <TouchableOpacity
          key={q}
          className={`w-[30%] h-[45%] rounded-xl items-center justify-center mt-[1%] mb-[1%] ${
            selectedQuality === q ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={() => setSelectedQuality(selectedQuality === q ? null : q)}
        >
          <Text className="text-center text-base">{q}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AllQuality;

const styles = StyleSheet.create({});