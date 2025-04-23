import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CompletionScreen from '@/components/screens/completion-screen';
import FailScreen from '@/components/screens/fail-screen';
import { useXpStore } from '@/stores/useXpStore';
import { playXpSound } from '@/hooks/useXpSound';
import { useStatsStore } from '@/stores/useStatsStore';
import { useMissions } from '@/stores/useMissionsStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { awardNoteReadingMedal } from '@/utils/compare-medals-util';
import { specialLessonKeys } from '@/constants/lesson-keys';
import  {
  getTrainingXP,
  getLessonXP,
  getLessonCompletionBonus,
} from '@/utils/xp-utils';

const CompletionPage = () => {
  const router = useRouter();
  const incrementLessonProgress = useProgressStore((s) => s.incrementLessonProgress);
  const [medal, setMedal] = useState<{ medal: "None" | "Bronze" | "Silver" | "Gold" | "Platinum"; nextRequirements: string } | null>(null);
  const { mode, category, subcategory, level, results } = useLocalSearchParams<{
    mode: string;
    category: string;
    subcategory: string;
    level: string;
    results?: string;
  }>();
  const parsedLevel = parseInt(level as string || '1');
  const isLesson = mode === 'lesson';
  const isTraining = mode === 'training';
  const lessonKey = `${subcategory}-${parsedLevel}`;
  const { claimXP } = useXpStore();
  const lastCompletedLesson = useStatsStore((s) => s.lastCompletedLesson);
  const hasCompletedBefore = lastCompletedLesson && lessonKey <= lastCompletedLesson;

  // Use state to persist parsedResults
  const [parsedResults, setParsedResults] = useState<string[] | undefined>(
    results ? JSON.parse(results) : undefined
  );

  //console.log('Parsed Results:', parsedResults);

  // Static state for xpAwarded
  const [xpAwarded, setXpAwarded] = useState(() =>
    isLesson
      ? hasCompletedBefore
        ? 0
        : getLessonXP(parseInt(subcategory.split(' ')[1]), lessonKey)
      : getTrainingXP(parsedLevel)
  );

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

  useEffect(() => {
    if (
      !medal &&
      specialLessonKeys.has(`${subcategory}-${level}`) &&
      results
    ) {
      try {
        const parsed = JSON.parse(results);

        // Award the medal
        const awardedMedalObject = awardNoteReadingMedal(lessonKey, parsed[0], parsed[1]);
        //console.log('Awarded Medal:', awardedMedalObject);

        // Set the medal state
        setMedal(awardedMedalObject);

        // Update parsedResults[2] with the awarded medal
        setParsedResults((prevResults) => {
          const updatedResults = prevResults ? [...prevResults] : [];
          updatedResults[2] = awardedMedalObject.medal;
          return updatedResults;
        });

        //console.log('Parsed Results after medal:', parsedResults);
      } catch (e) {
        console.warn('Failed to parse results or evaluate medal:', e);
      }
    }
  }, [medal, results, subcategory, level, lessonKey]);

  // Render FailScreen if medal is "None"
  if (medal && medal.medal === 'None') {
    return (
      <FailScreen
        onRetry={() =>
          router.replace({
            pathname: '/screens/entry-point',
            params: { category, subcategory, level },
          })
        }
        onReturnHome={() => router.replace('/')}
        results={parsedResults && parsedResults.length === 3 ? [parsedResults[0], parsedResults[1], parsedResults[3]] : ['N/A', 'N/A', 'N/A']}
        passRequirement={medal.nextRequirements}
      />
    );
  }

  // Render CompletionScreen otherwise
  return (
    <CompletionScreen
      mode={isLesson ? 'lesson' : 'training'}
      xpAwarded={xpAwarded} // Pass the static xpAwarded value
      onClaim={handleClaim}
      hasClaimed={hasClaimed}
      onNext={() =>
        router.replace(isLesson ? '/' : '/training')
      }
      onReplay={
        isTraining
          ? () =>
              router.replace({
                pathname: '/screens/entry-point',
                params: { category, subcategory, level },
              })
          : undefined
      }
      results={parsedResults}
    />
  );
};

export default CompletionPage;
