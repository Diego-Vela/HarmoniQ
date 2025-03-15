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
      name="(lessons)/[id]"
      options={{ headerShown: false}}
    />
    <Stack.Screen
      name="(lessons)/note-reading/notereading"
      options={{ headerShown: false}}
    />
    
  </Stack>;
}
