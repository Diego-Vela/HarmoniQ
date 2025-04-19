import React, { useState } from "react";
import { ScrollView, Alert, TouchableOpacity, Text, View } from "react-native";
import Background from "@/components/common/background";
import ProfileHeader from "@/components/profile/profile-header";
import XPSection from "@/components/profile/xp-section";
import LessonProgress from "@/components/profile/lesson-progress";
import Streaks from "@/components/profile/streaks";
import CollapsibleStatSection from "@/components/profile/collapsible-stat-section";
import { useStatsStore } from "@/stores/useStatsStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useXpStore } from "@/stores/useXpStore";
import { resetAllStores } from "@/utils/reset-all-stores";
import { initMissions } from "@/utils/init-missions-util";

const Profile = () => {
  const { lifetime, weekly, daily, dailyStreak, lastActivityDate } = useStatsStore();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const { totalXP } = useXpStore();

  const handleReset = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to reset all app data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", 
          onPress: () => {
            resetAllStores();
            initMissions(); 
        }}
      ]
    );
  };

  return (
    <Background>
      <ScrollView className="flex-1" contentContainerStyle={{ minHeight: "100%", paddingBottom: 100 }}>
        <ProfileHeader />
        <XPSection totalXP={totalXP} />
        <LessonProgress progress={lifetime.lessonProgress} completed={completedLessons} />
        <Streaks streak={dailyStreak} longest={lifetime.longestStreak} lastActive={lastActivityDate} />
        <CollapsibleStatSection title="Lifetime Training Stats" stats={lifetime} />
        <CollapsibleStatSection title="Weekly Training Stats" stats={weekly} />
        <CollapsibleStatSection title="Daily Training Stats" stats={daily} />

        {/* Reset Button */}
        <View className="mt-5 items-center mb-10">
          <TouchableOpacity
            onPress={handleReset}
            className="bg-red-600 py-3 px-6 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Reset All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
};

export default Profile;
