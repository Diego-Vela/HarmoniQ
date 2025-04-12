// Training.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Background from '@/components/common/background';
import { images } from '@/constants/images';

const Training = () => {
  const router = useRouter();

  const navigateToLevelSelect = (category: string, subcategory: string) => {
    router.push({ pathname: '../level-select', params: { category, subcategory } });
  };

  return (
    <Background>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Note Reading Section */}
        <Text className="text-2xl font-bold text-white mt-4 mb-2">Note Reading</Text>
        <View className="w-full h-[1px] bg-gray-600 mb-4" />
        <View className="flex-column justify-evenly">
          <TouchableOpacity onPress={() => navigateToLevelSelect('note-reading', 'treble-clef')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-orange-600">
            <Text className="text-primary font-semibold text-xl">Treble</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToLevelSelect('note-reading', 'bass-clef')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-orange-600">
            <Text className="text-primary font-semibold text-xl">Bass</Text>
          </TouchableOpacity>
        </View>

        {/* Notation Section */}
        <Text className="text-2xl font-bold text-white mt-4 mb-2">Notation</Text>
        <View className="w-full h-[1px] bg-gray-600 mb-4" />
        <TouchableOpacity onPress={() => navigateToLevelSelect('notation', 'key-signature-id')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-red-600">
          <Text className="text-primary font-semibold text-xl">Key Signature Identification</Text>
        </TouchableOpacity>

        {/* Rhythm Section */}
        <Text className="text-2xl font-bold text-white mt-4 mb-2">Rhythm</Text>
        <View className="w-full h-[1px] bg-gray-600 mb-4" />
        <TouchableOpacity onPress={() => navigateToLevelSelect('rhythm', 'tap-rhythm')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-blue-600">
          <Text className="text-primary font-semibold text-xl">Tap Rhythm</Text>
        </TouchableOpacity>

        {/* Interval Section */}
        <Text className="text-2xl font-bold text-white mt-4 mb-2">Intervals</Text>
        <View className="w-full h-[1px] bg-gray-600 mb-4" />
        <TouchableOpacity onPress={() => navigateToLevelSelect('intervals', 'interval')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-green-600">
          <Text className="text-primary font-semibold text-xl">Interval Ear Training</Text>
        </TouchableOpacity>
      </ScrollView>
    </Background>
  );
};

export default Training;