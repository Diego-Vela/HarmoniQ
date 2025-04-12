import { View, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import Chapter from "@/components/chapter";
import Lesson from "@/components/lesson";
import Background from "@/components/common/background";
import { useInitMissions } from "@/hooks/useInitMissions";
import React from "react";

export default function Index() {
  const router = useRouter();
  useInitMissions();

  return (
    <Background>
      <Chapter />
      <ScrollView
        className="flex-1"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 100 }}
      >
        <View className="flex flex-col justify-between items-center mt-0 bg-transparent rounded-lg">
          <Lesson chapter="Chapter 1" level="1" />
          <Lesson chapter="Chapter 1" level="2" />
          <Lesson chapter="Chapter 1" level="3" />
          <Lesson chapter="Chapter 1" level="4" />
          <Lesson chapter="Chapter 1" level="5" />
        </View>
      </ScrollView>
    </Background>
  );
}
