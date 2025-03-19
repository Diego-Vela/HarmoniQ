import React from 'react';
import { Stack } from 'expo-router';

const LessonsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* All screens within the (lessons) folder will inherit this configuration */}
    </Stack>
  );
};

export default LessonsLayout;