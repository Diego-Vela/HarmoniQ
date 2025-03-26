import React from 'react';
import { Stack } from 'expo-router';

export default function LessonsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This lets the Stack wrap your nested pages */}
    </Stack>
  );
};
