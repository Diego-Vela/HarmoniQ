import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CompletionScreen from '@/components/screens/completion-screen';
import { useProgressStore } from '@/stores/useProgressStore';
import { useXP } from '@/hooks/useXp';
import { playXpSound } from '@/hooks/useXpSound';
import { useStatsStore } from '@/stores/useStatsStore';
import { useMissions } from '@/hooks/useMissions';


const CompletionPage = () => {
  const router = useRouter();
  const { mode, category, subcategory, level } = useLocalSearchParams<{
    mode: string;
    category: string;
    subcategory: string;
    level: string;
  }>();
  const parsedLevel = parseInt(level as string || '1');

  // console.log(mode, category, subcategory, parsedLevel);

  const isLesson = mode === 'lesson';
  const isTraining = mode === 'training';

  const lessonKey = `${subcategory}-${parsedLevel}`;
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete);
  const hasCompletedBefore = completedLessons.has(lessonKey);

  const { claimXP } = useXP();
  const xpAwarded = isLesson ? (hasCompletedBefore ? 0 : 80) : 30;

  const [hasClaimed, setHasClaimed] = useState(false);

  const incrementTrainingStat = useStatsStore((s) => s.incrementTrainingStat);

  const { updateMissionsFromActivity } = useMissions();

  const updateStreak = useStatsStore((s) => s.updateStreak);

  const handleClaim = () => {
    if (!hasClaimed && xpAwarded > 0) {
      updateStreak(new Date());
      playXpSound();
      claimXP(xpAwarded);

      updateMissionsFromActivity('training', category, subcategory, xpAwarded);
  
      if (isTraining && category && subcategory) {
        incrementTrainingStat(category as any, subcategory as string); 
      }
  
      if (isLesson && !hasCompletedBefore) {
        markLessonComplete(lessonKey);
      }
    }

    setHasClaimed(true);
  };
  
  return (
    <CompletionScreen
      mode={isLesson ? 'lesson' : 'training'}
      xpAwarded={xpAwarded}
      onClaim={handleClaim}
      hasClaimed={hasClaimed}
      onNext={() =>
        router.replace(isLesson ? '/' : '/training')
      }
      onReplay={
        isTraining
          ? () =>
              router.replace({
                pathname: '/entry-point',
                params: { category, subcategory, level },
              })
          : undefined
      }
    />
  );
};

export default CompletionPage;
