import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProgressStore = {
  completedLessons: Set<string>;
  totalXP: number;

  markLessonComplete: (lessonKey: string) => void;
  hasCompletedLesson: (lessonKey: string) => boolean;

  claimXP: (amount: number) => void;
  resetProgress: () => void;
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedLessons: new Set(),
      totalXP: 0,

      markLessonComplete: (lessonKey: string) =>
        set((state) => ({
          completedLessons: new Set([...state.completedLessons, lessonKey]),
        })),

      hasCompletedLesson: (lessonKey: string) =>
        get().completedLessons.has(lessonKey),

      claimXP: (amount) =>
        set((state) => ({
          totalXP: state.totalXP + amount,
        })),

      resetProgress: () =>
        set({
          completedLessons: new Set(),
          totalXP: 0,
        }),
    }),
    {
      name: 'progress-storage',
      partialize: (state) => ({
        completedLessons: Array.from(state.completedLessons),
        totalXP: state.totalXP,
      }),
      merge: (persistedState, currentState) => {
        const restored = persistedState as any;
        return {
          ...currentState,
          ...restored,
          completedLessons: new Set(restored.completedLessons || []),
        };
      },
    }
  )
);
