import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import ActivityBase from '@/components/activities/common/activity-base';
import Timer from '@/components/activities/common/timer';

import { ActivityDefinition } from '@/constants/types';
import { getActivityDescription, isTimedActivity } from '@/utils/activity-sequence-utils';
import { resolveActivityComponent } from '@/utils/activity-resolver'; 

type Props = {
  mode: 'training' | 'lesson';
  sequence: ActivityDefinition[];
  onComplete: () => void;
};

const ActivitySequenceManager: React.FC<Props> = ({ mode, sequence, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [activityDescription, setActivityDescription] = useState('');

  const current = sequence[currentIndex];

  const handleActivitySuccess = () => {
    const next = currentIndex + 1;
    setCompletedCount((prev) => prev + 1);

    if (next < sequence.length) {
      setCurrentIndex(next);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (!current) return;
    setActivityDescription(getActivityDescription(current.type));
  }, [current]);

  return (
    <ActivityBase description={activityDescription}>
      {!isTimedActivity(current) && (
        <View className="w-[60%] h-[3%] bg-gray-400 rounded-full overflow-hidden mt-6">
          <View
            style={{
              width: sequence.length > 0 ? `${(completedCount / sequence.length) * 100}%` : '0%',
            }}
            className="h-full bg-green-500"
          />
        </View>
      )}

      {resolveActivityComponent(current, handleActivitySuccess, currentIndex)}
    </ActivityBase>
  );
};

export default ActivitySequenceManager;
