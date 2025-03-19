import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { images } from "@/constants/images";
import Topbar from "@/components/topbar";
import React from "react";
import { RFValue } from 'react-native-responsive-fontsize';
import Lesson from "@/components/lesson";
import Chapter from "@/components/chapter";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex justify-center items-center w-full h-[8%] mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar/>
      </View>
      <View className="flex-1">
        <Image source={images.bg} className="absolute w-full h-[50%] z-0" resizeMode="cover"/>
        <Chapter/>
        <ScrollView className="flex-1" showsHorizontalScrollIndicator={false} contentContainerStyle={{minHeight: '100%', paddingBottom: 0}}>
          <View className="flex flex-col justify-between items-center mt-0 bg-transparent rounded-lg">
            <Lesson lesson="note-reading" activity="notereading"/>
            <Lesson lesson="(rythm)" activity="tap-rythm"/>
            <Lesson lesson="" activity=""/>
            <Lesson lesson="" activity=""/>
            <Lesson lesson="" activity=""/>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
