import React from "react";
import { ScrollView } from "react-native";
import Background from "@/components/common/background";
import ProfileHeader from "@/components/profile/profile-header";
import XPSection from "@/components/profile/xp-section";
import LessonProgress from "@/components/profile/lesson-progress";
import Streaks from "@/components/profile/streaks";
import CollapsibleStatSection from "@/components/profile/collapsible-stat-section";
import { useStatsStore } from "@/stores/useStatsStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useXpStore } from "@/stores/useXpStore";

const Profile = () => {
  const { lifetime, weekly, daily, dailyStreak, lastActivityDate } = useStatsStore();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const { totalXP } = useXpStore();

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
      </ScrollView>
    </Background>
  );
};

export default Profile;
