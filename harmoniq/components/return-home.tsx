import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

const ReturnHome: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/'); // Navigate back to the home screen
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