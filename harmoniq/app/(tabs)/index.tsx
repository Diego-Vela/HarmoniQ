import { Text, View, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Topbar from "@/components/topbar";
import React from "react";

export default function Index() {
  return (
    <View className="flex-1 bg-dark-300">
      <View className="w-full h-28 mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar/>
      </View>
      <Image source={images.bg} className="absolute w-full z-0 mt-28"/>
      <ScrollView className="flex-1 px-10" showsHorizontalScrollIndicator={false} contentContainerStyle={{minHeight: '100%', paddingBottom: 10}}/>
    </View>
  );
}
