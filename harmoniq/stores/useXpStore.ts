import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getXPForLevel } from '@/utils/xp-utils';
import type { XPState } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface XpStore extends XPState {
  claimXP: (amount: number) => void;
  setJustLeveledUp: (value: boolean) => void;
}

export const useXpStore = create<XpStore>()(
  persist(
    (set, get) => ({
      level: 1,
      currentXP: 0,
      xpToNextLevel: getXPForLevel(1),
      streak: 0,
      totalXP: 0,
      justLeveledUp: false,

      claimXP: (amount: number) => {
        const { currentXP, level, xpToNextLevel, totalXP } = get();

        let newXP = currentXP + amount;
        let newLevel = level;
        let xpToNext = xpToNextLevel;
        let leveledUp = false;

        while (newXP >= xpToNext) {
          newXP -= xpToNext;
          newLevel += 1;
          xpToNext = getXPForLevel(newLevel);
          leveledUp = true;
        }

        if (leveledUp) {
          set({ justLeveledUp: true });
          setTimeout(() => set({ justLeveledUp: false }), 2000);
        }

        set({
          currentXP: newXP,
          level: newLevel,
          xpToNextLevel: xpToNext,
          totalXP: totalXP + amount,
        });
      },

      setJustLeveledUp: (value: boolean) => {
        set({ justLeveledUp: value });
      },
    }),
    {
      name: 'xp-storage',
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
