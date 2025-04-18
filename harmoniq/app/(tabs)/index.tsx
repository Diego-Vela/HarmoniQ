import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";

import lessonData from '@/data/unlock-data.json';

import { useStatsStore } from '@/stores/useStatsStore';
import { useXpStore } from '@/stores/useXpStore';
import { initMissions } from "@/utils/init-missions-util";

import Chapter from "@/components/chapter";
import LessonCard from "@/components/lesson-card";
import Background from "@/components/common/background";

const { height } = Dimensions.get("window"); // Get screen height

export default function Index() {
  const router = useRouter();
  initMissions();

  return (
    <Background>
      <Chapter />
      <ScrollView
        className="flex-1"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 100 }}
      >
        <View
          className="flex flex-col justify-between items-center bg-transparent rounded-lg"
          style={{ marginTop: height * 0.12 }} // Set marginTop to 15% of screen height
        >
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
