import React from "react";
import { View, SafeAreaView } from "react-native";
import Topbar from "@/components/common/topbar";

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

      {/* Content */}
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};

export default Background;