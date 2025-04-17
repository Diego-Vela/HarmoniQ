import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProgressStore } from '@/constants/types';

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      completedLessons: 0,
      totalXP: 0,

      claimXP: (amount: number) =>
        set((state: ProgressStore) => ({
          totalXP: state.totalXP + amount,
        })),

      incrementLessonProgress: () =>
        set((state: ProgressStore) => ({
          completedLessons: state.completedLessons + 1,
        })),

      resetProgress: () =>
        set({
          totalXP: 0,
          completedLessons: 0,
        }),
    }),
    {
      name: 'progress-storage',
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
