import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MedalInfo = {
  medal: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  score: number;
  accuracy: number;
};

type MedalStore = {
  medals: Record<string, MedalInfo>;
  setMedal: (trial: string, medal: MedalInfo) => void;
};

export const useMedalStore = create<MedalStore>()(
  persist(
    (set) => ({
      medals: {},
      setMedal: (trial, medalInfo) =>
        set((state) => ({
          medals: {
            ...state.medals,
            [trial]: medalInfo,
          },
        })),
    }),
    {
      name: 'medal-storage', // 🔐 persists to AsyncStorage
    }
  )
);
