import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MedalInfo = {
  medal: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  score: number;
  accuracy: number;
  nextRequirements: string; // Added nextRequirements
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
