{/* Base template for all activity screens. Takes children and spaces them out evenly
      Uses SafeAreaView to ensure content is not hidden by notches or system bars
      Includes background style, 
               ReturnHome button
               Activity Description when provided
  */}
import React from 'react';
import { View, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnHome from '@/components/return-home';
import { images } from '@/constants/images';

interface ActivityBaseProps {
  children: React.ReactNode; // Content to render inside the activity
  description?: string; // Optional description of the activity
}

const ActivityBase: React.FC<ActivityBaseProps> = ({ children, description }) => {
  return (
    <SafeAreaView className="flex-1 bg-dark-200 relative justify-evenly">
      {/* Return Home Button */}
      <ReturnHome />

      {/* Background Image */}
      <Image
        source={images.bg}
        className="absolute top-0 left-0 w-full h-[35%] z-0"
        resizeMode="cover"
      />


      {/* Activity Content */}
      <View className="flex-1 items-center justify-evenly mt-4">
        {description && (
        <View className="flex w-[70%] h-[10%] bg-accent rounded-xl justify-center shadow-lg">
          <Text className="text-white text-center font-bold text-lg">{description}</Text>
        </View>
        )}
        {children}

      </View>
    </SafeAreaView>
  );
};

export default ActivityBase;