import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnHome from '@/components/return-home';
import { images } from '@/constants/images';

interface ActivityBaseProps {
  children: React.ReactNode; // Content to render inside the activity
}

const ActivityBase: React.FC<ActivityBaseProps> = ({ children }) => {
  return (
    <SafeAreaView className="flex-1 bg-dark-200 relative">
      {/* Return Home Button */}
      <ReturnHome />

      {/* Background Image */}
      <Image
        source={images.bg}
        className="absolute top-0 left-0 w-full h-[35%] z-0"
        resizeMode="cover"
      />

      {/* Activity Content */}
      <View className="flex-1 items-center justify-center">{children}</View>
    </SafeAreaView>
  );
};

export default ActivityBase;