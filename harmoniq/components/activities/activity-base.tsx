import React from 'react';
import { View, Image, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnHome from '@/components/common/return-home';
import { images } from '@/constants/images';  5498

interface ActivityBaseProps {
  children: React.ReactNode; // Content to render inside the activity
  description?: string; // Optional description of the activity
}

const ActivityBase: React.FC<ActivityBaseProps> = ({ children, description }) => {
  return (
    <SafeAreaView className="flex-1 bg-dark-300 relative justify-evenly">
      <ImageBackground
        source={images.bgMain} // Use the new background image
        style={{ flex: 1 }}
        resizeMode="cover"
      >
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
          <View className="flex w-[100%] h-[10%] bg-primary border border-white justify-center">
            <Text className="text-white text-center font-bold text-xl">{description}</Text>
          </View>
          )}
          {children}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ActivityBase;