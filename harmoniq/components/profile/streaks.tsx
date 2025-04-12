import React from 'react';
import { Text } from 'react-native';
import Section from '@/components/profile/section';

const Streaks = ({ streak, longest, lastActive }: { streak: number; longest: number; lastActive: string | null }) => (
  <Section title="Streaks">
    <Text className="text-white text-base mb-1">🔥 Daily Streak: {streak}</Text>
    <Text className="text-white text-base mb-1">🏅 Longest Streak: {longest}</Text>
    <Text className="text-white text-base">📅 Last Activity: {lastActive || 'N/A'}</Text>
  </Section>
);

export default Streaks;