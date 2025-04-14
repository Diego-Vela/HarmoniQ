import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CompletionScreen from '@/components/screens/completion-screen';
import { useXP } from '@/hooks/useXp';
import { playXpSound } from '@/hooks/useXpSound';
import { useStatsStore } from '@/stores/useStatsStore';
import { useMissions } from '@/hooks/useMissions';
import { useProgressStore } from '@/stores/useProgressStore';
import  {
  getTrainingXP,
  getLessonXP,
  getLessonCompletionBonus,
} from '@/utils/xp-utils';

const CompletionPage = () => {
  const router = useRouter();
  const incrementLessonProgress = useProgressStore((s) => s.incrementLessonProgress);
  const { mode, category, subcategory, level } = useLocalSearchParams<{
    mode: string;
    category: string;
    subcategory: string;
    level: string;
  }>();
  const parsedLevel = parseInt(level as string || '1');
  const isLesson = mode === 'lesson';
  const isTraining = mode === 'training';
  const lessonKey = `${subcategory}-${parsedLevel}`;
  const { claimXP } = useXP();
  const lastCompletedLesson = useStatsStore((s) => s.lastCompletedLesson);
  const hasCompletedBefore = lastCompletedLesson && lessonKey <= lastCompletedLesson;
  const xpAwarded = isLesson
  ? (hasCompletedBefore
      ? 0
      : getLessonXP(parseInt(subcategory.split(' ')[1]), lessonKey))
  : getTrainingXP(parsedLevel);
  const [hasClaimed, setHasClaimed] = useState(false);
  const incrementTrainingStat = useStatsStore((s) => s.incrementTrainingStat);
  const { updateMissionsFromActivity } = useMissions();
  const updateStreak = useStatsStore((s) => s.updateStreak);
  const updateLessonProgress = useStatsStore((s) => s.updateLessonProgress);

  const handleClaim = () => {
    if (hasClaimed) return;
  
    updateStreak(new Date());
  
    if (isLesson && !hasCompletedBefore) {
      updateLessonProgress(lessonKey);
      incrementLessonProgress(); // Pass the required argument
    }
  
    if (xpAwarded > 0) {
      playXpSound();
      claimXP(xpAwarded);
      updateMissionsFromActivity('training', category, subcategory, xpAwarded);
  
      if (isTraining && category && subcategory) {
        incrementTrainingStat(category as any, subcategory);
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
