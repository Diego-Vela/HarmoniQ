import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants/images";
import Topbar from "@/components/topbar";
import React from "react";
import { RFValue } from 'react-native-responsive-fontsize';
import Lesson from "@/components/lesson";
import Chapter from "@/components/chapter";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-dark-300">
      <View className="w-full h-28 mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar/>
      </View>
      <Image source={images.bg} className="absolute w-full z-0 mt-28" resizeMode="cover"/>
      <ScrollView className="flex-1" showsHorizontalScrollIndicator={false} contentContainerStyle={{minHeight: '100%', paddingBottom: 0}}>
        <View className="flex flex-col justify-between items-center mt-0 bg-transparent rounded-lg">
          <Chapter/>
          <Lesson />
          <Lesson/>
          <Lesson/>
          <Lesson/>
          <Lesson/>
        </View>
      </ScrollView>
    </View>
  );
}
