import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Topbar from "@/components/topbar";
import React from "react";
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Missions() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex justify-center items-center w-full h-[8%] mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar/>
      </View>
      <View className="flex-1">
        <Image source={images.bg} className="absolute w-full h-[50%] z-0" resizeMode="cover"/>
        <ScrollView className="flex-1" showsHorizontalScrollIndicator={false} contentContainerStyle={{minHeight: '100%', paddingBottom: 0}}>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
