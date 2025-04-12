import React, { useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CompletionScreen from '@/components/screens/completion-screen';
import { useProgressStore } from '@/stores/useProgressStore';
import { useXP } from '@/hooks/useXp';
import Background from '@/components/common/background';

const CompletionPage = () => {
  const router = useRouter();
  const { mode, category, subcategory, level } = useLocalSearchParams();
  const parsedLevel = parseInt(level as string || '1');

  const isLesson = mode === 'lesson';
  const isTraining = mode === 'training';

  const lessonKey = `${subcategory}-${parsedLevel}`;
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete);
  const hasCompletedBefore = completedLessons.has(lessonKey);

  const { claimXP } = useXP();
  const xpAwarded = isLesson ? (hasCompletedBefore ? 0 : 50) : 30;

  const hasAwardedXP = useRef(false);

  useEffect(() => {
    if (!hasAwardedXP.current && xpAwarded > 0) {
      claimXP(xpAwarded);
      if (isLesson && !hasCompletedBefore) {
        markLessonComplete(lessonKey);
      }
      hasAwardedXP.current = true;
    }
  }, [xpAwarded]);

  return (
    <Background>
      <CompletionScreen
        mode={isLesson ? 'lesson' : 'training'}
        xpAwarded={xpAwarded}
        onNext={() =>
          router.replace(isLesson ? '/' : '/level-select')
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
    </Background>
  );
};

export default CompletionPage;
