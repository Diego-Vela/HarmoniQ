import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { icons } from "@/constants/icons";
import { RFValue } from 'react-native-responsive-fontsize';

const level = 10;

const Topbar = () => {
  return (
    <View className="flex-row items-end justify-between w-full mt-16 h-12 py-1 bg-transparent">
      <Image source={icons.logo} className="w-2/5 h-12 mt-0 mb-2" resizeMode="contain"/>
      {/* Streak Icon */}
      <View className="flex-row items-center justify-center bg-transparent h-12 w-1/5">
        <Image source={icons.streak} className="w-1/5 h-1/2 mt-0 mb-2" resizeMode="contain"/>
        <Text style={{ fontSize: RFValue(10) }} className="text-white font-semibold text-lg px-1 mb-1">1</Text>
      </View>
      {/* Level and XP Bar */}
      <View className="flex-row items-center justify-evenly w-2/5 h-12 bg-transparent">
        <Text style={{ fontSize: RFValue(10) }} className="text-secondary font-semibold w-1/5 bg-transparent text-center">Lv:{level}</Text>
        <View className="relative w-3/5 h-1/2 bg-gray-500 rounded-xl justify-center z-0">
          <View className="absolute w-6/12 h-full bg-secondary rounded-xl mt-1"/>  
          <Text style={{ fontSize: RFValue(10), position: 'absolute' }} className="w-full text-primary font-semibold text-center">5/10</Text>
        </View>
      </View>
    </View>
  );
};

export default Topbar;

const styles = StyleSheet.create({});