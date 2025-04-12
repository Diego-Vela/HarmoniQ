import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StatCategory,
  TrainingStats,
  TimeScopeStats,
  StatsStore,
} from '@/constants/types';

const createEmptyStatCategory = (): StatCategory => ({
  total: 0,
  subcategories: {},
});

const createEmptyTrainingStats = (): TrainingStats => ({
  'note-reading': createEmptyStatCategory(),
  rhythm: createEmptyStatCategory(),
  intervals: createEmptyStatCategory(),
  notation: createEmptyStatCategory(),
});

const createEmptyTimeScopeStats = (): TimeScopeStats => ({
  trainingsCompleted: 0,
  trainingStats: createEmptyTrainingStats(),
});

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      lifetime: {
        ...createEmptyTimeScopeStats(),
        lessonProgress: '',
        longestStreak: 0,
      },
      weekly: createEmptyTimeScopeStats(),
      daily: createEmptyTimeScopeStats(),
      dailyStreak: 0,
      lastActivityDate: null,

      incrementTrainingStat: (category, subcategory) => {
        const updateScope = (scope: TimeScopeStats) => {
          const currentCat = scope.trainingStats[category];
          const newSubcategories = {
            ...currentCat.subcategories,
            [subcategory]: (currentCat.subcategories[subcategory] || 0) + 1,
          };

          return {
            ...scope,
            trainingsCompleted: scope.trainingsCompleted + 1,
            trainingStats: {
              ...scope.trainingStats,
              [category]: {
                total: currentCat.total + 1,
                subcategories: newSubcategories,
              },
            },
          };
        };

        set((state) => ({
          lifetime: {
            ...updateScope(state.lifetime),
            lessonProgress: state.lifetime.lessonProgress,
            longestStreak: state.lifetime.longestStreak,
          },
          weekly: updateScope(state.weekly),
          daily: updateScope(state.daily),
        }));
        
        // console.log('[Stats] Updated lifetime stats:', get().lifetime);
      },

      updateLessonProgress: (newProgress: string) => {
        set((state) => ({
          lifetime: {
            ...state.lifetime,
            lessonProgress: newProgress,
          },
        }));
      },
      

      updateStreak: (currentDate: Date) => {
        const today = currentDate.toDateString();
        const { lastActivityDate, dailyStreak, lifetime } = get();

        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        const isToday = lastActivityDate === today;
        const isYesterday = lastActivityDate === yesterday.toDateString();

        if (isToday) return;

        const newStreak = isYesterday ? dailyStreak + 1 : 1;
        const newLongest = Math.max(lifetime.longestStreak, newStreak);

        set((state) => ({
          dailyStreak: newStreak,
          lastActivityDate: today,
          lifetime: {
            ...state.lifetime,
            longestStreak: newLongest,
          },
        }));
      },

      resetDaily: () => {
        set({ daily: createEmptyTimeScopeStats(), dailyStreak: 0 });
      },

      resetWeekly: () => {
        set({ weekly: createEmptyTimeScopeStats() });
      },
    }),
    {
      name: 'stats-storage',
    }
  )
);
