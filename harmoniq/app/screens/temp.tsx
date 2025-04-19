import React from 'react';
import { Text, View } from 'react-native';
import ActivityBase from '@/components/activities/common/activity-base';
import Timer from '@/components/activities/common/timer';

const TempScreen = () => {
  const handleComplete = () => {
    console.log('Timer finished!');
  };

  return (
    <ActivityBase>
      <View className="flex-1 justify-center items-center space-y-4">
        <Timer duration={30} onComplete={handleComplete} />
        <Text className="text-white text-xl">Time Trial Active</Text>
      </View>
    </ActivityBase>
  );
};

export default TempScreen;