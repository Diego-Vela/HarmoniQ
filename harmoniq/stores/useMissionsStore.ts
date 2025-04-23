import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  generateDailyMissions,
  generateWeeklyMissions,
} from '@/utils/mission-generator-util';
import { MissionStore, MissionWithProgress } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useMissions = create<MissionStore>()(
  persist(
    (set, get) => ({
      dailyMissions: [],
      weeklyMissions: [],
      claimedMissionIds: [],
      claimedWeeklyMissionIds: [],
      lastDailyKey: null,
      lastWeeklyKey: null,

      generateDailyMissions: (count: number) => {
        set({ dailyMissions: generateDailyMissions(count) });
      },

      generateWeeklyMissions: (count: number) => {
        set({ weeklyMissions: generateWeeklyMissions(count) });
      },

      resetAllMissions: () => {
        set({
          dailyMissions: [],
          weeklyMissions: [],
          claimedMissionIds: [], // Reset to an empty array
          lastDailyKey: null,
          lastWeeklyKey: null,
        });
      },

      resetDailyMissions: () => {
        set({ dailyMissions: [], claimedMissionIds: [], lastDailyKey: null });
      },

      resetWeeklyMissions: () => {
        set({ weeklyMissions: [], claimedWeeklyMissionIds: [], lastWeeklyKey: null });
      },

      incrementMissionProgress: (scope, missionId, amount = 1) => {
        const key = scope === 'daily' ? 'dailyMissions' : 'weeklyMissions';
        const currentMissions = get()[key];

        const updated = currentMissions.map((mission) =>
          mission.id === missionId
            ? {
                ...mission,
                progress: Math.min(mission.progress + amount, mission.goal),
              }
            : mission
        );

        set({ [key]: updated } as Pick<MissionStore, typeof key>);
      },

      claimMission: (missionId) => {
        if (missionId.startsWith('d')) {
          // Handle daily missions
          const claimedDaily = get().claimedMissionIds;
          if (!claimedDaily.includes(missionId)) {
            set({ claimedMissionIds: [...claimedDaily, missionId] });
          }
        } else if (missionId.startsWith('w')) {
          // Handle weekly missions
          const claimedWeekly = get().claimedWeeklyMissionIds;
          if (!claimedWeekly.includes(missionId)) {
            set({ claimedWeeklyMissionIds: [...claimedWeekly, missionId] });
          }
        }
      },

      updateMissionsFromActivity: (type, category, subcategory, xpGained = 0) => {
        const updateList = (missions: MissionWithProgress[]) =>
          missions.map((m) => {
            if (m.progress >= m.goal) return m;

            if (m.type === 'xp-earned') {
              return {
                ...m,
                progress: Math.min(m.progress + xpGained, m.goal),
              };
            }

            if (
              m.type === 'training' &&
              (m.category === category || m.category === 'any') &&
              (m.subcategory === subcategory || m.subcategory === 'any')
            ) {
              return {
                ...m,
                progress: Math.min(m.progress + 1, m.goal),
              };
            }

            return m;
          });

        set((state) => ({
          dailyMissions: updateList(state.dailyMissions),
          weeklyMissions: updateList(state.weeklyMissions),
        }));
      },

      updateLastDailyKey: (key: string) => {
        set({ lastDailyKey: key });
      },

      updateLastWeeklyKey: (key: string) => {
        set({ lastWeeklyKey: key });
      },
    }),
    {
      name: 'mission-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          const castValue = value as unknown as MissionStore;
          const copy = {
            ...value,
            claimedMissionIds: castValue.claimedMissionIds || [],
            claimedWeeklyMissionIds: castValue.claimedWeeklyMissionIds || [],
            dailyMissions: castValue.dailyMissions || [],
            weeklyMissions: castValue.weeklyMissions || [],
          };
          await AsyncStorage.setItem(name, JSON.stringify(copy));
        },
        removeItem: AsyncStorage.removeItem,
      },
    }
  )
);
