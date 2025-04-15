import { View, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import Chapter from "@/components/chapter";
import LessonCard from "@/components/lesson-card";
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
        <View className="flex flex-col justify-between items-center mt-40 bg-transparent rounded-lg">
          <LessonCard chapter="Chapter 1" level="1" />
          <LessonCard chapter="Chapter 1" level="2" />
          <LessonCard chapter="Chapter 1" level="3" />
          <LessonCard chapter="Chapter 1" level="4" />
          <LessonCard chapter="Chapter 1" level="5" />
        </View>
      </ScrollView>
    </Background>
  );
}
