import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const ReturnHome: React.FC = () => {
  const navigation = useNavigation(); // Use navigation hook

  const handlePress = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <TouchableOpacity
      className="absolute top-12 left-5 bg-black/50 rounded-full w-[10%] h-[5%] items-center justify-center z-10"
      onPress={handlePress}
    >
      <Text className="text-white text-4xl font-bold">{'<'}</Text>
    </TouchableOpacity>
  );
};

export default ReturnHome;