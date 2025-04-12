import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
        }),
    }),
    {
      name: 'progress-storage',
      partialize: (state) => ({
        totalXP: state.totalXP,
      }),
    }
  )
);
