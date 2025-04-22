import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Background from '@/components/common/background';

interface FailScreenProps {
  onRetry: () => void;
  onReturnHome: () => void;
  results: [string, string];
  passRequirement: string;
}

const FailScreen: React.FC<FailScreenProps> = ({ onRetry, onReturnHome, results, passRequirement }) => {
  return (
    <Background>
      {/* Top Center Results Section */}
      <View className="flex justify-center w-full items-center h-[40%]">
        <View>
          <Text className="text-red-400 text-3xl font-bold text-center mb-[2%]">
            {results[0]} Correct
          </Text>
          <Text className="text-cyan-400 text-xl font-semibold text-center">
            {results[1]}% Accuracy
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-start items-center px-6">
        <Text className="text-red-500 text-4xl font-extrabold animate-pulse mb-4 text-center">
          ❌ Try Again!
        </Text>
        <Text className="text-white text-xl mb-10 text-center">
          {passRequirement}
        </Text>

        <TouchableOpacity
          onPress={onRetry}
          className="bg-green-600 w-[80%] py-4 rounded-xl mt-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Retry
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onReturnHome}
          className="bg-accent w-[80%] py-4 rounded-xl mt-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Return Home
          </Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default FailScreen;