import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { icons } from "@/constants/icons";

const Topbar = () => {
  return (
    <View className="flex-row items-end justify-between w-full mt-16 h-12 bg-transparent">
      <Image source={icons.logo} className="w-2/5 h-12 mt-0 mb-2"/>
      
      <View className="flex-row items-center justify-center bg-transparent h-12 w-1/5">
        <Text className="text-white text-base font-semibold">StreakIcon</Text>
      </View>
      
      <View className="flex-row items-center justify-evenly w-2/5 h-12 bg-transparent">
        <Text className='text-white text-auto font-semibold w-1/2'>Level</Text>
        <Text className='text-white text-auto font-semibold w-1/2'>LevelUpBar</Text>
      </View>
    </View>
  );
};

export default Topbar;

const styles = StyleSheet.create({});