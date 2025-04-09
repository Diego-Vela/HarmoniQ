import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Topbar from '@/components/topbar';
import MissionCard from '@/components/mission-card';

import { images } from '@/constants/images';
import { useXP } from '@/hooks/useXp';
import { Mission } from '@/constants/types';
import { useMissions } from '@/hooks/useMissions';

const Missions = () => {
  const { missions, setMissions, loading } = useMissions(); // ⬅ hook usage
  const { claimXP } = useXP();
  const [xpGained, setXpGained] = useState<number | null>(null);
  
  // Handle claim
  const handleClaim = (mission: Mission) => {
    if (
      mission.progress.current >= mission.progress.goal &&
      !mission.completed
    ) {
      claimXP(mission.xpReward);
      setXpGained(mission.xpReward);
  
      const updatedMissions = missions.map(m =>
        m.id === mission.id ? { ...m, completed: true } : m
      );
      setMissions(updatedMissions);
  
      setTimeout(() => setXpGained(null), 2000);
    }
  };
  
  // Early exit if still loading missions
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-300 justify-center items-center">
        <Text className="text-white text-lg">Loading Missions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      {/* Topbar */}
      <View className="flex justify-center items-center w-full h-[8%] bg-primary border-b border-gray-600">
        <Topbar />
      </View>

      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={images.bg}
          className="absolute w-full h-[50%] z-0"
          resizeMode="cover"
        />

        {/* Scrollable Content */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Daily Missions Section */}
          <Text className="text-2xl font-bold text-white mt-4 mb-2">
            Daily Missions
          </Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" />
            {missions
              .filter((m) => m.type === 'daily')
              .map(m => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  onClaim={handleClaim}
                />
              ))}

          {/* Weekly Missions Section */}
          <Text className="text-2xl font-bold text-white mt-6 mb-2">
            Weekly Missions
          </Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" />
            {missions
              .filter((m) => m.type === 'weekly')
              .map(m => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  onClaim={handleClaim}
                />
              ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Missions;
