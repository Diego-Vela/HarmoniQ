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
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [xpGained, setXpGained] = useState<number | null>(null);
  
  // Handle claim
  const handleClaim = (mission: Mission) => {
    if (
      mission.progress.current >= mission.progress.goal &&
      !claimedIds.has(mission.id)
    ) {
      claimXP(mission.xpReward);
      setClaimedIds(prev => new Set(prev).add(mission.id));
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

  const renderMission = (m: Mission) => {
    const isComplete = m.progress.current >= m.progress.goal;
    const isClaimed = claimedIds.has(m.id);

    // console.log(m.id, m.progress.current, m.progress.goal, isComplete, isClaimed);

    return (
      <View 
        key={m.id}
        className="flex justify-center border border-gray-600 rounded-xl mb-4 bg-transparent h-32"
      >
        <View className="rounded-xl shadow-lg w-full h-full opacity-95 flex-row justify-evenly items-center">
          {/* Text Section */}
          <View className="flex justify-center w-[60%] h-[100%]">
            <View className="flex justify-center items-center h-[60%] px-2">
              <Text className="text-white text-center font-semibold text-lg">{m.title}</Text>
            </View>

            {/* Progress Bar */}
            <View className="relative h-[24px] w-[90%] self-center bg-gray-700 rounded-full overflow-hidden">
              <View
                className="absolute top-0 left-0 h-full rounded-full bg-accent shadow-[0_0_10px_#FFA500]"
                style={{ width: `${(m.progress.current / m.progress.goal) * 100}%` }}
              />
              <View className="absolute w-full h-full justify-center items-center">
                <Text className="text-white text-sm font-semibold">
                  {m.progress.current} / {m.progress.goal}
                </Text>
              </View>
            </View>
          </View>


          {/* Button Section */}
          <TouchableOpacity
            onPress={() => handleClaim(m)}
            disabled={!isComplete || isClaimed}
            className={` rounded-lg justify-center w-[25%] h-[80%] ${
              isClaimed
                ? 'bg-gray-600'
                : isComplete
                ? 'bg-green-600'
                : 'bg-gray-600'
            }`}
          >
            <Text className="text-white text-center text-sm font-semibold">
              {isClaimed ? 'Claimed' : 'Claim'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
                  isClaimed={claimedIds.has(m.id)}
                  onClaim={handleClaim}
                />
              ))}

          {/* Weekly Missions Section */}
          <Text className="text-2xl font-bold text-white mt-6 mb-2">
            Weekly Missions
          </Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" />
            {missions
              .filter((m) => m.type === 'daily')
              .map(m => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  isClaimed={claimedIds.has(m.id)}
                  onClaim={handleClaim}
                />
              ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Missions;
