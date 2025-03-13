import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Topbar from "@/components/topbar";
import React from "react";
import { RFValue } from 'react-native-responsive-fontsize';

export default function Missions() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-dark-300">
      <View className="w-full h-28 mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar/>
      </View>
      <Image source={images.bg} className="absolute w-full z-0 mt-28" resizeMode="cover"/>
      <ScrollView className="flex-1 px-10" showsHorizontalScrollIndicator={false} contentContainerStyle={{minHeight: '100%', paddingBottom: 10}}>
        <TouchableOpacity className="mt-10 bg-blue-500 py-3 px-6 rounded-full" onPress={() => router.push("/profile")}>
          <Text className="text-white text-center font-semibold">Go to Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
