import React from "react";
import { View, SafeAreaView, Image, ImageBackground } from "react-native";
import Topbar from "@/components/common/topbar";
import { images } from "@/constants/images";

type BackgroundProps = {
  children: React.ReactNode;
};

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      {/* Topbar */}
      <View className="flex justify-center items-center w-full h-[8%] mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar />
      </View>

      {/* Content with Background */}
      <ImageBackground
        source={images.bgMain} // Use the new background image
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="flex-1">
          {/* Secondary Background Image */}
          <Image
            source={images.bg}
            className="absolute w-full h-[50%] z-0"
            resizeMode="cover"
          />
          {children}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Background;