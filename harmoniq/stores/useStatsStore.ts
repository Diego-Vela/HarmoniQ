import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useXpStore } from '@/stores/useXpStore';
import lessonData from '@/data/unlock-data.json'; 
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
      lastCompletedLesson: null,
      nextLesson: "Chapter 1-1",

      incrementTrainingStat: (category: keyof TrainingStats, subcategory: string) => {
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
      },

      updateLessonProgress: (newLesson: string) => {
        const current = get().lastCompletedLesson;

        if (!current || newLesson > current) {
          const xpStore = useXpStore.getState();
          const lessons = lessonData.lessons;

          // Find the next lesson and determine the new level cap
          const findNext = lessons.find((entry) => entry.lesson === newLesson);
          const newCap = findNext?.['level-cap'] ?? 5;

          // Increase level cap if necessary
          if (typeof newCap === 'number' && newCap > xpStore.levelCap) {
            xpStore.increaseLevelCap(newCap);
          }

          // Update state in a single `set` call
          set((state) => ({
            lastCompletedLesson: newLesson,
            lifetime: {
              ...state.lifetime,
              lessonProgress: newLesson,
            },
            nextLesson: findNext?.next ? `${findNext.next}` : 'Chapter 1-1',
          }));
        }
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
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
