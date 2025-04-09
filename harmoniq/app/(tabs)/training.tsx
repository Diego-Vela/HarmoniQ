// Training.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Topbar from '@/components/topbar';
import { images } from '@/constants/images';

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
      <View className="flex-1">
        <Image source={images.bg} className="absolute w-full h-[50%] z-0" resizeMode="cover" />
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          
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
          <TouchableOpacity onPress={() => navigateToLevelSelect('notation', 'key-signature-id-game')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-red-600">
            <Text className="text-primary font-semibold text-xl">Key Signature Identification</Text>
          </TouchableOpacity>

          {/* Rhythm Section */}
          <Text className="text-2xl font-bold text-white mt-4 mb-2">Rhythm</Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" /> 
          <TouchableOpacity onPress={() => navigateToLevelSelect('rhythm', 'tap-rhythm-game')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-blue-600">
            <Text className="text-primary font-semibold text-xl">Tap Rhythm</Text>
          </TouchableOpacity>

          {/* Interval Section */}
          <Text className="text-2xl font-bold text-white mt-4 mb-2">Intervals</Text>
          <View className="w-full h-[1px] bg-gray-600 mb-4" /> 
          <TouchableOpacity onPress={() => navigateToLevelSelect('intervals', 'interval-game')} className="bg-white p-5 mt-4 mb-4 rounded-xl border-l-4 border-green-600">
            <Text className="text-primary font-semibold text-xl">Interval Ear Training</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Training;