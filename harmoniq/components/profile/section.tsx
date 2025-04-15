import React from 'react';
import { View, Text } from 'react-native';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="bg-primary px-5 py-5 rounded-2xl mb-6 mx-5 shadow-sm shadow-white">
    <Text className="text-white text-xl font-bold mb-4">{title}</Text>
    {children}
  </View>
);

export default Section;