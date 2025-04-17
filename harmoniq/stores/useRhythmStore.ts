import { create } from 'zustand';
import { RhythmStore } from '@/constants/types';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRhythmStore = create<RhythmStore>()(
  persist(
    (set) => ({
      calibrationOffset: 0,
      setCalibrationOffset: (offset: number) => set({ calibrationOffset: offset }),
    }),
    {
      name: 'rhythm-storage',
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
