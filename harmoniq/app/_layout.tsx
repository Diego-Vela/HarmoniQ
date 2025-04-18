import React from 'react';
import { Stack } from "expo-router";
import './globals.css';
import { useInitMissions } from '@/hooks/useInitMissions';

export default function RootLayout() {
  useInitMissions();

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(lessons)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="screens"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
