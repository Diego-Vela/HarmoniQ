import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  generateDailyMissions,
  generateWeeklyMissions,
} from '@/utils/mission-generator-util';
import { MissionStore, MissionWithProgress } from '@/constants/types';

export const useMissions = create<MissionStore>()(
  persist(
    (set, get) => ({
      dailyMissions: [],
      weeklyMissions: [],
      claimedMissionIds: new Set(),

      generateDailyMissions: (count: number) => {
        set({ dailyMissions: generateDailyMissions(count) });
      },

      generateWeeklyMissions: (count: number) => {
        set({ weeklyMissions: generateWeeklyMissions(count) });
      },

      //Unusued Utility Function
      resetAllMissions: () => {
        set({
          dailyMissions: [],
          weeklyMissions: [],
          claimedMissionIds: new Set(),
        });
      },

      resetDailyMissions: () => {
        set({ dailyMissions: [], claimedMissionIds: new Set() });
      },
      resetWeeklyMissions: () => {
        set({ weeklyMissions: [], claimedMissionIds: new Set() });
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
        const claimed = new Set(get().claimedMissionIds);
        claimed.add(missionId);
        set({ claimedMissionIds: claimed });
      },

      updateMissionsFromActivity: (type, category, subcategory, xpGained = 0) => {
        const updateList = (missions: MissionWithProgress[]) =>
          missions.map((m) => {
            const isAlreadyComplete = m.progress >= m.goal;

            if (isAlreadyComplete) return m;

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
    }),
    {
      name: 'mission-storage',
    }
  )
);
