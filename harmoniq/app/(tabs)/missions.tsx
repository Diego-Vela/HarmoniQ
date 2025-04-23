import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import Background from '@/components/common/background';
import MissionCard from '@/components/mission-card';
import { useXpStore } from '@/stores/useXpStore';
import { useMissions } from '@/stores/useMissionsStore';
import { playXpSound } from '@/hooks/useXpSound';

const Missions = () => {
  const {
    dailyMissions,
    weeklyMissions,
    claimMission,
    claimedMissionIds,
  } = useMissions();

  const { claimXP, level, currentXP, xpToNextLevel, justLeveledUp } = useXpStore();
  const [xpGained, setXpGained] = useState<number | null>(null);

  const handleClaim = (mission: { id: string; progress: number; goal: number; xpReward: number }) => {
    const isComplete = mission.progress >= mission.goal;

    if (isComplete) {
      claimXP(mission.xpReward);
      playXpSound();
      claimMission(mission.id);
      setXpGained(mission.xpReward);

      setTimeout(() => setXpGained(null), 2000);
    }
  };

  return (
    <Background>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Daily Missions Section */}
        <Text className="text-2xl font-bold text-white mt-4 mb-2">
          Daily Missions
        </Text>
        <View className="w-full h-[1px] bg-gray-600 mb-4" />
        {dailyMissions.map((m) => (
          <MissionCard key={m.id} mission={m} onClaim={handleClaim} />
        ))}

        {/* Weekly Missions Section */}
        <Text className="text-2xl font-bold text-white mt-6 mb-2">
          Weekly Missions
        </Text>
        <View className="w-full h-[1px] bg-gray-600 mb-4" />
        {weeklyMissions.map((m) => (
          <MissionCard key={m.id} mission={m} onClaim={handleClaim} />
        ))}

        {/* XP Toast */}
        {xpGained && (
          <View className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-700 px-4 py-2 rounded-xl shadow-lg">
            <Text className="text-white font-semibold">+{xpGained} XP!</Text>
          </View>
        )}
      </ScrollView>
    </Background>
  );
};

export default Missions;
