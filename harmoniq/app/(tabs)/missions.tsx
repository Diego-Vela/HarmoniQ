import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Topbar from '@/components/topbar';
import { images } from '@/constants/images';

type Mission = {
  id: string;
  title: string;
  type: 'daily' | 'weekly';
  completed: boolean;
  xpReward: number;
  progress: { current: number; goal: number };
};

const dummyMissions: Mission[] = [
  {
    id: 'm1',
    title: 'Complete 3 note reading questions',
    type: 'daily',
    completed: false,
    xpReward: 50,
    progress: { current: 2, goal: 3 },
  },
  {
    id: 'm2',
    title: 'Tap 2 rhythms correctly',
    type: 'daily',
    completed: false,
    xpReward: 50,
    progress: { current: 1, goal: 2 },
  },
  {
    id: 'm3',
    title: 'Get 10 correct interval answers',
    type: 'weekly',
    completed: false,
    xpReward: 200,
    progress: { current: 4, goal: 10 },
  },
];

const Missions = () => {
  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex justify-center items-center w-full h-[8%] bg-primary border-b border-gray-600">
        <Topbar />
      </View>

      <View className="flex-1">
        <Image source={images.bg} className="absolute w-full h-[50%] z-0" resizeMode="cover" />

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Daily Missions Section */}
          <Text className="text-2xl font-bold text-white mt-4 mb-2">Daily Missions</Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" />
          {dummyMissions
            .filter(m => m.type === 'daily')
            .map(m => (
              <View
                key={m.id}
                className="border border-gray-600 rounded-xl mb-4 bg-transparent"
              >
                <View
                  className="p-5 rounded-xl shadow-lg opacity-95"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5, // For Android shadow
                  }}
                >
                  <Text className="text-white font-semibold text-xl opacity-90 shadow-sm">
                    {m.title}
                  </Text>
                  <Text className="text-white mt-2 text-lg opacity-80 shadow-sm">
                    {m.progress.current} / {m.progress.goal}
                  </Text>
                </View>
              </View>
            ))}

          {/* Weekly Missions Section */}
          <Text className="text-2xl font-bold text-white mt-6 mb-2">Weekly Mission</Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" />
          {dummyMissions
            .filter(m => m.type === 'weekly')
            .map(m => (
              <View
                key={m.id}
                className="border border-gray-600 rounded-xl mb-4 bg-transparent"
              >
                <View
                  className="p-5 rounded-xl shadow-lg opacity-95"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5, // For Android shadow
                  }}
                >
                  <Text className="text-white font-semibold text-xl opacity-90 shadow-sm">
                    {m.title}
                  </Text>
                  <Text className="text-white mt-2 text-lg opacity-80 shadow-sm">
                    {m.progress.current} / {m.progress.goal}
                  </Text>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Missions;
