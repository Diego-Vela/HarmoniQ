// Training.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Topbar from '@/components/topbar';

const Training = () => {
  const router = useRouter();

  const navigateToLevelSelect = (category: string, subcategory: string) => {
    router.push({ pathname: '../level-select', params: { category, subcategory } });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex justify-center items-center w-full h-[8%] bg-primary border-b border-gray-600">
        <Topbar />
      </View>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

        {/* Note Reading Section */}
        <Text className="text-xl font-bold text-white mt-4 mb-2">Note Reading</Text>
        <View className="flex-row justify-evenly mb-4">
          <TouchableOpacity onPress={() => navigateToLevelSelect('note-reading', 'treble-clef-game')} className="bg-accent p-4 rounded-xl">
            <Text className="text-white font-semibold">Treble</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToLevelSelect('note-reading', 'bass-clef-game')} className="bg-accent p-4 rounded-xl">
            <Text className="text-white font-semibold">Bass</Text>
          </TouchableOpacity>
        </View>

        {/* Notation Section */}
        <Text className="text-xl font-bold text-white mb-2">Notation</Text>
        <TouchableOpacity onPress={() => navigateToLevelSelect('notation', 'key-signature-id')} className="bg-accent p-4 rounded-xl mb-4">
          <Text className="text-white font-semibold">Key Signatures</Text>
        </TouchableOpacity>

        {/* Rhythm Section */}
        <Text className="text-xl font-bold text-white mb-2">Rhythm</Text>
        <TouchableOpacity onPress={() => navigateToLevelSelect('rhythm', 'rhythm-quiz')} className="bg-accent p-4 rounded-xl mb-4">
          <Text className="text-white font-semibold">Tap Rhythm</Text>
        </TouchableOpacity>

        {/* Interval Section */}
        <Text className="text-xl font-bold text-white mb-2">Intervals</Text>
        <TouchableOpacity onPress={() => navigateToLevelSelect('intervals', 'interval-activity')} className="bg-accent p-4 rounded-xl mb-8">
          <Text className="text-white font-semibold">Interval Training</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Training;