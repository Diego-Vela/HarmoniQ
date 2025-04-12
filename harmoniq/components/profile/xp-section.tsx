import React from 'react';
import { Text } from 'react-native';
import Section from '@/components/profile/section';

const XPSection = ({ totalXP }: { totalXP: number }) => (
  <Section title="Total XP">
    <Text className="text-yellow-400 text-3xl font-bold text-center shadow-[0_0_20px_#facc15]">
      {totalXP} XP
    </Text>
  </Section>
);

export default XPSection;