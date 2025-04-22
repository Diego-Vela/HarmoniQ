import { useXpStore } from '@/stores/useXpStore';
import { useStatsStore } from '@/stores/useStatsStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useRhythmStore } from '@/stores/useRhythmStore';
import { useMissions } from '@/stores/useMissionsStore';
import { useMedalStore } from '@/stores/useMedalStore';

export const resetAllStores = () => {
  // XP Store
  useXpStore.setState({
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    justLeveledUp: false,
    streak: 0,
    levelCap: 1,
  });

  // Stats Store
  useStatsStore.setState({
    lifetime: defaultLifetimeStats,
    weekly: {
      trainingsCompleted: 0,
      trainingStats: {
        'note-reading': { total: 0, subcategories: {} },
        rhythm: { total: 0, subcategories: {} },
        intervals: { total: 0, subcategories: {} },
        notation: { total: 0, subcategories: {} },
      },
    },
    daily: {
      trainingsCompleted: 0,
      trainingStats: {
        'note-reading': { total: 0, subcategories: {} },
        rhythm: { total: 0, subcategories: {} },
        intervals: { total: 0, subcategories: {} },
        notation: { total: 0, subcategories: {} },
      },
    },
    dailyStreak: 0,
    lastActivityDate: null,
    lastCompletedLesson: null,
    nextLesson: 'Chapter 1-1',
  });

  // Progress Store
  useProgressStore.setState({
    completedLessons: 0,
    totalXP: 0,
  });

  // Rhythm Store
  useRhythmStore.setState({
    calibrationOffset: 0,
  });

  // Missions Store
  const missions = useMissions.getState();
  missions.resetAllMissions();

  // Medal Store
  useMedalStore.setState({
    medals: {}, // Reset medals to an empty object
  });
};

export const defaultLifetimeStats = {
  trainingsCompleted: 0,
  trainingStats: {
    'note-reading': { total: 0, subcategories: {} },
    rhythm: { total: 0, subcategories: {} },
    intervals: { total: 0, subcategories: {} },
    notation: { total: 0, subcategories: {} },
  },
  lessonProgress: '',
  longestStreak: 0,
};
