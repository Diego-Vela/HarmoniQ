import React from 'react';
import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return <Stack> 
    <Stack.Screen
      name="(tabs)"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="(lessons)"
      options={{ headerShown: false}}
    />
    <Stack.Screen
      name="level-select"
      options={{ headerShown: false }}
    />
    
  </Stack>;
}
