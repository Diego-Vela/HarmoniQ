import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Topbar from '@/components/topbar';
import { images } from '@/constants/images';

const Training = () => {
  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex justify-center items-center w-full h-[8%] mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar/>
      </View>
      <View className="flex-1">
        <Image source={images.bg} className="absolute w-full h-[50%] z-0" resizeMode="cover"/>
        <ScrollView className="flex-1" showsHorizontalScrollIndicator={false} contentContainerStyle={{minHeight: '100%', paddingBottom: 0}}>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Training

const styles = StyleSheet.create({})