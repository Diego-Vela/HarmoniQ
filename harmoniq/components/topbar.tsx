import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { icons } from "@/constants/icons";
import { RFValue } from 'react-native-responsive-fontsize';

const level = 10;

const Topbar = () => {
  return (
    <View className="flex-row items-center w-[98%] mt-0 h-[100%] bg-transparent mr-4">
      <View className="flex-row items-center justify-start w-[40%] h-[100%] bg-transparent">
        <Image source={icons.logo} className="w-[100%] h-[100%] mb-2 mt-2" resizeMode="contain"/>
      </View>
      {/* Streak Icon */}
      <View className="flex-row items-center justify-center bg-transparent h-12 w-1/5 mt-4">
        <Image source={icons.streak} className="w-[30%] h-[100%] mt-0 mb-2" resizeMode="contain"/>
        <Text style={{ fontSize: RFValue(12) }} className="text-secondary font-bold px-1 mb-1">7</Text>
      </View>
      {/* Level and XP Bar */}
      <View className="flex-row items-center justify-evenly w-[40%] h-[80%] bg-transparentmt mt-3">
        <Text style={{ fontSize: RFValue(12) }} className="text-blue-300 font-semibold w-[40%] bg-transparent text-center">Lv: {level}</Text>
        <View className="relative w-[60%] h-[50%] bg-gray-500 rounded-xl justify-center z-0">
          <View className="absolute w-[50%] h-[100%] bg-blue-300 rounded-xl mt-1"/>  
          <Text style={{ fontSize: RFValue(10), position: 'absolute' }} className="w-full text-primary font-semibold text-center">5/10</Text>
        </View>
      </View>
    </View>
  );
};

export default Topbar;

const styles = StyleSheet.create({});